import { getPool, getJwtSecret } from '@/lib/db-pool';
import { NextRequest, NextResponse } from 'next/server';

// Database connection - using IPv4 compatible URL


export async function GET(request: NextRequest) {
  try {
    // Get all users
    const result = await getPool().query('SELECT * FROM users LIMIT 10');
    
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
