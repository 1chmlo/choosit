import { param, body,query, validationResult } from 'express-validator';

export const validateCreateQuestionType = [
  body('tipo_pregunta')
  .trim()
  .notEmpty()
  .withMessage('La el tipo de pregunta es requerido')
  .customSanitizer(value => value.toLowerCase()) // Transforma el codigo a minúsculas
  .isString()
  .withMessage('El parámetro debe ser texto')
  .isLength({ max: 50 })
  .withMessage('Maximo 50 caractares de descripcion'),




  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export const validateCreateQuestion = [
  body('pregunta')
    .trim()
    .notEmpty()
    .withMessage('La pregunta es requerida')
    .isString()
    .withMessage('El parámetro debe ser texto')
    .isLength({ max: 500 })
    .withMessage('Maximo 500 caractares de descripcion'),

  body('id_tipo_pregunta')
    .trim()
    .customSanitizer(value => value.toLowerCase()) // Transforma el codigo a minúsculas
    .notEmpty()
    .withMessage('El id del tipo de pregunta es requerido')
    .isUUID(4)
    .withMessage('El id del tipo de pregunta debe ser un UUID v4 válido'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];