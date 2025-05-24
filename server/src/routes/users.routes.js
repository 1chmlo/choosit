import { Router } from 'express';
import { isAuthUser } from '../middleware/autorizacion/isAuthUser.js';
import { me } from '../controllers/users.controller.js';

const router = Router();

router.get('/me', isAuthUser, me);

export default router;
