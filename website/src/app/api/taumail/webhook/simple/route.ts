import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

// SIMPLE WEBHOOK - INSERT ONLY, NO COMPLEX LOGIC
const pool = new Pool({
  connectionString: 'postgresql://postgres.tviqcormikopltejomkc:Ak1233%40%405@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=disable',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 SIMPLE WEBHOOK - Starting...');
    
    // Get email data from request
    const formData = await request.formData();
    const fromEmail = formData.get('from') as string;
    const toEmail = formData.get('to') as string;
    const subject = formData.get('subject') as string;
    const body = formData.get('text') as string || formData.get('html') as string;
    
    console.log('🚀 SIMPLE WEBHOOK - Email data:', { fromEmail, toEmail, subject });
    
    // Clean email format - handle angle brackets
    let recipientEmail = toEmail;
    if (recipientEmail.includes('<') && recipientEmail.includes('>')) {
      const match = recipientEmail.match(/<([^>]+)>/);
      if (match) {
        recipientEmail = match[1];
      }
    }
    
    // Find user ID for recipient email
    const userResult = await pool.query(`
      SELECT id FROM users WHERE email = $1
    `, [recipientEmail]);
    
    if (userResult.rows.length === 0) {
      console.log('❌ SIMPLE WEBHOOK - User not found:', recipientEmail);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    const userId = userResult.rows[0].id;
    console.log('🚀 SIMPLE WEBHOOK - User ID:', userId);
    
    // INSERT ONLY - Simple database insert
    const result = await pool.query(`
      INSERT INTO incoming_emails (
        user_id, from_email, subject, body, received_at
      ) VALUES (
        $1, $2, $3, $4, NOW()
      ) RETURNING id
    `, [userId, fromEmail, subject, body]);
    
    console.log('🚀 SIMPLE WEBHOOK - Email inserted with ID:', result.rows[0].id);
    
    return NextResponse.json({
      success: true,
      message: 'Email received and processed',
      emailId: result.rows[0].id
    });
    
  } catch (error) {
    console.error('❌ SIMPLE WEBHOOK ERROR:', error);
    return NextResponse.json({ 
      error: 'Failed to process email',
      details: error.message
    }, { status: 500 });
  }
}
