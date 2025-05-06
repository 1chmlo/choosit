import dotenv from 'dotenv';

// Config() considera como raiz la carpeta donde está el package.json
dotenv.config({ path: './.env' });

// Servidor
export const PORT = process.env.PORT || 3000;

// Base de datos
export const POSTGRES_USER = process.env.POSTGRES_USER || "choosit";
export const POSTGRES_DB = process.env.POSTGRES_DB || "choosit";
export const POSTGRES_PASSWORD =  process.env.POSTGRES_PASSWORD || "choosit";
export const POSTGRES_HOST = process.env.POSTGRES_HOST || "postgres";
export const POSTGRES_PORT = process.env.POSTGRES_PORT || 5432;
