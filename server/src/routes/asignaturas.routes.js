import { Router } from 'express';
import { add_subject, modify_subject} from '../controllers/asignaturas.controller.js';
import { ValidateCreateAsignatura, ValidateUpdateAsignatura } from '../middleware/validaciones/asignaturas.validation.js';

const router = Router();
router.post('/',ValidateCreateAsignatura, add_subject);
router.put('/:id',ValidateUpdateAsignatura, modify_subject);

export default router;
