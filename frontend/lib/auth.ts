import { NextAuthOptions, DefaultSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';
import { Pool } from 'pg';

// Extend the built-in session types
declare module 'next-auth' {
  interface User {
    verified?: boolean;
  }
  
  interface Session {
    user: {
      verified?: boolean;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    verified?: boolean;
  }
}

// Setup Postgres connection
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Query the user from your 'user' table
        const result = await pool.query(
          'SELECT * FROM "user" WHERE email = $1',
          [credentials.email]
        );
        const user = result.rows[0];

        if (!user) {
          return null;
        }

        // Check if user is verified
        if (!user.verified) {
          throw new Error('Please verify your email before signing in');
        }

        // Compare plaintext password with hashed password from db
        const passwordCorrect = await compare(credentials.password, user.password);

        if (passwordCorrect) {
          return {
            id: user.id,
            email: user.email,
            verified: user.verified,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.verified = user.verified;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.verified = token.verified;
      }
      return session;
    },
  },
};