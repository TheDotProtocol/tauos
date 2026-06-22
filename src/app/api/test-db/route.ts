import { getPool, getJwtSecret } from '@/lib/db-pool';
import { NextRequest, NextResponse } from 'next/server';

// Database connection - using IPv4 compatible URL


export async function GET(request: NextRequest) {
  try {
    // Test database connection
    const result = await getPool().query('SELECT NOW() as current_time');
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      currentTime: result.rows[0].current_time,
      databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set'
    });

  } catch (error) {
    console.error('Database Test Error:', error);
    return NextResponse.json({ 
      error: 'Database connection failed',
      details: error.message,
      databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set'
    }, { status: 500 });
  }
}
