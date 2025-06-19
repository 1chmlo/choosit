import { Router } from 'express';
import { login, register, verify, logout, resendEmail, forgotPassword, resetPassword, deactivateUser, requestActivate, activateAccount} from '../controllers/auth.controller.js';
import { validateLogin, validateRegister, validateVerifyEmail, validateResendEmail, validateForgotPassword, validateActivateAccount} from '../middleware/validaciones/auth.validation.js';
import { isAuthUser } from '../middleware/autorizacion/isAuthUser.js';
import { isAuthResetPassword } from '../middleware/autorizacion/isAuthResetPassword.js';
import { isAuthActivateAccount } from '../middleware/autorizacion/isAuthActivateAccount.js';


const router = Router();

router.post('/register', validateRegister,register);

router.post('/resend-verification-email', validateResendEmail, resendEmail);

router.post('/forgot-password', validateForgotPassword, forgotPassword);

router.post('/reset-password', isAuthResetPassword, resetPassword);

router.get('/verify', validateVerifyEmail, verify)

router.post('/login', validateLogin, login);

router.post('/logout', isAuthUser, logout);


router.post('/deactivate', isAuthUser, deactivateUser);

router.post('/request-activate', validateActivateAccount, requestActivate);

router.post('/activate-account', isAuthActivateAccount, activateAccount);

export default router;