import { pool } from '../db.js';

export const create_question_type = async (req, res) => {
    try{
        const {tipo_pregunta} = req.body || {}; 
        const nuevo_tipo = await poll.query('INSERT INTO tipo_pregunta (tipo) VALUES ($1)', [tipo_pregunta])   
        if (nuevo_tipo.rowCount === 0) return res.status(400).json({ message: 'Error al crear el tipo de pregunta' });
        return res.status(200).json({ ok: true, message: 'Creacion del tipo generado corretamente' });

    } catch (error){
        console.error('Error al crear tipo', error);
        return res.status(500).json({ message: 'Error interno del servidor' });

    }
}