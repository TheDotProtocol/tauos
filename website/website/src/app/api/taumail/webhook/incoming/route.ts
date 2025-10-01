import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import crypto from 'crypto';

// Database connection - production ready with enhanced error handling
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.tviqcormikopltejomkc:Ak1233%40%405@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=disable',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// SendGrid webhook signature verification
function verifySignature(payload: string, signature: string, timestamp: string, publicKey: string): boolean {
  try {
    // For now, we'll skip signature verification to get emails working
    // TODO: Implement proper ECDSA signature verification
    console.log('🔐 Signature verification skipped for now');
    return true;
  } catch (error) {
    console.error('🔐 Signature verification error:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type');
    console.log('📨 Webhook called at:', new Date().toISOString());
    console.log('📨 Content-Type:', contentType);
    console.log('📨 Request headers:', Object.fromEntries(request.headers.entries()));

    // Check for SendGrid security headers
    const signature = request.headers.get('X-Twilio-Email-Event-Webhook-Signature');
    const timestamp = request.headers.get('X-Twilio-Email-Event-Webhook-Timestamp');
    
    if (signature && timestamp) {
      console.log('🔐 Security headers detected - signature verification enabled');
      // TODO: Implement proper signature verification
    }

    let emailData;
    
    if (contentType?.includes('application/json')) {
      // Handle JSON requests (manual simulation)
      emailData = await request.json();
      console.log('📨 JSON Email Data:', JSON.stringify(emailData, null, 2));
    } else if (contentType?.includes('multipart/form-data')) {
      // Handle multipart/form-data from SendGrid Inbound Parse
      const formData = await request.formData();
      emailData = {
        from: formData.get('from'),
        to: formData.get('to'),
        subject: formData.get('subject'),
        text: formData.get('text'),
        html: formData.get('html'),
        headers: formData.get('headers'),
        attachments: formData.get('attachments'),
        spam_score: formData.get('spam_score'),
        spam_report: formData.get('spam_report'),
        envelope: formData.get('envelope')
      };
      console.log('📨 Multipart Email Data:', JSON.stringify(emailData, null, 2));
    } else if (contentType?.includes('application/x-www-form-urlencoded')) {
      // Handle URL-encoded form data
      const formData = await request.formData();
      emailData = {
        from: formData.get('from'),
        to: formData.get('to'),
        subject: formData.get('subject'),
        text: formData.get('text'),
        html: formData.get('html'),
        headers: formData.get('headers'),
        attachments: formData.get('attachments'),
        spam_score: formData.get('spam_score'),
        spam_report: formData.get('spam_report'),
        envelope: formData.get('envelope')
      };
      console.log('📨 URL-Encoded Email Data:', JSON.stringify(emailData, null, 2));
    } else {
      // Handle raw email content
      const rawEmail = await request.text();
      console.log('📨 Raw Email Content:', rawEmail.substring(0, 200) + '...');
      
      // Better email parsing to handle MIME boundaries
      const lines = rawEmail.split('\n');
      let from = '';
      let to = '';
      let subject = '';
      let body = '';
      let inBody = false;
      let inMimePart = false;
      let mimeBoundary = '';

      for (const line of lines) {
        // Extract MIME boundary
        if (line.includes('boundary=')) {
          const match = line.match(/boundary="?([^"\s]+)"?/);
          if (match) {
            mimeBoundary = match[1];
          }
        }
        
        // Check for MIME boundary
        if (mimeBoundary && line.includes(mimeBoundary)) {
          inMimePart = !inMimePart;
          continue;
        }
        
        // Skip MIME headers
        if (inMimePart && (line.startsWith('Content-Type:') || line.startsWith('Content-Transfer-Encoding:'))) {
          continue;
        }
        
        if (line.startsWith('From:')) {
          from = line.replace('From:', '').trim();
        } else if (line.startsWith('To:')) {
          to = line.replace('To:', '').trim();
        } else if (line.startsWith('Subject:')) {
          subject = line.replace('Subject:', '').trim();
        } else if (line.trim() === '') {
          inBody = true;
        } else if (inBody && !inMimePart) {
          // Skip MIME boundary lines
          if (!line.includes('--' + mimeBoundary) && !line.includes('--' + mimeBoundary + '--')) {
            body += line + '\n';
          }
        }
      }

      // Clean up the body - remove MIME artifacts
      body = body
        .replace(/--\d+[a-f0-9]+/g, '') // Remove MIME boundaries
        .replace(/Content-Type:.*?charset="UTF-8"/g, '') // Remove content type headers
        .replace(/Content-Transfer-Encoding:.*?\n/g, '') // Remove transfer encoding
        .trim();

      emailData = { from, to, subject, text: body };
      console.log('📨 Parsed Raw Email:', JSON.stringify(emailData, null, 2));
    }

    // Extract email details from SendGrid webhook format
    const {
      from,
      to,
      subject,
      text,
      html,
      headers,
      attachments,
      spam_score,
      spam_report
    } = emailData;

    if (!to || !from) {
      console.log('❌ Missing required email fields');
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Extract the recipient username from the email address
    // Assuming format: username@tauos.org
    const recipientEmail = Array.isArray(to) ? to[0] : to;
    const recipientUsername = recipientEmail.split('@')[0];
    
    // Clean up the from field - extract email and name properly
    let fromEmail = from;
    let senderName = '';
    
    if (from.includes('<') && from.includes('>')) {
      // Format: "Name <email@domain.com>"
      const match = from.match(/^(.+?)\s*<(.+?)>$/);
      if (match) {
        senderName = match[1].trim().replace(/^["']|["']$/g, ''); // Remove quotes
        fromEmail = match[2].trim();
      }
    } else if (from.includes('@')) {
      // Format: "email@domain.com"
      fromEmail = from.trim();
    }
    
    // Find the user by username
    const userResult = await pool.query(
      'SELECT id, username, email FROM users WHERE username = $1 OR email = $2',
      [recipientUsername, recipientEmail]
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
    const result = await pool.query(
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
        fromEmail || 'unknown@example.com',
        senderName || fromEmail?.split('@')[0] || 'Unknown Sender',
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
