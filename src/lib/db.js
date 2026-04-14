
import { Pool } from "pg";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
async function db() {
    const client = await pool.connect();
    return client;
}

export default db;