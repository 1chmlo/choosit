import { Router } from 'express';
import { isAuthUserContent, login, register, verify } from '../controllers/auth.controller.js';
import { validateLogin, validateRegister } from '../middleware/validaciones/auth.validation.js';
import { isAuthUser } from '../middleware/autorizacion/isAuthUser.js';


const router = Router();

router.post('/login', validateLogin, login);
router.post('/register', validateRegister,register);
router.get('/verify', verify)

router.get('/rutaprotegida', isAuthUser, isAuthUserContent)

export default router;