import { Router } from 'express';
import { isAuthUser } from '../middleware/autorizacion/isAuthUser.js';
import { delete_encuesta } from '../controllers/encuestas.controller.js';
import { ValidateDeleteEncuesta } from '../middleware/validaciones/encuestas.validation.js';


const router = Router();

router.delete('/', isAuthUser, ValidateDeleteEncuesta , delete_encuesta);


export default router;
