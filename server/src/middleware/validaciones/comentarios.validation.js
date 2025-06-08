import { param, body, query, validationResult } from 'express-validator';
import { pool } from '../../db.js';
import { obtenerListaPalabras } from '../../utils/csv-reader.js';

// Función más simple y efectiva
function detectarVariaciones(texto, palabrasProhibidas) {
  const palabras = texto.toLowerCase().split(/\s+/);
  
  for (const palabraTexto of palabras) {
    // Limpiar la palabra de caracteres especiales
    const palabraLimpia = palabraTexto.replace(/[^a-záéíóúüñ]/gi, '');
    
    if (palabraLimpia.length < 3) continue;
    
    for (const palabraProhibida of palabrasProhibidas) {
      // Verificación exacta
      if (palabraLimpia === palabraProhibida.toLowerCase()) {
        console.log(`Palabra exacta encontrada: "${palabraLimpia}" = "${palabraProhibida}"`);
        return { encontrada: true, palabra: palabraTexto, prohibida: palabraProhibida };
      }
      
      // Verificación de similitud (algoritmo simple)
      if (esSimilar(palabraLimpia, palabraProhibida.toLowerCase())) {
        console.log(`Palabra similar encontrada: "${palabraLimpia}" ≈ "${palabraProhibida}"`);
        return { encontrada: true, palabra: palabraTexto, prohibida: palabraProhibida };
      }
    }
  }
  
  return { encontrada: false };
}

// Función para detectar similitud (algoritmo simple)
function esSimilar(palabra1, palabra2) {
  // Si las palabras son iguales
  if (palabra1 === palabra2) return true;
  
  // Si tienen longitudes muy diferentes, no son similares
  if (Math.abs(palabra1.length - palabra2.length) > 2) return false;
  
  // Contador de diferencias
  let diferencias = 0;
  const maxLen = Math.max(palabra1.length, palabra2.length);
  
  // Comparar carácter por carácter
  for (let i = 0; i < maxLen; i++) {
    const char1 = palabra1[i] || '';
    const char2 = palabra2[i] || '';
    
    if (!sonCaracteresSimilares(char1, char2)) {
      diferencias++;
    }
  }
  
  // Si hay máximo 1 diferencia, son similares
  return diferencias <= 1;
}

// Función para determinar si dos caracteres son similares
function sonCaracteresSimilares(char1, char2) {
  if (char1 === char2) return true;
  
  const equivalencias = {
    'a': ['@', '4', 'á', 'à'],
    'e': ['3', 'é', 'è'],
    'i': ['1', '!', 'í', 'ì'],
    'o': ['0', 'ó', 'ò'],
    'u': ['ú', 'ù'],
    'c': ['k', 'q'],
    'k': ['c', 'q'],
    'q': ['c', 'k'],
    's': ['z', '$', '5'],
    'z': ['s'],
    'b': ['v'],
    'v': ['b']
  };
  
  return equivalencias[char1]?.includes(char2) || 
         equivalencias[char2]?.includes(char1);
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
  param('id')
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
    .withMessage('El comentario debe tener entre 1 y 250 caracteres'),
  
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