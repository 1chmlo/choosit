import { Router } from 'express';
import { me, login, register, verify, logout, resendEmail } from '../controllers/auth.controller.js';
import { validateLogin, validateRegister, validateVerifyEmail, validateResendEmail } from '../middleware/validaciones/auth.validation.js';
import { isAuthUser } from '../middleware/autorizacion/isAuthUser.js';


const router = Router();

router.post('/register', validateRegister,register);

router.post('/send-verification-email', validateResendEmail, resendEmail);

router.get('/verify', validateVerifyEmail, verify)

router.post('/login', validateLogin, login);

router.post('/logout', isAuthUser, logout);

router.get('/me', isAuthUser, me);

export default router;