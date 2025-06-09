import { pool } from '../db.js';
import bcrypt, { compare } from 'bcrypt';

export const create_encuesta = async (req, res) => {
  try{
    const id_user = req.userId;
    const { id_asignatura, respuestas } = req.body;
    const verificacion = await pool.query(`SELECT id FROM usuarios WHERE id = $1`, [id_user]);
    const userHaveEvaluacion = await pool.query(`
      SELECT id FROM evaluacion WHERE id_usuario = $1 AND id_asignatura = $2`, [id_user, id_asignatura]);
    //if(userHaveEvaluacion.rowCount > 0) return res.status(400).json({ok: false, message: 'Ya ha respondido la encuesta'});
    if(verificacion.rowCount === 0) return res.status(404).json({ok: false, message: 'Usuario no existe'});
    const { rows: preguntasEncuesta } = await pool.query(`
      SELECT p.id
      FROM preguntas p
      JOIN encuestas e ON p.id_tipo_pregunta = e.id_tipo_pregunta
      WHERE e.id_asignatura = $1
      `, [id_asignatura]);
    const preguntasDB = preguntasEncuesta.map((fila) => fila.id);
    const preguntasUser = respuestas.map((r) => r.id_pregunta || "");
    if(preguntasDB.length !== preguntasUser.length) return res.status(400).json({ok: false, message: 'Debe responder toda la encuesta'});
    const faltantes = preguntasDB.filter(
      (idPregunta) => !preguntasUser.includes(idPregunta)
    );
    if(faltantes.length > 0) return res.status(400).json({ok: false, message: 'Faltan preguntas de id: ' + faltantes.join(", ")});
    for(const {id_pregunta, respuesta} of respuestas){
      await pool.query(
        `INSERT INTO evaluacion (id_pregunta, id_asignatura, id_usuario, respuesta)
        VALUES ($1, $2, $3, $4)`, [id_pregunta, id_asignatura, id_user, respuesta]
      );
    }
    return res.status(201).json({ok: true, message: 'Insertado correctamente'});
  }catch(error){
    console.error('Error al insertar:', error);
    return res.status(500).json({ok: false, message: 'Error interno del servidor'})
  }
}

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