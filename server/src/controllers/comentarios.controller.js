import { pool } from '../db.js';

export const get_all_comments = async (req, res) => { // Obtiene todos los comentarios
    try {
        const resultado = await pool.query('SELECT * FROM comentarios');
        res.json(resultado.rows);
    } catch (error) { // Manejo de errores
        console.error('Error al obtener comentarios:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
    }

export const create_comment = async (req, res) => {
  try {
    // Obtener información del usuario de la solicitud (añadida por el middleware isAuthUser)
    const id_usuario = req.userId;
    
    // Datos del comentario del cuerpo de la solicitud
    const { id_asignatura, texto } = req.body;
    
    // Validar que los campos necesarios estén presentes
    if (!id_asignatura || !texto) {
      return res.status(400).json({ 
        message: 'Se requiere id_asignatura y texto para crear un comentario' 
      });
    }
    
    // Establecer valores iniciales
    const reputacion = 0;
    const fecha = new Date();
    
    // Insertar el comentario en la base de datos
    const result = await pool.query(
      'INSERT INTO comentarios (id_usuario, id_asignatura, reputacion, fecha, texto) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [id_usuario, id_asignatura, reputacion, fecha, texto]
    );
    
    // Verificar si la inserción fue exitosa
    if (result.rowCount === 0) {
      return res.status(500).json({ message: 'Error al crear el comentario' });
    }
    
    return res.status(201).json({
      message: 'Comentario creado exitosamente',
      comentario: result.rows[0]
    });
  } catch (error) {
    console.error('Error al crear comentario:', error);
    
    // Manejar error específico de clave foránea
    if (error.code === '23503') { // Violation of foreign key constraint
      return res.status(400).json({ 
        message: 'La asignatura especificada no existe' 
      });
    }
    
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};