import pg from 'pg';
import {POSTGRES_DB,
        POSTGRES_HOST,
        POSTGRES_PASSWORD,
        POSTGRES_USER, 
        POSTGRES_PORT} from "./config.js";

 const { Pool } = pg;
export const pool = new Pool({
    user: POSTGRES_USER,
    host: POSTGRES_HOST,
    port: POSTGRES_PORT,
    database: POSTGRES_DB,
    password: POSTGRES_PASSWORD,
    port: 5432,
});
