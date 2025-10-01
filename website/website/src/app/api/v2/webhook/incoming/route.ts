import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export async function POST(request: NextRequest) {
  try {
    console.log('📨 Webhook received - processing incoming email...');

    const body = await request.json();
    const { from, to, subject, text, html } = body;

    console.log('📧 Email data:', { from, to, subject });

    if (!from || !to) {
      return NextResponse.json({
        error: 'Missing required fields',
        required: ['from', 'to']
      }, { status: 400 });
    }

    // Clean email format - handle angle brackets
    let recipientEmail = to;
    if (recipientEmail.includes('<') && recipientEmail.includes('>')) {
      const match = recipientEmail.match(/<([^>]+)>/);
      if (match) {
        recipientEmail = match[1];
      }
    }

    // Find user ID for recipient email
    const userResult = await pool.query(`
      SELECT id FROM auth.users WHERE email = $1
    `, [recipientEmail]);

    if (userResult.rows.length === 0) {
      console.log('❌ User not found:', recipientEmail);
      return NextResponse.json({
        error: 'User not found',
        email: recipientEmail
      }, { status: 404 });
    }

    const userId = userResult.rows[0].id;
    console.log('👤 User ID:', userId);

    // Get inbox folder ID
    const folderResult = await pool.query(`
      SELECT id FROM taumail_v2.folders
      WHERE user_id = $1 AND type = 'inbox'
    `, [userId]);

    if (folderResult.rows.length === 0) {
      return NextResponse.json({
        error: 'Inbox folder not found'
      }, { status: 500 });
    }

    // Insert email into database
    const result = await pool.query(`
      INSERT INTO taumail_v2.emails (
        user_id, folder_id, from_email, to_email, subject,
        body_text, body_html, received_at, is_read
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, NOW(), false
      ) RETURNING id
    `, [
      userId,
      folderResult.rows[0].id,
      from,
      recipientEmail,
      subject || 'No Subject',
      text || '',
      html || text || '',
    ]);

    console.log('✅ Email saved with ID:', result.rows[0].id);

    return NextResponse.json({
      success: true,
      message: 'Email received and processed',
      emailId: result.rows[0].id,
      userId: userId
    });

  } catch (error) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json({
      error: 'Failed to process email',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
