import express from 'express';
import {FRONTEND_URL, PORT} from './config.js';
import morgan from 'morgan';
import authRoutes from "./routes/auth.routes.js";
import coockieParser from 'cookie-parser';
import cors from 'cors';


const app = express();

// Configuración de CORS
app.use(cors({
    origin: [`${FRONTEND_URL}`, "https://delete-offices-challenge-whats.trycloudflare.com"], // Añade aquí los orígenes permitidos
    credentials: true // Permite enviar cookies en solicitudes cross-origin
  }));
// Descomentar cuando ya existan las rutas de asignaturas
//import asignaturasRoutes from "./routes/asignaturas.routes.js";




const puerto = PORT || 3000;

app.use(express.json());
app.use(morgan('dev'));
app.use(coockieParser());

app.get('/', (req, res) => { res.send('Bienvenido a la API de UDP') });
app.use('/api/auth', authRoutes);

//Descomentar cuando ya existan las rutas de asignaturas
//app.use('/api/asignaturas', asignaturasRoutes);

app.listen(puerto)





console.log('Starting server on port...', puerto);