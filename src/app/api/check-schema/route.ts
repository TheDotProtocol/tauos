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
    // Check if users table exists and get its structure
    const tableCheck = await pool.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position
    `);
    
    if (tableCheck.rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Users table does not exist',
        tables: await getTableList()
      });
    }

    // Get all users to see the actual data structure
    const users = await pool.query('SELECT * FROM users LIMIT 5');
    
    return NextResponse.json({
      success: true,
      message: 'Users table structure found',
      columns: tableCheck.rows,
      sampleUsers: users.rows
    });

  } catch (error) {
    console.error('Schema Check Error:', error);
    return NextResponse.json({ 
      error: 'Schema check failed',
      details: error.message
    }, { status: 500 });
  }
}

async function getTableList() {
  try {
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    return result.rows;
  } catch (error) {
    return [];
  }
}
