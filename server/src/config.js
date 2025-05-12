import dotenv from 'dotenv';

// Config() considera como raiz la carpeta donde está el package.json
dotenv.config({ path: './.env' });

// Frontend
export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5000";

// Servidor
export const PORT = process.env.PORT || 3000;
export const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";

// Token
export const JWT_SECRET = process.env.JWT_SECRET || "xyz123";


// Base de datos
export const POSTGRES_USER = process.env.POSTGRES_USER || "choosit";
export const POSTGRES_DB = process.env.POSTGRES_DB || "choosit";
export const POSTGRES_PASSWORD =  process.env.POSTGRES_PASSWORD || "choosit";
export const POSTGRES_HOST = process.env.POSTGRES_HOST || "postgres";
export const POSTGRES_PORT = process.env.POSTGRES_PORT || 5432;

// SMTP
export const SMTP_PASS = process.env.SMTP_PASS || "3714c26cdd2390";
export const SMTP_USER = process.env.SMTP_USER || "68f29f621a5bae";
export const SMTP_HOST = process.env.SMTP_HOST || "sandbox.smtp.mailtrap.io";
export const SMTP_PORT = process.env.SMTP_PORT || 2525;
export const SMTP_FROM = process.env.SMTP_FROM || "choosit.dev.dev@gmail.com"
