import { pool } from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt, { compare } from 'bcrypt';
import { createAccessToken } from "../libs/jwt.js";
import { transport, sendMail, sendVerificationEmail } from '../libs/mailer.js';
import { BACKEND_URL, FRONTEND_URL, JWT_SECRET, MAX_AGE_TOKEN } from '../config.js';
import jwt from 'jsonwebtoken';


export const me = async (req, res) => {
  try {
    // Get user ID from middleware
    const userId = req.userId;
    
    // Query the database for complete user information
    const userResult = await pool.query(
      'SELECT id, nombre, apellido, username, email, anio_ingreso, reputacion, activo, verificado, created_at FROM usuarios WHERE id = $1', 
      [userId]
    );
    
    // Check if user exists
    if (userResult.rows.length === 0) {
      return res.status(404).json({ 
        ok: false, 
        message: 'Usuario no encontrado' 
      });
    }
    
    // Get user data without sensitive fields
    const userData = userResult.rows[0];
    
    // Return user data
    return res.status(200).json({
      ok: true,
      user: userData
    });
    
  } catch (error) {
    console.error('Error al obtener datos del usuario:', error);
    return res.status(500).json({ 
      ok: false, 
      message: 'Error interno del servidor' 
    });
  }
}


export const register = async (req, res) => {
  try{
  // Aca no se realizan validaciones de los campos, porque el middleware de express-validator se encarga de eso
  // Se asume que el body ya fue validado y sanitizado por express-validator

  // "id", "reputacion", "activo", "verificado" se crean y manejan desde acá. No se reciben desde el front
  const {nombre, apellido, username, email, contrasena, anio_ingreso } = req.body;

  //Validar que el usuario no exista
  const usuarioExistente = await pool.query('SELECT * FROM usuarios WHERE email = $1 or username = $2', [email, username]);

  if (usuarioExistente.rows.length > 0) {

    const usuario = usuarioExistente.rows[0];

    const isVerified = usuario.verificado; 

    const isMenorQueUnDia = new Date(usuario.created_at) > new Date(Date.now() -  60 * 1000);

    //Si el usuario existe, verificar si está verificado
    if (isVerified || isMenorQueUnDia) return res.status(400).json({ message: 'El usuario ya existe' }); //protege el registro actual

    // Si el usuario existe, no está verificado y ya pasaron 24hrs, eliminar el registro antiguo (para permitir al dueño real registrarse)
    const usuario_eliminado = await pool.query('DELETE FROM usuarios WHERE id = $1 RETURNING *', [usuario.id]);
    const { id, nombre, apellido, username, email, contrasena, anio_ingreso } = usuario_eliminado.rows[0];
    console.log(`Usuario no verificado antiguo eliminado: ${id, nombre, apellido, username, email, contrasena, anio_ingreso}`);
}

  //hashear contraseña
  const contrasena_hasheada = await bcrypt.hash(contrasena, 10);

  //asignar reputacion, activo, verificado
  const reputacion = 0;
  const activo = true;
  const verificado = false;

  //insertar usuario en la base de datos
  const nuevoUsuario = await pool.query('INSERT INTO usuarios (nombre, apellido, username, email, contrasena, anio_ingreso, reputacion, activo, verificado) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', [nombre, apellido, username, email, contrasena_hasheada, anio_ingreso, reputacion, activo, verificado]);
  
  if (nuevoUsuario.rowCount === 0) return res.status(400).json({ message: 'Error al crear el usuario' });

  // Obtener el id del nuevo usuario
  const { id, created_at} = nuevoUsuario.rows[0];

  // Crear token de acceso, no se asigna a la cookie hasta que el usuario verifique su cuenta
  const token = createAccessToken({id, username, activo, verificado, "rol": "usuario"});

  // Enviar correo de verificación
  // TODO: Validar que el email sea enviado y recibido de forma correcta
  const mail = await sendVerificationEmail(email, username, token, `${FRONTEND_URL}/verificar-correo`)
  console.log(mail); 
  
  return res.status(201).json({ ok: true, message: 'Usuario creado correctamente', nuevoUsuario: { id, nombre, apellido, username, email, anio_ingreso, reputacion, activo, verificado, created_at }});
  
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}


export const login = async (req, res) => {
  try {
  console.log(req.body);
 // "id", "reputacion", "activo", "verificado" se manejan desde acá. No se reciben desde el front
  const {email,contrasena} = req.body;
  
  //Validar que el usuario exista
  const consulta = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
  if (consulta.rows.length === 0) {
    return res.status(400).json({ message: 'El usuario no existe' });
  }
  const usuarioExistente = consulta.rows[0];
  const contrasena_hasheada = usuarioExistente.contrasena;
  const verificado = usuarioExistente.verificado;
  
  //Validar contraseña
  const contrasenaValida = await bcrypt.compare(contrasena, contrasena_hasheada);
  if (!contrasenaValida) {
    return res.status(400).json({ message: 'Contraseña incorrecta' });
  }

  //Validar que el usuario esté verificado
  if (!verificado) {
    return res.status(400).json({ message: 'El usuario no está verificado' });
  }
  const token = createAccessToken({
    id: usuarioExistente.id,
    username: usuarioExistente.username,
    activo: usuarioExistente.activo,
    verificado: usuarioExistente.verificado,
    "rol": "usuario"
  });
  // Establecer cookie con el token
  res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: MAX_AGE_TOKEN
});

return res.status(200).json({
      ok: true,
      message: "Login exitoso",
      user: {
        id: usuarioExistente.id,
        username: usuarioExistente.username,
        email: usuarioExistente.email,
        activo: usuarioExistente.activo,
        verificado: usuarioExistente.verificado
      }
    });

}
  catch (error) {
    console.error('Error al iniciar sesión:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}


export const verify = async (req, res) => {

  //busca el token en la url (query param)
  const { token } = req.query;

  // Verificar el token
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { id } = decoded;
    // Actualizar el estado de verificación del usuario en la base de datos
    const result = await pool.query('UPDATE usuarios SET verificado = $1 WHERE id = $2', [true, id]);
    
    // Verificar si se actualizó alguna fila
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: MAX_AGE_TOKEN, // 7 días en milisegundos (para que coincida con el expiresIn del token)
    });
    
    return res.status(200).json({ message: 'Usuario verificado correctamente', id });
  } catch (error) {
    console.error('Error al verificar el token:', error);
    return res.status(400).json({ message: 'Token inválido o expirado' });
  }
}

export const logout = async (req, res) => {
  try {
    // Eliminar la cookie que contiene el token
    res.clearCookie('token', {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
      path: '/'
    });
    
    return res.status(200).json({ message: 'Sesión cerrada correctamente' });
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}