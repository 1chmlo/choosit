import dotenv from 'dotenv';

// Config() considera como raiz la carpeta donde está el package.json
dotenv.config({ path: './.env' });

export const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000';