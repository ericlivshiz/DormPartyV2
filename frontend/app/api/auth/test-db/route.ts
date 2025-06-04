import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function GET() {
  try {
    // Test database connection
    const connectionTest = await pool.query('SELECT NOW()');
    console.log('Database connection successful:', connectionTest.rows[0].now);

    // Check if user table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'user'
      );
    `);
    console.log('User table exists:', tableCheck.rows[0].exists);

    let tableStructure = null;
    if (tableCheck.rows[0].exists) {
      // Get table structure
      const structureResult = await pool.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'user';
      `);
      tableStructure = structureResult.rows;
      console.log('Table structure:', tableStructure);
    }

    return NextResponse.json({
      status: 'success',
      connection: 'ok',
      tableExists: tableCheck.rows[0].exists,
      tableStructure
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
      details: error
    }, { status: 500 });
  }
} 