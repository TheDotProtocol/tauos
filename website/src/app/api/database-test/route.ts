import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.tviqcormikopltejomkc:Ak1233%40%405@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=disable',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 DATABASE CONNECTION TEST');
    console.log('🔍 DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');
    
    // Test 1: Check if we can connect
    const connectionTest = await pool.query('SELECT NOW() as current_time');
    
    // Test 2: Check if incoming_emails table exists
    let tableExists = false;
    let tableCount = 0;
    let error = null;
    
    try {
      const tableCheck = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'incoming_emails'
        );
      `);
      tableExists = tableCheck.rows[0].exists;
      
      if (tableExists) {
        const countResult = await pool.query('SELECT COUNT(*) as count FROM incoming_emails');
        tableCount = countResult.rows[0].count;
      }
    } catch (tableError) {
      error = tableError.message;
    }
    
    // Test 3: List all tables
    const allTables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    return NextResponse.json({
      success: true,
      message: 'Database connection test completed',
      connectionTime: connectionTest.rows[0].current_time,
      databaseUrl: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
      tableExists: tableExists,
      tableCount: tableCount,
      error: error,
      allTables: allTables.rows.map(row => row.table_name)
    });

  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({ 
      error: 'Database test failed',
      details: error.message
    }, { status: 500 });
  }
}
