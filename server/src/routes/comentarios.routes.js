import { Router } from 'express';
import { create_comment, get_all_comments, get_all_reports, report_comment, update_comment, like_comment } from '../controllers/comentarios.controller.js';
import { isAuthUser } from '../middleware/autorizacion/isAuthUser.js';
import { validateReportComment, validateLikeComment, validateUpdateComment, validateCreateComment } from '../middleware/validaciones/comentarios.validation.js';

const router = Router();
router.get('/', get_all_comments)
router.post('/', isAuthUser, validateCreateComment, create_comment) // ← DEBE incluir validateCreateComment

router.post('/reporte', isAuthUser, validateReportComment, report_comment);
router.get('/reportes', get_all_reports)
router.patch('/:id', isAuthUser, validateUpdateComment, update_comment);
router.patch('/:id/like', isAuthUser, validateLikeComment, like_comment);

export default router;