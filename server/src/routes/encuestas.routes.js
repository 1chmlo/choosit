import { Router } from 'express';
import { isAuthUser } from '../middleware/autorizacion/isAuthUser.js';
import { delete_encuesta } from '../controllers/encuestas.controller.js';
import { Validatedelete_encuesta } from '../middleware/validaciones/encuestas.validation.js';


const router = Router();

router.get('/deleteencuesta', isAuthUser, Validatedelete_encuesta , delete_encuesta);


export default router;
