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
    
    const commentExist = await pool.query('select id_usuario from comentarios where id_usuario = $1 and id_asignatura = $2', [id_usuario, id_asignatura]);
    if (commentExist.rows.length > 0) return res.status(400).json({
      message: 'Ya existe un comentario para esta asignatura, solo se puede comentar una vez por asignatura'
    });

    // Lista de palabras prohibidas
    const palabrasProhibidas = [
      // Palabras existentes
      'ql', 'puta', 'mierda', 'weon', 'ctm', 'maraco', 'csm', 'hueon', 'hueona', 
      'caca', 'pajero', 'pajera', 'pendejo', 'pendeja',
      
      // Insultos chilenos adicionales
      'flaite', 'siutico', 'aweonao', 'aweonaa', 'conchesumadre', 'reconchesumadre',
      'cagao', 'cagada', 'conchatumadre', 'ctmare', 'culiao', 'culiada', 'ordinario',
      'ordinaria', 'roto', 'rotito', 'cuico', 'picao', 'picaa', 'gil',
      
      // Mexicanismos
      'pinche', 'cabron', 'cabrona', 'verga', 'chingar', 'joder', 'culero', 'culera',
      'mamada', 'mamadas', 'pendejada', 'pendejadas', 'naco', 'nacos', 'guey', 'wey',
      'buey', 'ojete', 'ojetes', 'puto', 'putos', 'zorra', 'zorras', 'malparido',
      
      // Argentinismos
      'pelotudo', 'pelotuda', 'boludo', 'boluda', 'tarado', 'tarada', 'gil', 'giles',
      'salame', 'conchudo', 'conchuda', 'chorro', 'chorros', 'turro', 'turra',
      'gato', 'gatos', 'cheto', 'cheta', 'negro', 'negros', 'cabeza',
      
      // Colombianismos
      'hijueputa', 'malparido', 'malparida', 'gonorrea', 'marica', 'maricas',
      'sapo', 'sapito', 'lamparon', 'lambe', 'bobo', 'boba', 'bobalicon',
      'chimba', 'chimbo', 'rolo', 'rolos', 'paisa', 'paisas',
      
      // Peruanismos
      'huevon', 'huevona', 'conchatumadre', 'causa', 'cojudo', 'cojuda',
      'serrano', 'serranos', 'cholo', 'cholos', 'pituco', 'pitucos',
      'misio', 'misios', 'jerma', 'jermas',
      
      // Venezolanismos
      'mamagallismo', 'mamagallo', 'coño', 'jaja', 'lacra', 'lacras',
      'sifrino', 'sifrinos', 'catire', 'catires', 'negro', 'negros',
      'marico', 'maricos', 'burda', 'arrecho', 'arrechos',
      
      // Ecuatorianos
      'longo', 'longos', 'cholo', 'cholos', 'serrano', 'serranos',
      'montubia', 'montubios', 'costeño', 'costeños',
      
      // Centroamericanos
      'cerote', 'cerotes', 'baboso', 'babosos', 'maje', 'majes',
      'cipote', 'cipotes', 'bicho', 'bichos', 'playo', 'playos',
      
      // Insultos generales latinos
      'estupido', 'estupida', 'idiota', 'idiotas', 'imbecil', 'imbeciles',
      'tonto', 'tonta', 'tontos', 'tontas', 'bruto', 'bruta', 'brutas',
      'animal', 'animales', 'bestia', 'bestias', 'salvaje', 'salvajes',
      'cochino', 'cochina', 'cochinos', 'cochinas', 'sucio', 'sucia',
      'asqueroso', 'asquerosa', 'repugnante', 'repugnantes', 'basura',
      'escoria', 'rata', 'ratas', 'cucaracha', 'cucarachas'
    ];
    
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
    message: 'No se permiten palabras ofensivas o inapropiadas en los comentarios.'
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