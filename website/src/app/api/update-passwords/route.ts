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
    // Update Saleena's password hash
    await pool.query(
      "UPDATE users SET password_hash = $1 WHERE email = $2",
      ['$2b$10$wj10Arl4GN66gnO4t/OVme6nuXTCOExI0A1EvNxf/stidLtPF8Gdy', 'saleena@tauos.org']
    );

    // Update Senthil's password hash
    await pool.query(
      "UPDATE users SET password_hash = $1 WHERE email = $2",
      ['$2b$10$XXpGJRHyxvXkUQ5LWhTqL.u2cOoTeeoiBNq1bmyKi5kNnY8vPZFjS', 'senthil@tauos.org']
    );

    // Verify the updates
    const result = await pool.query(
      "SELECT id, username, email, full_name, is_active FROM users WHERE email IN ($1, $2)",
      ['saleena@tauos.org', 'senthil@tauos.org']
    );

    return NextResponse.json({
      success: true,
      message: 'Passwords updated successfully',
      users: result.rows
    });

  } catch (error) {
    console.error('Password Update Error:', error);
    return NextResponse.json({ 
      error: 'Password update failed',
      details: error.message
    }, { status: 500 });
  }
}
