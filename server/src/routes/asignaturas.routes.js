import { Router } from 'express';
import { add_subject, modify_subject, search_subject, get_all_subjects, subject_all, soft_delete_subject} from '../controllers/asignaturas.controller.js';
import { ValidateCreateAsignatura, ValidateSearch, ValidateUpdateAsignatura } from '../middleware/validaciones/asignaturas.validation.js';

const router = Router();
router.get('/', get_all_subjects);
router.post('/',ValidateCreateAsignatura, add_subject);
router.patch('/:id',ValidateUpdateAsignatura, modify_subject);
router.get('/buscar',ValidateSearch, search_subject);
router.get('/:codigo/all', subject_all);

router.patch('/soft_delete/:id', soft_delete_subject)

export default router;  