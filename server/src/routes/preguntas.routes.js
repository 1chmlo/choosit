import { Router } from 'express';
import {create_question_type } from '../controllers/preguntas.controller.js';
import {validate_question_type} from '../middleware/validaciones/preguntas.validation.js';

const router = Router();
router.post('/creartipopregunta',validate_question_type,create_question_type);

export default router;