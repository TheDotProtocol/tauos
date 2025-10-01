import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export async function GET(request: NextRequest) {
  try {
    console.log('📧 Fetching inbox emails...');

    const result = await pool.query(`
      SELECT
        e.id,
        e.from_email,
        e.to_email,
        e.subject,
        e.body_text,
        e.body_html,
        e.received_at,
        e.sent_at,
        e.is_read,
        e.is_starred,
        e.is_spam,
        e.message_id,
        f.name as folder_name,
        f.type as folder_type
      FROM taumail_v2.emails e
      LEFT JOIN taumail_v2.folders f ON e.folder_id = f.id
      WHERE e.user_id = $1
        AND e.is_deleted = false
        AND (f.type = 'inbox' OR f.type IS NULL)
      ORDER BY e.received_at DESC
      LIMIT 50
    `, ['d60c22bb-0b23-4a09-9e14-ac6cbc7c1547']); // saleena@tauos.org user ID

    console.log(`📧 Found ${result.rows.length} emails`);

    return NextResponse.json({
      success: true,
      emails: result.rows,
      total: result.rows.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Inbox error:', error);
    return NextResponse.json({
      error: 'Failed to fetch inbox',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
