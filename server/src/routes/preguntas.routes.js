import { Router } from 'express';
import {create_question, create_question_type, get_question_types, get_questions } from '../controllers/preguntas.controller.js';
import {validateCreateQuestion, validateCreateQuestionType} from '../middleware/validaciones/preguntas.validation.js';

const router = Router();
router.post('/tipos',validateCreateQuestionType,create_question_type);
router.get('/tipos', get_question_types);

router.post('/', validateCreateQuestion, create_question);
router.get('/', get_questions); 

export default router;