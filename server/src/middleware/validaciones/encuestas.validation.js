import { param, body,query, validationResult } from 'express-validator';

export const Validatedelete_encuesta = [
    param('id_evaluacion')
    .trim() //Transforma el valor eliminando espacios en blanco al inicio y al final
    .notEmpty()
    .withMessage("Se Necesita el parametro de id de la evaluacion")
    .customSanitizer(value => value.toLowerCase())
    .matches(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)
    .withMessage('El ID debe ser un UUID Valido'),

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