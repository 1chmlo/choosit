import { Router } from 'express';
import { add_subject, modify_subject} from '../controllers/asignaturas.controller.js';

const router = Router();
router.post('/', add_subject);
router.put('/:id', modify_subject);

export default router;
