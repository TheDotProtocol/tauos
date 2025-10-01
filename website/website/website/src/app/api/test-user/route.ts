import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

// Database connection - using IPv4 compatible URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.tviqcormikopltejomkc:Ak1233%40%405@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=disable',
  ssl: {
    rejectUnauthorized: false
  }
});

export async function GET(request: NextRequest) {
  try {
    // Check if user exists
    const result = await pool.query(
      'SELECT id, username, email, full_name, is_active, created_at FROM users WHERE email = $1',
      ['saleena@tauos.org']
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'User not found',
        user: null
      });
    }

    const user = result.rows[0];
    
    return NextResponse.json({
      success: true,
      message: 'User found',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        isActive: user.is_active,
        createdAt: user.created_at
      }
    });

  } catch (error) {
    console.error('User Test Error:', error);
    return NextResponse.json({ 
      error: 'User check failed',
      details: error.message
    }, { status: 500 });
  }
}
