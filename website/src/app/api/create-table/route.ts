import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

// Use the EXACT same database connection as the webhook
const pool = new Pool({
  connectionString: 'postgresql://postgres.tviqcormikopltejomkc:Ak1233%40%405@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=disable',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 CREATING INCOMING_EMAILS TABLE');
    
    // Create the table
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
    
    console.log('✅ Table created successfully');
    
    // Test if we can query the table
    const testResult = await pool.query('SELECT COUNT(*) as count FROM incoming_emails');
    console.log('🔍 Table test result:', testResult.rows[0]);
    
    return NextResponse.json({
      success: true,
      message: 'Table created successfully',
      count: testResult.rows[0].count
    });

  } catch (error) {
    console.error('Table creation error:', error);
    return NextResponse.json({ 
      error: 'Failed to create table',
      details: error.message
    }, { status: 500 });
  }
}
