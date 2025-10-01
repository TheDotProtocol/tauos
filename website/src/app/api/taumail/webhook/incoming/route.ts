import { NextRequest, NextResponse } from 'next/server';
import { unifiedPool, testDatabaseConnection, ensureIncomingEmailsTable } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    // Ensure incoming_emails table exists using unified connection
    await ensureIncomingEmailsTable();

    // Parse the incoming email data from SendGrid webhook
    const emailData = await request.json();
    
    console.log('📨 Incoming Email Webhook:', JSON.stringify(emailData, null, 2));
    console.log('📨 Webhook called at:', new Date().toISOString());
    console.log('📨 Request headers:', Object.fromEntries(request.headers.entries()));

    // Extract email details from SendGrid webhook format
    const {
      from,
      to,
      subject,
      text,
      html,
      headers,
      attachments
    } = emailData;

    if (!to || !from) {
      console.log('❌ Missing required email fields');
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Extract the recipient email address
    let recipientEmail = Array.isArray(to) ? to[0] : to;
    
    // Clean email format - handle ALL possible formats
    // Remove quotes first
    recipientEmail = recipientEmail.replace(/"/g, '').trim();
    
    // If contains angle brackets, extract the email from them
    if (recipientEmail.includes('<') && recipientEmail.includes('>')) {
      const match = recipientEmail.match(/<([^>]+)>/);
      if (match) {
        recipientEmail = match[1];
      }
    }
    
    console.log('🔧 Cleaned email format:', recipientEmail);
    
    console.log('🔍 Looking for user with email:', recipientEmail);
    console.log('🔧 Email parsing fix deployed - testing angle bracket format - FINAL VERSION');
    
    // Test database connection and verify we're using the unified database
    await testDatabaseConnection();
    
    // Find the user by email address (more reliable than username)
    const userResult = await unifiedPool.query(
      'SELECT id, username, email FROM users WHERE email = $1',
      [recipientEmail]
    );

    if (userResult.rows.length === 0) {
      console.log(`❌ User not found for email: ${recipientEmail}`);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = userResult.rows[0];

    // Determine if this is spam (basic spam detection)
    const isSpam = subject?.toLowerCase().includes('spam') || 
                   subject?.toLowerCase().includes('viagra') ||
                   from?.toLowerCase().includes('noreply') ||
                   false;

    // Save incoming email to database
    const result = await unifiedPool.query(
      `INSERT INTO incoming_emails (
        user_id, 
        from_email, 
        sender_name, 
        subject, 
        body, 
        body_text, 
        body_html, 
        received_at, 
        is_spam,
        headers,
        attachments
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, $8, $9, $10) 
       RETURNING id, subject, received_at`,
      [
        user.id,
        from || 'unknown@example.com',
        headers?.['from-name'] || from?.split('@')[0] || 'Unknown Sender',
        subject || 'No Subject',
        text || 'No text content', // body column (required)
        text || 'No text content', // body_text column
        html || '<p>No HTML content</p>', // body_html column
        isSpam,
        JSON.stringify(headers || {}),
        JSON.stringify(attachments || [])
      ]
    );

    console.log('✅ Incoming email saved:', result.rows[0]);
    console.log('🔍 Database connection test - checking if table exists...');
    
    // Test if we can query the table directly
    try {
      const testQuery = await unifiedPool.query('SELECT COUNT(*) as count FROM incoming_emails');
      console.log('🔍 Table exists, total emails:', testQuery.rows[0].count);
    } catch (error) {
      console.log('🔍 Table query failed:', error.message);
    }

    return NextResponse.json({
      success: true,
      message: 'Email received and processed',
      emailId: result.rows[0].id
    });

  } catch (error) {
    console.error('❌ Incoming Email Webhook Error:', error);
    return NextResponse.json({ 
      error: 'Failed to process incoming email',
      details: error.message
    }, { status: 500 });
  }
}

// Handle GET requests for webhook verification
export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    message: 'TauCore Mail Incoming Email Webhook is active',
    status: 'ready'
  });
}
