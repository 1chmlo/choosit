import express from 'express';
import {PORT} from './config.js';
import morgan from 'morgan';
import authRoutes from "./routes/auth.routes.js";
import coockieParser from 'cookie-parser';

// Descomentar cuando ya existan las rutas de asignaturas
//import asignaturasRoutes from "./routes/asignaturas.routes.js";

const app = express();


const puerto = PORT || 3000;

app.use(express.json());
app.use(morgan('dev'));
app.use(coockieParser());

app.use('/api/auth', authRoutes);

//Descomentar cuando ya existan las rutas de asignaturas
//app.use('/api/asignaturas', asignaturasRoutes);

app.listen(puerto)





console.log('Starting server on port...', puerto);