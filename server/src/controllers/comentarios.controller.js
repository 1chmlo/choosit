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

export const create_comment = async (req, res) => { // Crea un nuevo comentario
    const { id_asignatura, id_usuario, fecha, reputacion, texto } = req.body;
    try {
        const resultado = await pool.query(
            'INSERT INTO comentarios (id_asignatura, id_usuario, fecha, reputacion, texto) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [id_asignatura, id_usuario, fecha, reputacion, texto]
        );
        res.status(201).json(resultado.rows[0]);
    } catch (error) { // Manejo de errores
        console.error('Error al crear comentario:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
}