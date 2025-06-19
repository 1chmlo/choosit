import { pool } from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt, { compare } from 'bcrypt';
import { createAccessToken } from "../libs/jwt.js";
import { transport, sendMail, sendVerificationEmail, resendVerificationEmail, sendResetPasswordEmail } from '../libs/mailer.js';
import { BACKEND_URL, FRONTEND_URL, JWT_SECRET, MAX_AGE_TOKEN } from '../config.js';
import jwt from 'jsonwebtoken';


export const register = async (req, res) => {
  try{
  // Aca no se realizan validaciones de los campos, porque el middleware de express-validator se encarga de eso
  // Se asume que el body ya fue validado y sanitizado por express-validator

  // "id", "reputacion", "activo", "verificado" se crean y manejan desde acá. No se reciben desde el front
  const {username, email, contrasena, anio_ingreso } = req.body;

  // Extraer nombre y apellido del username (el punto es obligatorio)
  const extractNameFromUsername = (username) => {
    // Remover números y guión bajo + letra al final
    const cleanUsername = username.replace(/\d+$|_[a-zA-Z]$/, '');
    
    // Dividir por el punto (debe existir al menos uno)
    const dotIndex = cleanUsername.indexOf('.');
    
    if (dotIndex === -1) {
      throw new Error('Username debe tener formato nombre.apellido');
    }
    
    const nombre = cleanUsername.substring(0, dotIndex);
    const apellido = cleanUsername.substring(dotIndex + 1);
    
    return { nombre, apellido };
  };

  const { nombre, apellido } = extractNameFromUsername(username);

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
    const { id, username, email, contrasena, anio_ingreso } = usuario_eliminado.rows[0];
    console.log(`Usuario no verificado antiguo eliminado: ${id, username, email, contrasena, anio_ingreso}`);
}

  //hashear contraseña
  const contrasena_hasheada = await bcrypt.hash(contrasena, 10);

  //asignar reputacion, activo, verificado
  const reputacion = 0;
  const activo = true;
  const verificado = false;

  //insertar usuario en la base de datos (incluyendo nombre y apellido)
  const nuevoUsuario = await pool.query('INSERT INTO usuarios (username, email, contrasena, nombre, apellido, anio_ingreso, reputacion, activo, verificado) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', [username, email, contrasena_hasheada, nombre, apellido, anio_ingreso, reputacion, activo, verificado]);
  
  if (nuevoUsuario.rowCount === 0) return res.status(400).json({ message: 'Error al crear el usuario' });

  // Obtener el id del nuevo usuario
  const { id, created_at} = nuevoUsuario.rows[0];

  // Crear token de acceso, no se asigna a la cookie hasta que el usuario verifique su cuenta
  const token = createAccessToken({id, username, activo, verificado, "rol": "usuario"});

  // Enviar correo de verificación
  // TODO: Validar que el email sea enviado y recibido de forma correcta
  const mail = await sendVerificationEmail(email, username, token, `${FRONTEND_URL}/verificar-correo`)
  console.log(mail); 
  
  return res.status(201).json({ ok: true, message: 'Usuario creado correctamente', nuevoUsuario: { id, username, email, nombre, apellido, anio_ingreso, reputacion, activo, verificado, created_at }});
  
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}


export const login = async (req, res) => {
  try {
 // console.log(req.body);
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
    return res.status(400).json({ ok:false, message: 'Contraseña incorrecta' });
  }

  //Validar que el usuario esté verificado
  if (!verificado) {
    return res.status(400).json({ ok:false, message: 'El usuario no está verificado' });
  }

  //Validar que el usuario esté activo
  if (!usuarioExistente.activo) return res.status(403).json({ ok:false ,message: 'Cuenta desactivada' });

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
      },
      token
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
      secure: true,
      sameSite: 'none',
      path: '/'
    });
    
    return res.status(200).json({ message: 'Sesión cerrada correctamente' });
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}


export const resendEmail = async (req, res) => {

  try{
  
  const userMail = req.body.email;

  const user = await pool.query('SELECT * FROM usuarios WHERE email = $1', [userMail]);

  if (user.rows.length === 0) return res.status(400).json({ ok:false, message: 'El usuario no existe' })
  
  const { id, username, activo, verificado } = user.rows[0];

  if(verificado) return res.status(409).json({ok: false, message: 'El usuario ya está verificado'})
  
  // Crear token de acceso, no se asigna a la cookie hasta que el usuario verifique su cuenta
  const token = createAccessToken({id, username, activo, verificado, "rol": "usuario"});
  
  const mail = await resendVerificationEmail(userMail, username, token, `${FRONTEND_URL}/verificar-correo`)
  
  return res.status(200).json({ ok: true, message: 'Correo de verificación enviado correctamente'});

  }catch (error) {
    console.error('Error al reenviar correo de verificación:', error);
    return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
  }
}


/**
 * 
 * Recibe email en req.body y retorna un correo de restablecimiento de contraseña al usuario.
 * Crea un token de acceso especial solo para restablecimiento de contraseña. (no da acceso a nada más)
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Validar que el usuario exista
    const user = await pool.query('SELECT id, username FROM usuarios WHERE email = $1', [email]);

    if (user.rows.length === 0) return res.status(400).json({ ok: false, message: 'El usuario no existe' });

    const { id, username } = user.rows[0];

    // Crear token de acceso para restablecimiento de contraseña
    const token = createAccessToken({ id, username, "tipo": "reset-password" });
    console.log("id", id) 

    // Enviar correo de restablecimiento de contraseña
    const emailResult = await sendResetPasswordEmail(
      email,
      username,
      token,
      `${FRONTEND_URL}/restablecer-contrasena`
    );
    
    // Verificar si el correo se envió correctamente
    if (!emailResult) {
      return res.status(500).json({ ok: false, message: 'Error al enviar el correo de restablecimiento de contraseña' });
    }
    
    // Verificar rejected array para asegurarse de que el correo no fue rechazado
    if (emailResult.rejected && emailResult.rejected.length > 0) {
      return res.status(500).json({ 
        ok: false, 
        message: 'El correo fue rechazado por el servidor de correo electrónico'
      });
    }
    return res.status(200).json({ ok: true, message: 'Correo de restablecimiento de contraseña enviado correctamente' });
  } catch (error) {
    console.error('Error en forgotPassword:', error);
    return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
  }
}

export const resetPassword = async (req, res) => {
  try {
    const id = req.userId;
    const { contrasena } = req.body;

    // Hashear la nueva contraseña
    const contrasenaHasheada = await bcrypt.hash(contrasena, 10);

    // Actualizar la contraseña en la base de datos
    const result = await pool.query('UPDATE usuarios SET contrasena = $1 WHERE id = $2', [contrasenaHasheada, id]);

    // Verificar si se actualizó alguna fila
    if (result.rowCount === 0) return res.status(404).json({ ok: false, message: 'Usuario no encontrado' });

    return res.status(200).json({ ok: true, message: 'Contraseña restablecida correctamente' });

  } catch (error) {
    console.error('Error al restablecer la contraseña:', error);
    return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
  }
}

export const deactivateUser = async (req, res) => {
  try {
    // Obtener el ID del usuario desde el token
    const userId = req.userId;
    
    // Actualizar el estado del usuario a inactivo en la base de datos
    const result = await pool.query(
      'UPDATE usuarios SET activo = $1 WHERE id = $2 RETURNING id',
      [false, userId]
    );
    
    // Verificar si se actualizó correctamente
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    // Limpiar la cookie del token
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/'
    });
    
    return res.status(200).json({ ok:true, message: 'Usuario desactivado correctamente' });
  } catch (error) {
    console.error('Error al desactivar usuario:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}


/**
 * 
 * Recibe email en req.body y retorna un correo de activar cuenta al usuario.
 * Crea un token de acceso especial solo para activar cuenta. (no da acceso a nada más)
 */
export const requestActivate = async (req, res) => {
  try {
    const { email } = req.body;

    // Validar que el usuario exista
    const user = await pool.query('SELECT id, username, activo FROM usuarios WHERE email = $1', [email]);

    if (user.rows.length === 0) return res.status(400).json({ ok: false, message: 'El usuario no existe' });

    const { id, username, activo } = user.rows[0];

    if(activo) return res.status(409).json({ ok: false, message: 'El usuario ya está activo' });

    // Crear token de acceso para activar cuenta
    const token = createAccessToken({ id, username, "tipo": "activate-account" });
    console.log("id", id) 

    // Enviar correo de activar cuenta
    const emailResult = await sendActivateAccountEmail(
      email,
      username,
      token,
      `${FRONTEND_URL}/activar-cuenta`
    );
    
    // Verificar si el correo se envió correctamente
    if (!emailResult) {
      return res.status(500).json({ ok: false, message: 'Error al enviar el correo de activar cuenta' });
    }
    
    // Verificar rejected array para asegurarse de que el correo no fue rechazado
    if (emailResult.rejected && emailResult.rejected.length > 0) {
      return res.status(500).json({ 
        ok: false, 
        message: 'El correo fue rechazado por el servidor de correo electrónico'
      });
    }
    return res.status(200).json({ ok: true, message: 'Correo de activar cuenta enviado correctamente' });
  } catch (error) {
    console.error('Error en requestActivate:', error);
    return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
  }
}

export const activateAccount = async (req, res) => {
  try {
    // Obtener el ID del usuario desde el token
    const userId = req.userId;

    const activoToken = req.userActivo;

    if(activoToken) return res.status(409).json({ ok: false, message: 'El usuario ya está activo' });

    // Verificar que el usuario exista y no esté activo
    const user = await pool.query('SELECT id, activo FROM usuarios WHERE id = $1', [userId]);

    if (user.rows.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });

    if (user.rows[0].activo) return res.status(409).json({ message: 'El usuario ya está activo' });

    

    // Actualizar el estado del usuario a activo en la base de datos
    const result = await pool.query(
      'UPDATE usuarios SET activo = $1 WHERE id = $2 RETURNING id',
      [true, userId]
    );
    
    // Verificar si se actualizó correctamente
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Usuario no actualizado' });
    }
    
    return res.status(200).json({ message: 'Cuenta activada correctamente', id: result.rows[0].id });
  } catch (error) {
    console.error('Error al activar cuenta:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}
