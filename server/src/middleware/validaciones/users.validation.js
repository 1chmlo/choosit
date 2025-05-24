import { body, query, validationResult } from 'express-validator';

export const validateChangedata = [
  body('nombre')
    .trim() //Transforma el valor eliminando espacios en blanco al inicio y al final
    .optional()
    
    .customSanitizer(value => value.toLowerCase()) // Transforma el nombre a minúsculas

    .isAlpha('es-ES') // Verifica que el nombre contenga solo letras sin espacios en blanco
    .withMessage('El nombre solo puede contener letras sin espacios')

    .isLength({ min: 2, max: 20 })
    .withMessage('El nombre debe tener entre 2 y 20 caracteres'),


  body('apellido')
    .trim() //Transforma el valor eliminando espacios en blanco al inicio y al final
    .optional()
    
    .customSanitizer(value => value.toLowerCase()) // Transforma el nombre a minúsculas

    .isAlpha('es-ES') // Verifica que el nombre contenga solo letras sin espacios en blanco
    .withMessage('El apellido solo puede contener letras sin espacios')

    .isLength({ min: 2, max: 20 })
    .withMessage('El apellido debe tener entre 2 y 20 caracteres'),    

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