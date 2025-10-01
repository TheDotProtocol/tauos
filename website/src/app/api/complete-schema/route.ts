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
    console.log('🔍 COMPLETE DATABASE SCHEMA ANALYSIS');
    
    // Get all tables in the database
    const allTables = await pool.query(`
      SELECT table_name, table_type
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('🔍 Found tables:', allTables.rows.length);
    
    // Get detailed info for each table
    const tableDetails = [];
    
    for (const table of allTables.rows) {
      const tableName = table.table_name;
      
      // Get column information
      const columns = await pool.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = $1
        ORDER BY ordinal_position
      `, [tableName]);
      
      // Get row count
      const rowCount = await pool.query(`SELECT COUNT(*) as count FROM ${tableName}`);
      
      // Get sample data (first 3 rows)
      let sampleData = [];
      try {
        const sample = await pool.query(`SELECT * FROM ${tableName} LIMIT 3`);
        sampleData = sample.rows;
      } catch (error) {
        sampleData = [{ error: 'Could not fetch sample data' }];
      }
      
      tableDetails.push({
        tableName,
        tableType: table.table_type,
        columnCount: columns.rows.length,
        rowCount: rowCount.rows[0].count,
        columns: columns.rows,
        sampleData: sampleData
      });
    }
    
    // Check for foreign key relationships
    const foreignKeys = await pool.query(`
      SELECT 
        tc.table_name, 
        kcu.column_name, 
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name 
      FROM information_schema.table_constraints AS tc 
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY' 
        AND tc.table_schema = 'public'
    `);
    
    return NextResponse.json({
      success: true,
      message: 'Complete database schema analysis',
      totalTables: allTables.rows.length,
      tables: allTables.rows,
      tableDetails: tableDetails,
      foreignKeys: foreignKeys.rows,
      databaseUrl: process.env.DATABASE_URL ? 'SET' : 'NOT SET'
    });

  } catch (error) {
    console.error('Complete schema error:', error);
    return NextResponse.json({ 
      error: 'Failed to analyze complete schema',
      details: error.message
    }, { status: 500 });
  }
}
