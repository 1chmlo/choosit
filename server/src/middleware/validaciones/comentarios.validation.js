import { param, body, query, validationResult } from 'express-validator';
import { pool } from '../../db.js';
import { obtenerListaPalabras } from '../../utils/csv-reader.js';

// Obtener la lista de palabras prohibidas
const palabrasProhibidas = obtenerListaPalabras();

// Función para determinar si dos caracteres son similares (mucho más restrictiva)
function sonCaracteresSimilares(char1, char2) {
  if (char1 === char2) return true;
  
  // Solo equivalencias muy obvias y comunes
  const equivalencias = {
    'a': ['@'],
    'e': ['3'],
    'i': ['1'],
    'o': ['0'],
    's': ['$', '5'],
    
    // Equivalencias inversas
    '@': ['a'],
    '3': ['e'],
    '1': ['i'],
    '0': ['o'],
    '$': ['s'],
    '5': ['s']
  };
  
  return equivalencias[char1]?.includes(char2) || 
         equivalencias[char2]?.includes(char1);
}

// Función para detectar similitud (muchísimo más estricta)
function esSimilar(palabra1, palabra2) {
  // Si las palabras son iguales
  if (palabra1 === palabra2) return true;
  
  // Solo palabras de EXACTAMENTE la misma longitud
  if (palabra1.length !== palabra2.length) return false;
  
  // Para palabras cortas, ser extremadamente estricto
  if (palabra1.length <= 4) {
    return palabra1 === palabra2;
  }
  
  // Para palabras largas, permitir máximo 1 diferencia
  let diferencias = 0;
  for (let i = 0; i < palabra1.length; i++) {
    if (!sonCaracteresSimilares(palabra1[i], palabra2[i])) {
      diferencias++;
      // Si ya hay más de 1 diferencia, no es similar
      if (diferencias > 1) return false;
    }
  }
  
  return diferencias <= 1;
}

// Función más inteligente para detectar variaciones (ultra conservadora)
function detectarVariaciones(texto, palabrasProhibidas) {
  // Dividir en palabras y filtrar las muy cortas
  const palabras = texto.toLowerCase()
    .split(/\s+/)
    .filter(p => p.length >= 4); // Aumentar mínimo a 4 caracteres
  
  for (const palabraTexto of palabras) {
    // Crear versiones de la palabra para verificar
    const palabraLimpia = palabraTexto.replace(/[^a-záéíóúüñ]/gi, '');
    const palabraSustituciones = sustituirNumerosPorLetras(palabraTexto);
    
    // Ignorar palabras muy cortas después de limpiar
    if (palabraLimpia.length < 4) continue;
    
    for (const palabraProhibida of palabrasProhibidas) {
      const prohibidaLower = palabraProhibida.toLowerCase();
      
      // Solo verificar palabras prohibidas de cierta longitud
      if (prohibidaLower.length < 4) continue;
      
      // SOLO verificación exacta - SIN similitud para evitar falsos positivos
      if (palabraLimpia === prohibidaLower) {
        console.log(`Palabra exacta encontrada: "${palabraLimpia}" = "${prohibidaLower}"`);
        return { encontrada: true, palabra: palabraTexto, prohibida: palabraProhibida };
      }
      
      // Verificación exacta con sustituciones numéricas
      if (palabraSustituciones === prohibidaLower) {
        console.log(`Palabra con sustituciones encontrada: "${palabraSustituciones}" = "${prohibidaLower}"`);
        return { encontrada: true, palabra: palabraTexto, prohibida: palabraProhibida };
      }
      
      // ELIMINAR completamente la verificación de similitud para evitar falsos positivos
      // Solo mantener coincidencias exactas
    }
  }
  
  return { encontrada: false };
}

// Función para sustituir números por letras (más conservadora)
function sustituirNumerosPorLetras(texto) {
  const sustituciones = {
    '1': 'i',
    '0': 'o',
    '3': 'e',
    '@': 'a',
    '$': 's'
    // Eliminar sustituciones problemáticas como '4': 'a', '5': 's'
  };
  
  let resultado = texto.toLowerCase();
  
  // Sustituir solo caracteres muy obvios
  for (const [caracter, letra] of Object.entries(sustituciones)) {
    resultado = resultado.replace(new RegExp('\\' + caracter, 'g'), letra);
  }
  
  // Limpiar caracteres especiales
  resultado = resultado.replace(/[^a-záéíóúüñ]/gi, '');
  
  return resultado;
}

export const validateCreateComment = [
  body('id_asignatura')
    .trim()
    .notEmpty()
    .withMessage('El ID de la asignatura es requerido')
    .isUUID(4)
    .withMessage('El ID de la asignatura debe ser un UUID v4 válido'),
  
  body('texto')
    .trim()
    .notEmpty()
    .withMessage('El texto del comentario es requerido')
    .isLength({ min: 1, max: 250 })
    .withMessage('El comentario debe tener entre 1 y 250 caracteres')
    .custom((value) => {
      console.log(`Validando texto: "${value}"`);
      // Detectar palabras prohibidas o similares
      const resultado = detectarVariaciones(value, palabrasProhibidas);
      
      if (resultado.encontrada) {
        console.log(`Comentario rechazado: "${resultado.palabra}" similar a "${resultado.prohibida}"`);
        throw new Error('El comentario contiene lenguaje inapropiado');
      }
      
      console.log(`Comentario aprobado: "${value}"`);
      return true;
    }),

  // Validación personalizada para verificar si el usuario ya comentó
  body('id_asignatura').custom(async (id_asignatura, { req }) => {
    const id_usuario = req.userId;
    
    if (!id_usuario) {
      throw new Error('Usuario no autenticado');
    }

    const comentarioExistente = await pool.query(
      'SELECT id FROM comentarios WHERE id_usuario = $1 AND id_asignatura = $2',
      [id_usuario, id_asignatura]
    );

    if (comentarioExistente.rows.length > 0) {
      throw new Error('Ya has comentado en esta asignatura. Solo se permite un comentario por usuario por asignatura.');
    }

    return true;
  }),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Mantén las otras validaciones existentes sin cambios
export const validateReportComment = [
  body('id_comentario')
    .trim()
    .notEmpty()
    .withMessage('El ID del comentario es requerido')
    .isUUID(4)
    .withMessage('El ID del comentario debe ser un UUID v4 válido'),
  
  body('motivo')
    .trim()
    .notEmpty()
    .withMessage('El motivo del reporte es requerido')
    .isLength({ min: 5, max: 100 })
    .withMessage('El motivo debe tener entre 5 y 100 caracteres'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export const validateUpdateComment = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('El ID del comentario es requerido')
    .isUUID(4)
    .withMessage('El ID del comentario debe ser un UUID v4 válido'),
  
  body('texto')
    .optional()
    .trim()
    .isLength({ min: 1, max: 250 })
    .withMessage('El comentario debe tener entre 1 y 250 caracteres')
    .custom((value) => {
      // Solo validar si el campo texto está presente
      if (value) {
        console.log(`Validando texto de edición: "${value}"`);
        // Detectar palabras prohibidas o similares
        const resultado = detectarVariaciones(value, palabrasProhibidas);
        
        if (resultado.encontrada) {
          console.log(`Edición de comentario rechazada: "${resultado.palabra}" similar a "${resultado.prohibida}"`);
          throw new Error('El comentario contiene lenguaje inapropiado');
        }
        
        console.log(`Edición de comentario aprobada: "${value}"`);
      }
      return true;
    }),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
export const validateLikeComment = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('El ID del comentario es requerido')
    .isUUID(4)
    .withMessage('El ID del comentario debe ser un UUID v4 válido'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export const validateAdminDeleteComment = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('El ID del comentario es requerido')
    .isUUID(4)
    .withMessage('El ID del comentario debe ser un UUID v4 válido'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export const validateAdminRejectReports = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('El ID del comentario es requerido')
    .isUUID(4)
    .withMessage('El ID del comentario debe ser un UUID v4 válido'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];