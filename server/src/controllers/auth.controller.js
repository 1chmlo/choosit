import { pool } from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { createAccessToken } from "../libs/jwt.js";

export const register = async (req, res) => {

  // "id", "reputacion", "activo", "verificado" se manejan desde acá. No se reciben desde el front
  const {nombre, apellido, username, email, contrasena, anio_ingreso } = req.body || {};
  
  //Manejo completo de errores con info de cada campo
  const errores = [];
  if (!nombre) errores.push('nombre');
  if (!apellido) errores.push('apellido');
  if (!username) errores.push('username');
  if (!email) errores.push('email');
  if (!contrasena) errores.push('contrasena');
  if (!anio_ingreso) errores.push('anio_ingreso');

  if (errores.length > 0) {
    return res.status(400).json({ message: 'Faltan campos obligatorios', campos: errores });
  }
  
  //Validar que el usuario no exista
  const usuarioExistente = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
  if (usuarioExistente.rows.length > 0) {
    return res.status(400).json({ message: 'El usuario ya existe' });
  }
  //hashear contraseña
  const contrasena_hasheada = await bcrypt.hash(contrasena, 10);

  //asignar id, reputacion, activo, verificado
  const id = uuidv4();
  const reputacion = 0;
  const activo = true;
  const verificado = false;

  //insertar usuario en la base de datos
  const nuevoUsuario = await pool.query('INSERT INTO usuarios (id, nombre, apellido, username, email, contrasena, anio_ingreso, reputacion, activo, verificado) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', [id, nombre, apellido, username, email, contrasena_hasheada, anio_ingreso, reputacion, activo, verificado]);
  if (nuevoUsuario.rowCount === 0) {
    return res.status(400).json({ message: 'Error al crear el usuario' });
  }

   // Crear token de acceso
   const token = createAccessToken({
    id,
    username,
    activo,
    verificado
  });

  // Establecer cookie con el token
  res.cookie('token', token, {
    secure: true,
    sameSite: 'none',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días en milisegundos (para que coincida con el expiresIn del token)
    path: '/'                        // Disponible en toda la aplicación
  });

  //debug para ver si se recibe el body y las variables asignadas
  //console.log(req.body);
  //console.log({id, reputacion, activo, verificado, contrasena_hasheada});  
  
  return res.status(201).json({ message: 'Usuario creado correctamente', nuevoUsuario: { id, nombre, apellido, username, email, anio_ingreso, reputacion, activo, verificado }, token });
}


export const login = async (req, res) => {

}
