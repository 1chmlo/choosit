import { Router } from 'express';
import { isAuthUser } from '../middleware/autorizacion/isAuthUser.js';
import { delete_encuesta, create_encuesta } from '../controllers/encuestas.controller.js';
import { ValidateDeleteEncuesta, ValidateInsertEncuesta } from '../middleware/validaciones/encuestas.validation.js';


const router = Router();

router.delete('/', isAuthUser, ValidateDeleteEncuesta , delete_encuesta);

/*
metodo para insertar nueva encuesta recibe json con id_asignatura y arreglo con id_pregunta y respuesta
Ejemplo:
{
"id_asignatura": "pepepepe",
"respuestas": [
        {
        "id_pregunta": "idifjndn",
        "respuesta": 4
        },
        {
        "id_pregunta": "sdjnfvj",
        "respuesta": 2
        }
    ]
}
*/
router.post('/', isAuthUser, ValidateInsertEncuesta, create_encuesta);

export default router;