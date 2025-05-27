import { pool } from '../db.js';
import bcrypt, { compare } from 'bcrypt';

export const delete_encuesta = async (req, res) => {
  try{
  const id = req.userId; //Obtiene el id del usuario para trabajar con el
  const { id_asignatura  } = req.params;
  const verificacion = await pool.query('SELECT id FROM usuarios WHERE id = $1', [id]);


  if (verificacion.rowCount === 0) return res.status(404).json({ ok: false, message: 'Usuario no existe' });
  
      const result = await pool.query(`DELETE FROM evaluacion
    WHERE id_usuario = $1
    AND id_asignatura = $2;
    )
    `, [id, id_asignatura]);

    if (result.rowCount === 0) {
      return res.status(404).json({ ok: false, message: 'No se encontraron respuestas para eliminar' });
    }

    return res.status(200).json({ ok: true, message: 'Se eliminaron las respuestas del usuario en la encuesta' });

  } catch (error) {
    console.error('Error al eliminar la encuesta:', error);
    return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
  }


}
