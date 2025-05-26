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
    const { id_asignatura, texto } = req.body;
    const id_usuario = req.userId; 
    try {
        const reputacion = 0;

        const resultado = await pool.query(
            'INSERT INTO comentarios (id_asignatura, id_usuario, reputacion, texto) VALUES ($1, $2, $3, $4) RETURNING *',
            [id_asignatura, id_usuario, reputacion, texto]
        );
        res.status(201).json(resultado.rows[0]);
    } catch (error) { // Manejo de errores
        console.error('Error al crear comentario:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
}

//REPORTE DE COMENTARIO
/**
 * Un usuario puede reportar un comentario un maximo de 3 veces.
 * Un usuario no puede reportar su propio comentario.
 * @param  req.body.motivo - Motivo del reporte
 * @param  req.body.id_comentario - ID del comentario a reportar 
 * @returns ok - Indica si la operación fue exitosa
 * @returns reporte - Detalles del reporte creado
 */
export const report_comment = async (req, res) => {
    const {id_comentario, motivo} = req.body;
    const id_usuario = req.userId; 
    try { // Fecha actual en formato ISO
        const comentarioExistente = await pool.query('SELECT * FROM comentarios WHERE id = $1',[id_comentario]);
        if (comentarioExistente.rows.length === 0) return res.status(404).json({ ok:false, error: 'Comentario no encontrado.' });

        // Verifica si el usuario ya ha reportado este comentario
        const reporteExistente = await pool.query('SELECT * FROM reportes_comentarios WHERE id_usuario = $1 AND id_comentario = $2',[id_usuario, id_comentario]);
        if (reporteExistente.rows.length > 2) return res.status(400).json({ ok:false, error: 'Superaste el limite de reportes para este comentario.' });

        //Verifica si el usuario es el autor del comentario
        const comentarioAutor = await pool.query('SELECT id_usuario FROM comentarios WHERE id = $1', [id_comentario]);
        if (comentarioAutor.rows[0].id_usuario === id_usuario) return res.status(400).json({ok:false,  error: 'No puedes reportar tu propio comentario.' });

        const resultado = await pool.query('INSERT INTO reportes_comentarios (id_usuario, id_comentario, motivo) VALUES ($1, $2, $3) RETURNING *',[id_usuario, id_comentario, motivo]);
        res.status(201).json({ok:true, reporte: resultado.rows[0]});
    } catch (error) { // Manejo de errores
        console.error('Error al reportar comentario:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
}

export const get_all_reports = async (req, res) => { // Obtiene todos los reportes de comentarios
    try {
        const resultado = await pool.query('SELECT * FROM reportes_comentarios');
        res.json(resultado.rows);
    } catch (error) { // Manejo de errores
        console.error('Error al obtener reportes de comentarios:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
}