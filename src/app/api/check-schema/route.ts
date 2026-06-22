import { getPool, getJwtSecret } from '@/lib/db-pool';
import { NextRequest, NextResponse } from 'next/server';

// Database connection - using IPv4 compatible URL


export async function GET(request: NextRequest) {
  try {
    // Check if users table exists and get its structure
    const tableCheck = await getPool().query(`
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
    const users = await getPool().query('SELECT * FROM users LIMIT 5');
    
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
    const result = await getPool().query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    return result.rows;
  } catch (error) {
    return [];
  }
}
