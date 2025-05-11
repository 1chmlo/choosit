import { body, validationResult } from 'express-validator';

/**
 * Middleware para validar campos de inicio de sesión
 */
export const validateLogin = [
  body('email')
    .trim() //Transforma el valor eliminando espacios en blanco al inicio y al final

    .notEmpty()
    .withMessage('El email es requerido')

    .isEmail()
    .withMessage('Ingrese un email válido')

    .customSanitizer(value => value.toLowerCase()) // Transforma el email a minúsculas

    .matches(/^[a-z]+\.[a-z]+(\d+)?@mail\.udp\.cl$/)
    .withMessage('El email debe seguir el formato nombre.apellido[numero]@mail.udp.cl')
    
    .isLength({ max: 100 }), // Verifica que la longitud mínima sea 10 y máxima 50
    
  body('contrasena')
    .trim() //Transforma el valor eliminando espacios en blanco al inicio y al final

    .notEmpty()
    .withMessage('La contraseña es requerida')

    .isLength({ min: 8, max: 40 }) // Verifica que la longitud mínima sea 8 y maxima 20
    .withMessage('La contraseña debe tener 8 y 40 caracteres'),
    
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

/**
 * Middleware para validar campos de registro de usuario, es un arreglo de validaciones
 */
export const validateRegister = [
  body('email')
    .trim() //Transforma el valor eliminando espacios en blanco al inicio y al final

    .notEmpty()
    .withMessage('El email es requerido')

    .isEmail()
    .withMessage('Ingrese un email válido')

    .customSanitizer(value => value.toLowerCase()) // Transforma el email a minúsculas

    .matches(/^[a-z]+\.[a-z]+(\d+)?@mail\.udp\.cl$/)
    .withMessage('El email debe seguir el formato nombre.apellido[numero]@mail.udp.cl')
    
    .isLength({ max: 100 }), // Verifica que la longitud mínima sea 10 y máxima 50
    
  body('contrasena')
    .trim() //Transforma el valor eliminando espacios en blanco al inicio y al final

    .notEmpty()
    .withMessage('La contraseña es requerida')

    .isLength({ min: 8, max: 40 }) // Verifica que la longitud mínima sea 8 y maxima 20
    .withMessage('La contraseña debe tener 8 y 40 caracteres'),
    
  body('nombre')
    .notEmpty()
    .withMessage('El nombre es requerido')
    .trim(),

  body('apellido')
    .trim() //Transforma el valor eliminando espacios en blanco al inicio y al final
    .notEmpty()
    .withMessage('El nombre es requerido'),
    
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

