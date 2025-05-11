import { Router } from 'express';
import { login, register, verify } from '../controllers/auth.controller.js';
import { validateLogin, validateRegister } from '../middleware/validations/auth.validation.js';


const router = Router();

router.post('/login', validateLogin, login);
router.post('/register', validateRegister,register);
router.get('/verify', verify)

export default router;