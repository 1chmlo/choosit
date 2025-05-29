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