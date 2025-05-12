import { body, validationResult } from 'express-validator';

export const ValidarAsignatura = [
  body('codigo')
    .trim() //Transforma el valor eliminando espacios en blanco al inicio y al final
    .notEmpty()
    .withMessage('Codigo es requerido')
    .customSanitizer(value => value.toLowerCase()) // Transforma el codigo a minúsculas
    .matches(/^(CFG|CIT|ICB)-\d+/)
    .withMessage('El codigo debe llevar CIT o CFG o ICB + - + el codigo')
    .isLength({ max: 20 }), // Verifica que la longitud máxima sea 20

  body('nombre')
    .trim() //Transforma el valor eliminando espacios en blanco al inicio y al final
    .notEmpty()
    .withMessage('La Nombre es requerida')
    .isLength({ min: 8, max: 50 }) // Verifica que la longitud mínima sea 8 y maxima 50
    .withMessage('el nombre debe tener 8 y 50 caracteres'),

  body('descripcion')
    .trim()
    .notEmpty()
    .withMessage('La asignatura debe tener descripcion')
    .isLength({ max: 250 })
    .withMessage('Maximo 250 caractares de descripcion'),

  body('lab')
    .trim()
    .notEmpty()
    .withMessage("Tiene que tener datos Bool"),

  body('controles')
    .trim()
    .notEmpty()
    .withMessage("Tiene que tener datos Bool"),

  body('proyecto')
    .trim()
    .notEmpty()
    .withMessage("Tiene que tener datos Bool"),

  body('cfg')
    .trim()
    .notEmpty()
    .withMessage("Tiene que tener datos Bool"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export const Validarcambio = [
  body('codigo')
    .trim() //Transforma el valor eliminando espacios en blanco al inicio y al final
    .customSanitizer(value => value.toLowerCase()) // Transforma el codigo a minúsculas
    .matches(/^(CFG|CIT|ICB)-\d+/)
    .withMessage('El codigo debe llevar CIT o CFG o ICB + - + el codigo')
    .isLength({ max: 20 }), // Verifica que la longitud máxima sea 20

  body('nombre')
    .trim() //Transforma el valor eliminando espacios en blanco al inicio y al final
    .isLength({ min: 8, max: 50 }) // Verifica que la longitud mínima sea 8 y maxima 50
    .withMessage('el nombre debe tener 8 y 50 caracteres'),

  body('descripcion')
    .trim()
    .isLength({ max: 250 })
    .withMessage('Maximo 250 caractares de descripcion'),

  body('lab')
    .trim()
    .withMessage("Tiene que tener datos Bool"),

  body('controles')
    .trim()
    .withMessage("Tiene que tener datos Bool"),

  body('proyecto')
    .trim()
    .withMessage("Tiene que tener datos Bool"),

  body('cfg')
    .trim()
    .withMessage("Tiene que tener datos Bool"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
