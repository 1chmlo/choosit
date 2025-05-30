import { body, query, validationResult } from 'express-validator';

export const validateChangedata = [   
  body('anio_ingreso')
    .trim() //Transforma el valor eliminando espacios en blanco al inicio y al final
    .optional()

    .isNumeric()
    .withMessage('El anio_ingreso solo puede contener números')

    .isInt({ min: 1989, max: new Date().getFullYear()})
    .withMessage(`El anio_ingreso debe ser un número entre 1989 y ${new Date().getFullYear()}`),
    
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export const validatechangepassword = [

  body('contrasena')
    .trim() //Transforma el valor eliminando espacios en blanco al inicio y al final
    .isLength({ min: 8, max: 40 }) // Verifica que la longitud mínima sea 8 y maxima 20
    .withMessage('La contraseña debe tener 8 y 40 caracteres'),

    body('nueva_contrasena')
    .trim() //Transforma el valor eliminando espacios en blanco al inicio y al final
    .isLength({ min: 8, max: 40 }) // Verifica que la longitud mínima sea 8 y maxima 20
    .withMessage('La nueva contraseña debe tener 8 y 40 caracteres'),

      (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
]