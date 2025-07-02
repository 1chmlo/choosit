import { Router } from 'express';
import { isAuthUser } from '../middleware/autorizacion/isAuthUser.js';
import { me, changedata, changepassword, myAnswers } from '../controllers/users.controller.js';
import { validatechangepassword, validateChangedata } from '../middleware/validaciones/users.validation.js';


const router = Router();

router.get('/me', isAuthUser, me);

router.get('/myanswers/:codigo', isAuthUser, myAnswers);

router.post('/changedata', isAuthUser, validateChangedata, changedata );

router.post('/changepassword', isAuthUser, validatechangepassword, changepassword );

export default router;
