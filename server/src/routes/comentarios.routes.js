import { Router } from 'express';
import { create_comment, get_all_comments, get_all_reports, report_comment, update_comment } from '../controllers/comentarios.controller.js';
import { isAuthUser } from '../middleware/autorizacion/isAuthUser.js';
import { validateReportComment } from '../middleware/validaciones/comentarios.validation.js';


const router = Router();
router.get('/', get_all_comments)
router.post('/', isAuthUser, create_comment)

router.post('/reporte', isAuthUser, validateReportComment, report_comment);
router.get('/reportes', get_all_reports)
router.patch('/:id', isAuthUser, update_comment);

export default router;