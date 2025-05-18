import express from 'express';
import {BACKEND_URL, FRONTEND_URL, PORT} from './config.js';
import morgan from 'morgan';

//RUTAS
import authRoutes from "./routes/auth.routes.js";
import asignaturasRoutes from "./routes/asignaturas.routes.js";
import comentariosRoutes from "./routes/comentarios.routes.js";

import coockieParser from 'cookie-parser';
import cors from 'cors';


const app = express();

// Configuración de CORS
// ["http:localhost:5000", `${FRONTEND_URL}`, "https://delete-offices-challenge-whats.trycloudflare.com"]
app.use(cors({
    origin: ["http://localhost:5000", `${FRONTEND_URL}`],
    //origin: true, // Añade aquí los orígenes permitidos
    credentials: true // Permite enviar cookies en solicitudes cross-origin
  }));
// Descomentar cuando ya existan las rutas de asignaturas
//import asignaturasRoutes from "./routes/asignaturas.routes.js";




const puerto = PORT || 3000;

app.use(express.json());
app.use(morgan('dev'));
app.use(coockieParser());

app.get('/', (req, res) => { res.json({  message: "BIENVENIDO", BACKEND_URL, FRONTEND_URL}) });
app.use('/api/auth', authRoutes);
app.use('/api/asignaturas', asignaturasRoutes);
app.use('/api/comentarios', comentariosRoutes);

//Descomentar cuando ya existan las rutas de asignaturas
//app.use('/api/asignaturas', asignaturasRoutes);

app.listen(puerto)





console.log('Starting server on port...', puerto);