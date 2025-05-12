import { Router } from 'express';
import { add_subject, modify_subject} from '../controllers/asignaturas.controller.js';

const router = Router();
router.post('/asignaturas', add_subject);
router.put('/asignaturas/:id', modify_subject);

export default router;
