import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { Pool } from 'pg';

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Railway or Supabase
  },
});

export async function POST(request: Request) {
    try {
      // Log the raw request
      console.log('Received registration request');
      
      const body = await request.json();
      console.log('Registration request body:', { ...body, password: '[REDACTED]' });
      
      const { email, password, username } = body;

      // Validate all required fields
      if (!email || !password || !username) {
        console.log('Missing required fields:', { 
          hasEmail: !!email, 
          hasPassword: !!password, 
          hasUsername: !!username 
        });
        return NextResponse.json({ 
          message: 'Email, password, and username required',
          details: {
            hasEmail: !!email,
            hasPassword: !!password,
            hasUsername: !!username
          }
        }, { status: 400 });
      }

      // Server-side .edu check
      if (typeof email !== "string" || !email.trim().toLowerCase().endsWith(".edu")) {
        console.log('Invalid email format:', email);
        return NextResponse.json({ 
          message: 'You must use a .edu email address to register.',
          receivedEmail: email
        }, { status: 400 });
      }

      // Log database connection status
      console.log('Database connection string exists:', !!process.env.POSTGRES_URL);
      
      try {
        const hashedPassword = await hash(password, 10);
        console.log('Password hashed successfully');

        // Test database connection
        await pool.query('SELECT NOW()');
        console.log('Database connection test successful');

        // Insert user
        const result = await pool.query(
          'INSERT INTO "user" (email, password, username) VALUES ($1, $2, $3) RETURNING id',
          [email, hashedPassword, username]
        );
        
        console.log('User created successfully:', { 
          email, 
          userId: result.rows[0].id 
        });

        // Send welcome email
        try {
          const welcomeEmailResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/send-welcome-email`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, username }),
          });

          if (!welcomeEmailResponse.ok) {
            console.error('Failed to send welcome email:', await welcomeEmailResponse.text());
          }
        } catch (emailError) {
          console.error('Error sending welcome email:', emailError);
          // Don't fail registration if email fails
        }
        
        return NextResponse.json({ 
          message: 'User created successfully',
          userId: result.rows[0].id
        }, { status: 201 });
      } catch (dbError) {
        console.error('Database error details:', {
          error: dbError,
          code: (dbError as any)?.code,
          message: (dbError as any)?.message,
          detail: (dbError as any)?.detail
        });

        if (typeof dbError === 'object' && dbError !== null && 'code' in dbError) {
          const code = (dbError as { code?: string }).code;
          if (code === '23505') {
            return NextResponse.json({ 
              message: 'An account with this email already exists.',
              code: 'DUPLICATE_EMAIL'
            }, { status: 409 });
          }
          if (code === '42P01') {
            return NextResponse.json({ 
              message: 'Database table does not exist. Please contact support.',
              code: 'TABLE_NOT_FOUND'
            }, { status: 500 });
          }
        }
        throw dbError; // Re-throw to be caught by outer catch
      }

    } catch (e: unknown) {
      console.error('Registration error:', {
        error: e,
        message: e instanceof Error ? e.message : 'Unknown error',
        stack: e instanceof Error ? e.stack : undefined
      });
      
      return NextResponse.json({ 
        message: 'Registration failed',
        error: e instanceof Error ? e.message : 'Unknown error',
        type: e instanceof Error ? e.constructor.name : typeof e
      }, { status: 500 });
    }
}
