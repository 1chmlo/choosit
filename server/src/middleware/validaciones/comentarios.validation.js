import { param, body,query, validationResult } from 'express-validator';

export const validateReportComment = [
    body('id_comentario')
        .trim()
        .notEmpty()
        .withMessage('El id del comentario es requerido')
        .isUUID(4)
        .withMessage('El id del comentario debe ser un UUID v4 válido'),
    
    body('motivo')
        .trim()
        .notEmpty()
        .withMessage('El motivo del reporte es requerido')
        .isString()
        .withMessage('El motivo debe ser texto')
        .isLength({ max: 500 })
        .withMessage('Maximo 500 caracteres para el motivo'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
    ];


    export const validateLikeComment = [
    param('id')
        .trim()
        .notEmpty()
        .withMessage('El id del comentario es requerido')
        .isUUID(4)
        .withMessage('El id del comentario debe ser un UUID v4 válido'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
/**
 * Validación para la edición de comentarios
 * Valida que el ID del comentario sea un UUID válido
 * Valida que el texto del comentario cumpla los requisitos
 */
export const validateUpdateComment = [
    param('id')
        .trim()
        .notEmpty()
        .withMessage('El id del comentario es requerido')
        .isUUID(4)
        .withMessage('El id del comentario debe ser un UUID v4 válido'),
    
    body('texto')
        .trim()
        .notEmpty()
        .withMessage('El texto del comentario es requerido')
        .isString()
        .withMessage('El texto debe ser una cadena de caracteres')
        .isLength({ min: 1, max: 1000 })
        .withMessage('El texto debe tener entre 1 y 1000 caracteres')
        .custom((value) => {
            // Lista de palabras prohibidas
            const palabrasProhibidas = ['ql', 'puta', 'mierda', 'weon', 'ctm', 'maraco', 'csm', 'hueon', 'hueona', 'caca', 'pajero', 'pajera', 'pendejo', 'pendeja'];
            
            // Crear expresiones regulares para cada palabra
            const regexPalabrasProhibidas = palabrasProhibidas.map(palabra => 
                new RegExp(`${palabra.split('').join('[\\s\\W_]*')}`, 'i')
            );
            
            // Verificar si contiene palabras prohibidas
            const contieneProhibida = regexPalabrasProhibidas.some(regex => 
                regex.test(value)
            );
            
            if (contieneProhibida) {
                throw new Error('El comentario contiene lenguaje inapropiado');
            }
            
            return true;
        }),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];