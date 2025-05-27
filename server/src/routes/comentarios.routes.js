import { Router } from 'express';
import { create_comment, get_all_comments } from '../controllers/comentarios.controller.js';
import { isAuthUser } from '../middleware/autorizacion/isAuthUser.js';

const router = Router();
router.get('/', get_all_comments);
router.post('/', isAuthUser, create_comment); 

export default router;