import { param, body,query, validationResult } from 'express-validator';

export const validate_question_type = [
  query('tipo_pregunta')
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