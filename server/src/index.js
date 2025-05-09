import express from 'express';
import {PORT} from './config.js';
import morgan from 'morgan';
import authRoutes from "./routes/auth.routes.js";
import coockieParser from 'cookie-parser';

const app = express();

const puerto = PORT || 3000;

app.use(express.json());
app.use(morgan('dev'));

app.use('/api/', authRoutes);
app.listen(puerto)


app.use(coockieParser());


console.log('Starting server on port...', puerto);