import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';

// Database connection - production ready
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.tviqcormikopltejomkc:Ak1233%40%405@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=require',
  ssl: {
    rejectUnauthorized: false
  }
});

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Query user from database
    const result = await pool.query(
      'SELECT id, username, email, password_hash, full_name, is_active FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const user = result.rows[0];

    if (!user.is_active) {
      return NextResponse.json({ error: 'Account is deactivated' }, { status: 401 });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Update last login
    await pool.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET_TAUID || 'tauos-prod-jwt-secret-2025-launch-a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6';
    const token = jwt.sign(
      { userId: user.id, email: user.email, username: user.username, app: 'tauid' },
      jwtSecret,
      { expiresIn: '24h' }
    );

    return NextResponse.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name
      }
    });

  } catch (error) {
    console.error('TauID Login Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}