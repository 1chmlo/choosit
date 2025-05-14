import { Router } from 'express';
import { add_subject, modify_subject, search_subject, get_all_subjects} from '../controllers/asignaturas.controller.js';
import { ValidateCreateAsignatura, ValidateSearch, ValidateUpdateAsignatura } from '../middleware/validaciones/asignaturas.validation.js';

const router = Router();
router.get('/', get_all_subjects);
router.post('/',ValidateCreateAsignatura, add_subject);
router.put('/:id',ValidateUpdateAsignatura, modify_subject);
router.get('/buscar',ValidateSearch, search_subject);

export default router;
