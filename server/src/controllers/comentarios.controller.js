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
    
    // Lista de palabras prohibidas
    const palabrasProhibidas = ['ql', 'puta', 'mierda', 'weon', 'ctm', 'maraco', 'csm', 'hueon', 'hueona', 'caca', 'pajero', 'pajera', 'pendejo', 'pendeja'];
    
   // Crear expresiones regulares para cada palabra
const regexPalabrasProhibidas = palabrasProhibidas.map(palabra => 
  new RegExp(`${palabra.split('').join('[\\s\\W_]*')}`, 'i')
);

// Verificar si contiene palabras prohibidas
const contieneProhibida = regexPalabrasProhibidas.some(regex => 
  regex.test(texto)
);

if (contieneProhibida) {
  return res.status(400).json({
    message: 'El comentario contiene lenguaje inapropiado'
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