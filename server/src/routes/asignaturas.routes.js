import { Router } from 'express';
import { add_subject, modify_subject} from '../controllers/asignaturas.controller.js';
import { ValidarAsignatura, Validarcambio } from '../middleware/validaciones/asignaturas.validation.js';

const router = Router();
router.post('/',ValidarAsignatura, add_subject);
router.put('/:id',Validarcambio, modify_subject);

export default router;
