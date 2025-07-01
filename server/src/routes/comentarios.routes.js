import { Router } from 'express';
import { create_comment, get_all_comments, get_all_reports, report_comment, update_comment, like_comment, report_revision } from '../controllers/comentarios.controller.js';
import { isAuthUser } from '../middleware/autorizacion/isAuthUser.js';
import { isAuthAdmin } from '../middleware/autorizacion/isAuthAdmin.js';
import { validateReportComment, validateLikeComment, validateUpdateComment, validateCreateComment } from '../middleware/validaciones/comentarios.validation.js';

const router = Router();
router.get('/', get_all_comments)
router.post('/', isAuthUser, validateCreateComment, create_comment) // ← DEBE incluir validateCreateComment

router.post('/reporte', isAuthUser, validateReportComment, report_comment);
router.get('/reportes', get_all_reports)
router.patch('/:id', isAuthUser, validateUpdateComment, update_comment);
router.patch('/:id/like', isAuthUser, validateLikeComment, like_comment);
//  Obtener comentarios reportados no revisados, solo admin
router.get('/reportados_revision', isAuthAdmin, report_revision);

export default router;