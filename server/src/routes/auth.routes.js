import { Router } from 'express';
import { isAuthUserContent, login, register, verify, logout } from '../controllers/auth.controller.js';
import { validateLogin, validateRegister, validateVerifyEmail } from '../middleware/validaciones/auth.validation.js';
import { isAuthUser } from '../middleware/autorizacion/isAuthUser.js';


const router = Router();

router.post('/register', validateRegister,register);

router.get('/verify', validateVerifyEmail, verify)

router.post('/login', validateLogin, login);

router.post('/logout', isAuthUser, logout);

router.get('/rutaprotegida', isAuthUser, isAuthUserContent);

export default router;