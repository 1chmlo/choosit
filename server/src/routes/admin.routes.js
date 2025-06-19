import express from 'express';
import { validateAdminDeleteComment, validateAdminRejectReports } from '../middleware/validaciones/comentarios.validation.js';
import { admin_delete_comment, admin_reject_reports } from '../controllers/comentarios.controller.js';
import { isAuthAdmin } from '../middleware/autorizacion/isAuthAdmin.js';

const router = express.Router();

// Eliminar comentario (aprobar reportes) - Solo admin
router.delete('/comentarios/:id', isAuthAdmin, validateAdminDeleteComment, admin_delete_comment);

// Rechazar reportes de comentario - Solo admin
router.patch('/comentarios/:id/reject-reports', isAuthAdmin, validateAdminRejectReports, admin_reject_reports);

export default router;