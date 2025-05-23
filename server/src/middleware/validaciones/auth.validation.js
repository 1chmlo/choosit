import { body, query, validationResult } from 'express-validator';

/**
 * Middleware para validar campos de inicio de sesión
 * @body('email') - email del usuario
 * @body('contrasena') - contraseña del usuario
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
 * @body('email') - email del usuario
 * @body('contrasena') - contraseña del usuario
 * @body('nombre') - nombre del usuario
 * @body('apellido') - apellido del usuario
 * @body('username') - username del usuario
 * @body('anio_ingreso') - año de ingreso del usuario
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
    
    .isLength({ max: 100 }), // Verifica que la longitud sea maximo 100

    
  body('contrasena')
    .trim() //Transforma el valor eliminando espacios en blanco al inicio y al final

    .notEmpty()
    .withMessage('La contraseña es requerida')

    .isLength({ min: 8, max: 40 }) // Verifica que la longitud mínima sea 8 y maxima 20
    .withMessage('La contraseña debe tener 8 y 40 caracteres'),

    
  body('nombre')
    .trim() //Transforma el valor eliminando espacios en blanco al inicio y al final

    .notEmpty()
    .withMessage('El nombre es requerido')
    
    .customSanitizer(value => value.toLowerCase()) // Transforma el nombre a minúsculas

    .isAlpha('es-ES') // Verifica que el nombre contenga solo letras sin espacios en blanco
    .withMessage('El nombre solo puede contener letras sin espacios')

    .isLength({ min: 2, max: 20 })
    .withMessage('El nombre debe tener entre 2 y 20 caracteres'),


  body('apellido')
    .trim() //Transforma el valor eliminando espacios en blanco al inicio y al final

    .notEmpty()
    .withMessage('El apellido es requerido')
    
    .customSanitizer(value => value.toLowerCase()) // Transforma el nombre a minúsculas

    .isAlpha('es-ES') // Verifica que el nombre contenga solo letras sin espacios en blanco
    .withMessage('El apellido solo puede contener letras sin espacios')

    .isLength({ min: 2, max: 20 })
    .withMessage('El apellido debe tener entre 2 y 20 caracteres'),    


  body('username')
    .trim() //Transforma el valor eliminando espacios en blanco al inicio y al final

    .notEmpty()
    .withMessage('El username es requerido')
    
    .customSanitizer(value => value.toLowerCase()) // Transforma el username a minúsculas

    .matches(/^[a-z]+\.[a-z]+(\d+)?$/)
    .withMessage('El username debe seguir el formato nombre.apellido[numero]')

    .isLength({ min: 3, max: 41 }) // 41 porque nombre es 20, apellido es 20 y el punto es 1
    .withMessage('El username debe tener entre 2 y 41 caracteres')
/*
    .custom((username, { req }) => {
      const { email } = req.body;
      const usernameMail = email.split('@')[0];
      if (username !== usernameMail) return false
      return true;
    })
    .withMessage('El username debe ser igual al email antes del @')
    
    .custom((username, { req }) => {
      const nombre_username = username.split('.')[0];
      if (nombre_username !== req.body.nombre) return false
      return true;
    })
    .withMessage('El nombre del username debe coincidir con el nombre')

    .custom((username, { req }) => {
      const apellido_username = username.replace(/\d+$/, '').split('.')[1];
      if (apellido_username !== req.body.apellido) return false
      return true;
    })
    .withMessage('El apellido del username debe coincidir con el apellido')*/
    ,
    

  body('anio_ingreso')
    .trim() //Transforma el valor eliminando espacios en blanco al inicio y al final

    .notEmpty()
    .withMessage('El anio_ingreso es requerido')

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

/**
 * Middleware para validar campos de reenvio de email
 * @body('email') - email del usuario
 **/
export const validateResendEmail = [
  body('email')
    .trim() //Transforma el valor eliminando espacios en blanco al inicio y al final

    .notEmpty()
    .withMessage('El email es requerido')

    .isEmail()
    .withMessage('Ingrese un email válido')

    .customSanitizer(value => value.toLowerCase()) // Transforma el email a minúsculas

    .matches(/^[a-z]+\.[a-z]+(\d+)?@mail\.udp\.cl$/)
    .withMessage('El email debe seguir el formato nombre.apellido[numero]@mail.udp.cl')
    
    .isLength({ max: 100 }), // Verifica que la longitud sea maximo 100

    
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

/**
 * Middleware para validar campos de verificacion de email
 * @query('token') - token de verificacion
 **/
export const validateVerifyEmail = [
  query('token')
    .trim() //Transforma el valor eliminando espacios en blanco al inicio y al final

    .notEmpty()
    .withMessage('El token es requerido')
    
    .isJWT()
    .withMessage('El token no es válido'),
    
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

