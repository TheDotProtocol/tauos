import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

// Database connection - using IPv4 compatible URL
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

    // First, let's see what columns actually exist
    const schemaCheck = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position
    `);

    // Try to find user with minimal query
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ 
        error: 'User not found',
        schema: schemaCheck.rows,
        message: 'User does not exist in database'
      }, { status: 401 });
    }

    const user = result.rows[0];
    
    // Check if password_hash exists and matches
    if (!user.password_hash) {
      return NextResponse.json({ 
        error: 'Invalid user data structure',
        schema: schemaCheck.rows,
        user: user
      }, { status: 500 });
    }

    // For now, let's just return success with user data
    return NextResponse.json({
      message: 'Login successful (debug mode)',
      user: user,
      schema: schemaCheck.rows
    });

  } catch (error) {
    console.error('TauMail Debug Error:', error);
    return NextResponse.json({ 
      error: 'Debug failed',
      details: error.message
    }, { status: 500 });
  }
}
