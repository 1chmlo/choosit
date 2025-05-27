import { pool } from '../db.js';

export const create_question_type = async (req, res) => {
    try{
        const {tipo_pregunta} = req.body || {}; 
        const nuevo_tipo = await pool.query('INSERT INTO tipo_pregunta (tipo) VALUES ($1)', [tipo_pregunta])   

        if (nuevo_tipo.rowCount === 0) return res.status(400).json({ message: 'Error al crear el tipo de pregunta' });

        return res.status(200).json({ ok: true, message: 'Creacion del tipo generado corretamente' });

    } catch (error){
        console.error('Error al crear tipo', error);
        return res.status(500).json({ message: 'Error interno del servidor' });

    }
}

export const get_question_types = async (req, res) => {
    try {
        const tipos_pregunta = await pool.query('SELECT * FROM tipo_pregunta');
        return res.status(200).json({ok:true, tipo_preguntas: tipos_pregunta.rows});
    } catch (error) {
        console.error('Error al obtener tipos de pregunta', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
}


export const create_question = async (req, res) => {
    try {
        const { pregunta, id_tipo_pregunta } = req.body || {};
        const nuevo_pregunta = await pool.query('INSERT INTO preguntas (pregunta, id_tipo_pregunta) VALUES ($1, $2)', [pregunta, id_tipo_pregunta]);

        if (nuevo_pregunta.rowCount === 0) return res.status(400).json({ ok:false, message: 'Error al crear la pregunta' });

        return res.status(200).json({ ok: true, message: 'Pregunta creada correctamente' });

    } catch (error) {
        console.error('Error al crear pregunta', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
}

export const get_questions = async (req, res) => {
    try {
        const preguntas = await pool.query('SELECT * FROM preguntas');
        return res.status(200).json({ok:true, preguntas: preguntas.rows});
    } catch (error) {
        console.error('Error al obtener preguntas', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
}