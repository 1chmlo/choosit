import { param, body,query, validationResult } from 'express-validator';

export const ValidateCreateAsignatura = [
  body('codigo')
    .trim() //Transforma el valor eliminando espacios en blanco al inicio y al final
    .notEmpty()
    .withMessage('Codigo es requerido')
    .customSanitizer(value => value.toLowerCase()) // Transforma el codigo a minúsculas
    .matches(/^(cfg|cit|icb|cbm|cbq|fic)-\d+$/)
    .withMessage('El codigo debe llevar CIT o CFG o ICB + - + el codigo')
    .isLength({ max: 20 }), // Verifica que la longitud máxima sea 20

  body('nombre')
    .trim() //Transforma el valor eliminando espacios en blanco al inicio y al final
    .notEmpty()
    .withMessage('La Nombre es requerida')
    .isLength({ min: 8, max: 50 }) // Verifica que la longitud mínima sea 8 y maxima 50
    .withMessage('el nombre debe tener 8 y 50 caracteres'),
    
    body('semestre')
    .trim() //Transforma el valor eliminando espacios en blanco al inicio y al final
    .notEmpty()
    .withMessage('el semestre es requerida')
    .isInt({min: 1, max:10})
    .withMessage('el semestre debe ser un valor entero entre 1 y 10'),

  body('descripcion')
    .trim()
    .notEmpty()
    .withMessage('La asignatura debe tener descripcion')
    .isLength({ max: 500 })
    .withMessage('Maximo 250 caractares de descripcion'),

  body('laboratorio')
    .notEmpty()
    .isBoolean()
    .withMessage("El campo laboratorio debe ser un valor booleano (true o false)"),

  body('controles')
    .notEmpty()
    .isBoolean()
    .withMessage("El campo controles debe ser un valor booleano (true o false)"),

  body('proyecto')
    .notEmpty()
    .isBoolean()
    .withMessage("El campo proyecto debe ser un valor booleano (true o false)"),

  body('electivo')
    .notEmpty()
    .isBoolean()
    .withMessage("El campo electivo debe ser un valor booleano (true o false)"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export const ValidateUpdateAsignatura = [
  param('id')
    .trim() //Transforma el valor eliminando espacios en blanco al inicio y al final
    .notEmpty()
    .withMessage("Se Necesita el parametro de id")
    .customSanitizer(value => value.toLowerCase())
    .matches(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)
    .withMessage('El ID debe ser un UUID Valido'),

  body('codigo')
    .optional()
    .trim() //Transforma el valor eliminando espacios en blanco al inicio y al final
    .customSanitizer(value => value.toLowerCase()) // Transforma el codigo a minúsculas
    .matches(/^(cfg|cit|icb|cbm|cbq|fic)-\d+$/)
    .withMessage('El codigo debe llevar CIT o CFG o ICB + - + el codigo')
    .isLength({ max: 20 }), // Verifica que la longitud máxima sea 20

  body('nombre')
    .optional()
    .trim() //Transforma el valor eliminando espacios en blanco al inicio y al final
    .isLength({ min: 8, max: 50 }) // Verifica que la longitud mínima sea 8 y maxima 50
    .withMessage('el nombre debe tener 8 y 50 caracteres'),

    body('semestre')
    .optional()
    .trim() //Transforma el valor eliminando espacios en blanco al inicio y al final
    .isInt({min: 1, max:10})
    .withMessage('el semestre debe ser un valor entero entre 1 y 10'),

  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Maximo 500 caractares de descripcion'),

  body('laboratorio')
    .optional()
    .isBoolean()
    .withMessage("El campo laboratorio debe ser un valor booleano (true o false)"),

  body('controles')
    .optional()
    .isBoolean()
    .withMessage("El campo controles debe ser un valor booleano (true o false)"),

  body('proyecto')
    .optional()
    .isBoolean()
    .withMessage("El campo proyecto debe ser un valor booleano (true o false)"),

  body('electivo')
    .optional()
    .isBoolean()
    .withMessage("El campo electivo debe ser un valor booleano (true o false)"),

  (req, res, next) => {
    const { codigo, nombre, descripcion, laboratorio, controles, proyecto, electivo } = req.body;
    
    if (
      codigo === undefined && 
      nombre === undefined && 
      descripcion === undefined && 
      laboratorio === undefined && 
      controles === undefined && 
      proyecto === undefined && 
      electivo === undefined
    ) {
      return res.status(400).json({ 
        errors: [{ 
          msg: "Debe proporcionar al menos un campo para actualizar", 
          param: "body" 
        }] 
      });
    }
    
    next();
  },

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export const ValidateSearch = [
  query('busqueda')
  .trim()
  .notEmpty()
  .withMessage('La Informacion es requerida')
  .customSanitizer(value => value.toLowerCase()) // Transforma el codigo a minúsculas
  .isString()
  .withMessage('El parámetro debe ser texto'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];