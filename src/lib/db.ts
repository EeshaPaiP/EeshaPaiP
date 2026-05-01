import { Pool } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("Missing DATABASE_URL in environment variables.");
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const query = (text: string, params?: any[]) => pool.query(text, params);