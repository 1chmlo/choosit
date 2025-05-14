import { pool } from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt, { compare } from 'bcrypt';
import { createAccessToken } from "../libs/jwt.js";
import { transport, sendMail, sendVerificationEmail } from '../libs/mailer.js';
import { BACKEND_URL, JWT_SECRET, MAX_AGE_TOKEN } from '../config.js';
import jwt from 'jsonwebtoken';


export const isAuthUserContent = (req, res) => {
  //console.log(req.userId, req.userUsername, req.userActivo, req.userVerificado);
  return res.status(200).json({ message: "Ruta protegida", userId: req.userId, userUsername: req.userUsername, userActivo: req.userActivo, userVerificado: req.userVerificado });
}


export const register = async (req, res) => {
  // Aca no se realizan validaciones de los campos, porque el middleware de express-validator se encarga de eso
  // Se asume que el body ya fue validado y sanitizado por express-validator

  // "id", "reputacion", "activo", "verificado" se crean y manejan desde acá. No se reciben desde el front
  const {nombre, apellido, username, email, contrasena, anio_ingreso } = req.body;
  
  //Validar que el usuario no exista
  const usuarioExistente = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
  if (usuarioExistente.rows.length > 0) {
    return res.status(400).json({ message: 'El usuario ya existe' });
  }

  //hashear contraseña
  const contrasena_hasheada = await bcrypt.hash(contrasena, 10);

  //asignar id, reputacion, activo, verificado
  //const id = uuidv4();
  const reputacion = 0;
  const activo = true;
  const verificado = false;

  //insertar usuario en la base de datos
  const nuevoUsuario = await pool.query('INSERT INTO usuarios (nombre, apellido, username, email, contrasena, anio_ingreso, reputacion, activo, verificado) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', [nombre, apellido, username, email, contrasena_hasheada, anio_ingreso, reputacion, activo, verificado]);
  
  if (nuevoUsuario.rowCount === 0) {
    return res.status(400).json({ message: 'Error al crear el usuario' });
  }

  // Obtener el id del nuevo usuario
  const { id } = nuevoUsuario.rows[0];



   // Crear token de acceso, no se asigna a la cookie hasta que el usuario verifique su cuenta
   const token = createAccessToken({id, username, activo, verificado, "rol": "usuario"});

  // Enviar correo de verificación
  // TODO: Validar que el email sea enviado y recibido de forma correcta
  const mail = await sendVerificationEmail(email, username, token, `${BACKEND_URL}/api/auth/verify`)
  console.log(mail); 
  
  return res.status(201).json({ message: 'Usuario creado correctamente', nuevoUsuario: { id, nombre, apellido, username, email, anio_ingreso, reputacion, activo, verificado }});
}


export const login = async (req, res) => {
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


export const verify = async (req, res) => {

  //busca el token en la url (query param)
  const { token } = req.query;

  // Verificar el token
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { id } = decoded;
    // Actualizar el estado de verificación del usuario en la base de datos
    await pool.query('UPDATE usuarios SET verificado = $1 WHERE id = $2', [true, id]);
    
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