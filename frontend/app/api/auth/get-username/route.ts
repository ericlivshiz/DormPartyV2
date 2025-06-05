import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({
        status: 'error',
        message: 'Not authenticated'
      }, { status: 401 });
    }

    const result = await pool.query(
      'SELECT username FROM "user" WHERE email = $1',
      [session.user.email]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({
        status: 'error',
        message: 'User not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      status: 'success',
      username: result.rows[0].username
    });
  } catch (error) {
    console.error('Error fetching username:', error);
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 