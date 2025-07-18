import { pool } from '../db.js';

export const get_all_comments = async (req, res) => { // Obtiene todos los comentarios
    try {
        const resultado = await pool.query('SELECT * FROM comentarios WHERE activo');
        res.json(resultado.rows);
    } catch (error) { // Manejo de errores
        console.error('Error al obtener comentarios:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
    }

export const create_comment = async (req, res) => {
  try {
    const id_usuario = req.userId;
    const { id_asignatura, texto } = req.body;

  

    // Establecer valores iniciales
    const reputacion = 0;
    const fecha = new Date();
    
    // Insertar el comentario en la base de datos
    const result = await pool.query(
      'INSERT INTO comentarios (id_usuario, id_asignatura, reputacion, fecha, texto) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [id_usuario, id_asignatura, reputacion, fecha, texto]
    );
    
    if (result.rowCount === 0) {
      return res.status(500).json({ message: 'Error al crear el comentario' });
    }
    
    return res.status(201).json({
      message: 'Comentario creado exitosamente',
      comentario: result.rows[0]
    });
  } catch (error) {
    console.error('Error al crear comentario:', error);
    
    if (error.code === '23503') {
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
        // Consulta con JOIN para obtener datos del comentario junto con el reporte
        const resultado = await pool.query(`
            SELECT 
                rc.*,
                c.texto AS contenido_comentario,
                c.fecha AS fecha_comentario,
                c.id_usuario AS autor_comentario
            FROM 
                reportes_comentarios rc
            LEFT JOIN 
                comentarios c ON rc.id_comentario = c.id
            WHERE 
                rc.revisado = false
            ORDER BY
                rc.fecha DESC
        `);
        
        res.json(resultado.rows);
    } catch (error) { // Manejo de errores
        console.error('Error al obtener reportes de comentarios:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
}

export const update_comment = async (req, res) => {
  try {
    // Obtener el ID del comentario de los parámetros
    const { id } = req.params;
    
    // Obtener el nuevo texto del cuerpo de la solicitud
    const { texto } = req.body;
    
    // Obtener el ID del usuario autenticado (añadido por middleware isAuthUser)
    const id_usuario = req.userId;

    // Verificar si el comentario existe y pertenece al usuario
    const comentario = await pool.query(
      'SELECT * FROM comentarios WHERE id = $1',
      [id]
    );

    // Si el comentario no existe
    if (comentario.rows.length === 0) {
      return res.status(404).json({ 
        message: 'Comentario no encontrado' 
      });
    }

    // Si el comentario no pertenece al usuario
    if (comentario.rows[0].id_usuario.toString() !== id_usuario.toString()) {
      return res.status(403).json({ 
        message: 'No tienes permiso para editar este comentario' 
      });
    }
    // Actualizar el comentario y resetear su reputación a 0
    const result = await pool.query(
      'UPDATE comentarios SET texto = $1, reputacion = 0 WHERE id = $2 RETURNING *',
      [texto, id]
    );

    return res.status(200).json({
      message: 'Comentario actualizado exitosamente',
      comentario: result.rows[0]
    });
  } catch (error) {
    console.error('Error al editar comentario:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

/**
 * Función para dar/quitar like a un comentario
 */
/**
 * Da o quita like a un comentario
 * @param {Object} req - Request con id de comentario en params
 * @param {Object} res - Response
 * @returns {Object} Mensaje de éxito o error
 */
export const like_comment = async (req, res) => {
  try {
    // Obtener ID del comentario y usuario autenticado
    const { id } = req.params;
    const id_usuario = req.userId;
    
    // Verificar que el comentario existe
    const commentResult = await pool.query(
      'SELECT id_usuario, likes_usuarios FROM comentarios WHERE id = $1', 
      [id]
    );
    
    if (commentResult.rows.length === 0) {
      return res.status(404).json({ 
        message: 'Comentario no encontrado' 
      });
    }
    
    const autor_id = commentResult.rows[0].id_usuario;
    
    // Iniciar transacción
    await pool.query('BEGIN');
    
    try {
      // Verificar si el usuario ya dio like
      const usuarioYaLiked = await pool.query(
        'SELECT $1 = ANY(likes_usuarios) as ya_liked FROM comentarios WHERE id = $2',
        [id_usuario, id]
      );
      
      if (usuarioYaLiked.rows[0].ya_liked) {
        // Quitar like
        await pool.query(
          'UPDATE comentarios SET likes_usuarios = array_remove(likes_usuarios, $1), reputacion = reputacion - 1 WHERE id = $2',
          [id_usuario, id]
        );
        
        // Actualizar reputación del autor (suma de todos sus comentarios)
        await pool.query(
          'UPDATE usuarios SET reputacion = (SELECT COALESCE(SUM(reputacion), 0) FROM comentarios WHERE id_usuario = $1) WHERE id = $1',
          [autor_id]
        );
        
        await pool.query('COMMIT');
        
        return res.status(200).json({
          message: 'Like removido correctamente',
          liked: false
        });
      } else {
        // Añadir like
        await pool.query(
          'UPDATE comentarios SET likes_usuarios = array_append(likes_usuarios, $1), reputacion = reputacion + 1 WHERE id = $2',
          [id_usuario, id]
        );
        
        // Actualizar reputación del autor (suma de todos sus comentarios)
        await pool.query(
          'UPDATE usuarios SET reputacion = (SELECT COALESCE(SUM(reputacion), 0) FROM comentarios WHERE id_usuario = $1) WHERE id = $1',
          [autor_id]
        );
        
        await pool.query('COMMIT');
        
        return res.status(200).json({
          message: 'Like agregado correctamente',
          liked: true
        });
      }
    } catch (error) {
      await pool.query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error al dar like al comentario:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

/**
 * Elimina un comentario (solo admin) - Aprueba los reportes
 */
export const admin_delete_comment = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el comentario existe
    const comentario = await pool.query(
      'SELECT * FROM comentarios WHERE id = $1',
      [id]
    );

    if (comentario.rows.length === 0) {
      return res.status(404).json({ 
        message: 'Comentario no encontrado' 
      });
    }

    // Verificar que el comentario no esté ya eliminado
    if (!comentario.rows[0].activo) {
      return res.status(400).json({ 
        message: 'El comentario ya está eliminado' 
      });
    }

    // Iniciar transacción
    await pool.query('BEGIN');

    try {
      // Marcar comentario como inactivo
      await pool.query(
        'UPDATE comentarios SET activo = false WHERE id = $1',
        [id]
      );

      // Marcar todos los reportes del comentario como revisados
      await pool.query(
        'UPDATE reportes_comentarios SET revisado = true WHERE id_comentario = $1',
        [id]
      );

      // Actualizar la reputación del usuario (recalcular solo comentarios activos)
      const autor_id = comentario.rows[0].id_usuario;
      await pool.query(
        'UPDATE usuarios SET reputacion = (SELECT COALESCE(SUM(reputacion), 0) FROM comentarios WHERE id_usuario = $1 AND activo = true) WHERE id = $1',
        [autor_id]
      );

      await pool.query('COMMIT');

      return res.status(200).json({
        message: 'Comentario eliminado exitosamente'
      });

    } catch (error) {
      await pool.query('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error('Error al eliminar comentario:', error);
    return res.status(500).json({ 
      message: 'Error interno del servidor' 
    });
  }
};

/**
 * Rechaza los reportes de un comentario (solo admin)
 */
export const admin_reject_reports = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el comentario existe
    const comentario = await pool.query(
      'SELECT * FROM comentarios WHERE id = $1',
      [id]
    );

    if (comentario.rows.length === 0) {
      return res.status(404).json({ 
        message: 'Comentario no encontrado' 
      });
    }

    // Verificar que hay reportes sin revisar para este comentario
    const reportesPendientes = await pool.query(
      'SELECT COUNT(*) as count FROM reportes_comentarios WHERE id_comentario = $1 AND revisado = false',
      [id]
    );

    if (parseInt(reportesPendientes.rows[0].count) === 0) {
      return res.status(400).json({ 
        message: 'No hay reportes pendientes para este comentario' 
      });
    }

    // Marcar todos los reportes del comentario como revisados (rechazados)
    const result = await pool.query(
      'UPDATE reportes_comentarios SET revisado = true WHERE id_comentario = $1 AND revisado = false',
      [id]
    );

    return res.status(200).json({
      message: `Reportes rechazados exitosamente. ${result.rowCount} reportes marcados como revisados.`
    });

  } catch (error) {
    console.error('Error al rechazar reportes:', error);
    return res.status(500).json({ 
      message: 'Error interno del servidor' 
    });
  }
};
/*
Obtener comentarios reportados y para cada comentario reportado:
  - Cantidad de reportes
  - Texto
  - Usuario que realizó el comentario y lista de reportes
Desde lista de reportes:
  - Usuario que reportó
  - Motivo del reporte
*/
export const report_revision = async (req, res) => {
  try {
    const comentarios = await pool.query(
      `SELECT c.id, COUNT(rc.id) as cantidad_reportes, u.username, c.texto
      FROM comentarios c
      INNER JOIN reportes_comentarios rc ON c.id = rc.id_comentario
      JOIN usuarios u ON c.id_usuario = u.id
      WHERE rc.revisado = false
      GROUP BY c.id, u.username, c.texto`
    )
    const result = [];
    for(const comentario of comentarios.rows){
      const reportes = await pool.query(
        `SELECT u.username, rc.motivo
        FROM reportes_comentarios rc
        JOIN usuarios u ON rc.id_usuario = u.id
        WHERE rc.id_comentario = $1 AND rc.revisado = false`,
        [comentario.id]
      )
      result.push({
        id: comentario.id,
        cantidad_reportes: parseInt(comentario.cantidad_reportes),
        username: comentario.username,
        texto: comentario.texto,
        lista_reportes: reportes.rows
      });
    }
    return res.status(200).json({
      message: 'Comentarios reportados obtenidos exitosamente',
      data: result
    });
  } catch (error) {
    console.error('Error al obtener comentarios reportados ', error);
    return res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
}