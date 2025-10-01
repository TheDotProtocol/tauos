import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.tviqcormikopltejomkc:Ak1233%40%405@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=disable',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export async function POST(request: NextRequest) {
  try {
    // Create incoming_emails table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS incoming_emails (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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
    `;

    await pool.query(createTableQuery);

    // Create indexes for better performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_incoming_emails_user_id ON incoming_emails(user_id);
      CREATE INDEX IF NOT EXISTS idx_incoming_emails_received_at ON incoming_emails(received_at);
      CREATE INDEX IF NOT EXISTS idx_incoming_emails_is_spam ON incoming_emails(is_spam);
    `);

    // Verify table was created
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'incoming_emails'
      );
    `);

    return NextResponse.json({
      success: true,
      message: 'incoming_emails table created successfully',
      tableExists: tableCheck.rows[0].exists
    });

  } catch (error) {
    console.error('Create table error:', error);
    return NextResponse.json({ 
      error: 'Failed to create incoming_emails table',
      details: error.message
    }, { status: 500 });
  }
}
