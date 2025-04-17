import { sql, createPool } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';

// Create a pool with the appropriate configuration based on environment
const poolConfig = {
  connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false,
  maxRetries: 3,
  timeout: 10000, // 10 seconds
};

export const db = createPool(poolConfig);

// Helper function to execute database queries
export async function executeQuery(query: string, params: any[] = []) {
  noStore();
  try {
    const result = await sql.query(query, params);
    return result;
  } catch (error: any) {
    console.error('Database query error:', {
      query,
      error: error.message,
      code: error.code,
      connectionString: process.env.NODE_ENV === 'development' ? 
        'Using development database' : 
        'Using production database'
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

// Initialize database connection
export async function initializeDatabase() {
  try {
    await testConnection();
    
    // Create tables if they don't exist
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE,
        image TEXT,
        role TEXT DEFAULT 'user',
        bio TEXT,
        location TEXT,
        website TEXT,
        phone_number TEXT,
        email_notifications BOOLEAN DEFAULT false,
        push_notifications BOOLEAN DEFAULT false,
        premium BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS user_activities (
        id SERIAL PRIMARY KEY,
        user_id TEXT REFERENCES users(id),
        activity_type TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        metadata JSONB
      );
    `;

    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Database initialization failed:', error);
    return false;
  }
} 