import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

// Database connection - using IPv4 compatible URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.tviqcormikopltejomkc:Ak1233%40%405@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=require',
  ssl: {
    rejectUnauthorized: false
  }
  ssl: {
    rejectUnauthorized: false
  }
});

export async function GET(request: NextRequest) {
  try {
    // Get all users
    const result = await pool.query('SELECT * FROM users LIMIT 10');
    
    return NextResponse.json({
      success: true,
      message: 'Users retrieved successfully',
      users: result.rows,
      count: result.rows.length
    });

  } catch (error) {
    console.error('List Users Error:', error);
    return NextResponse.json({ 
      error: 'Failed to list users',
      details: error.message
    }, { status: 500 });
  }
}
