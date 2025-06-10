import { param, body,query, validationResult } from 'express-validator';

export const ValidateInsertEncuesta = [
  body('id_asignatura')
    .trim() 
    .notEmpty()
    .withMessage("Se Necesita el parametro de id de la asignatura")
    .customSanitizer(value => value.toLowerCase())
    .matches(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)
    .withMessage('El ID debe ser un UUID Valido'),
  
  body('respuestas')
    .isArray({min: 1})
    .withMessage('Arreglo con respuestas no valido'),
  
  body('respuestas.*.id_pregunta')
    .trim()
    .notEmpty()
    .withMessage('id_pregunta faltante')
    .customSanitizer(value => value.toLowerCase())
    .matches(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)
    .withMessage('id_pregunta no valido'),
  
  body('respuestas.*.respuesta')
    .notEmpty()
    .withMessage('respuesta a alguna pregunta faltante')
    .isInt({min: 0})
    .withMessage('Numero respuesta no valido'),
  (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
    next();
  }
];

export const ValidateDeleteEncuesta = [


    param('id_asignatura')
    .trim() 
    .notEmpty()
    .withMessage("Se Necesita el parametro de id de la asignatura")
    .customSanitizer(value => value.toLowerCase())
    .matches(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)
    .withMessage('El ID debe ser un UUID Valido'),



  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];