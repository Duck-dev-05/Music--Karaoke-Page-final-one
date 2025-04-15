import { sql } from '@vercel/postgres';
import { createPool } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';

export const db = createPool({
  connectionString: process.env.POSTGRES_URL,
  ssl: process.env.NODE_ENV === 'production',
  maxRetries: 3,
  timeout: 10000, // 10 seconds
});

export async function executeQuery(query: string, params: any[] = []) {
  noStore();
  try {
    const result = await sql.query(query, params);
    return result;
  } catch (error: any) {
    console.error('Database query error:', {
      query,
      error: error.message,
      code: error.code
    });
    
    // Handle specific database errors
    switch (error.code) {
      case '23505': // unique_violation
        throw new Error('This record already exists.');
      case '23503': // foreign_key_violation
        throw new Error('Referenced record does not exist.');
      case '42P01': // undefined_table
        throw new Error('Table does not exist.');
      case '28P01': // invalid_password
        throw new Error('Database authentication failed.');
      default:
        throw new Error('An error occurred while accessing the database.');
    }
  }
}

// Test database connection
export async function testConnection() {
  try {
    await sql`SELECT 1`;
    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
} 