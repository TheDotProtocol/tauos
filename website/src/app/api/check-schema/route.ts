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
    
    // Create incoming_emails table if it doesn't exist
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS incoming_emails (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL,
          from_email VARCHAR(255) NOT NULL,
          sender_name VARCHAR(255),
          subject TEXT,
          body TEXT,
          body_text TEXT,
          body_html TEXT,
          received_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          is_read BOOLEAN DEFAULT FALSE,
          is_spam BOOLEAN DEFAULT FALSE,
          headers JSONB,
          attachments JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('✅ incoming_emails table created/ensured');
    } catch (tableError: any) {
      console.log('⚠️ Table creation warning:', tableError.message);
    }

    // Check incoming_emails table - FORCE FRESH DEPLOYMENT
    const incomingEmailsResult = await pool.query(`
      SELECT id, user_id, from_email, subject, received_at, is_spam
      FROM incoming_emails 
      ORDER BY received_at DESC 
      LIMIT 5
    `);

    return NextResponse.json({
      success: true,
      message: 'Users table structure found',
      columns: tableCheck.rows,
      sampleUsers: users.rows,
      incomingEmails: incomingEmailsResult.rows
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
