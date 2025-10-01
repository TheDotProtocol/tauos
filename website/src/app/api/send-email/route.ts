import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

// PRODUCTION SEND EMAIL API - FLATTENED ROUTE FOR BUSINESS CRITICAL OPERATIONS
const pool = new Pool({
  connectionString: 'postgresql://postgres.tviqcormikopltejomkc:Ak1233%40%405@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=disable',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 PRODUCTION SEND EMAIL API - Processing send request...');
    
    const { to, subject, body, from } = await request.json();
    
    if (!to || !subject || !body) {
      return NextResponse.json({ 
        error: 'Missing required fields: to, subject, body' 
      }, { status: 400 });
    }
    
    // For now, just log the email (you can integrate with SendGrid SMTP later)
    console.log('📧 Email to send:', { to, subject, from });
    
    // Store sent email in database
    const result = await pool.query(`
      INSERT INTO sent_emails (
        user_id, to_email, subject, body, sent_at
      ) VALUES (
        $1, $2, $3, $4, NOW()
      ) RETURNING id
    `, ['00000000-0000-0000-0000-000000000001', to, subject, body]);
    
    console.log('✅ Email queued with ID:', result.rows[0].id);
    
    return NextResponse.json({
      success: true,
      message: 'Email queued for sending',
      emailId: result.rows[0].id
    });
    
  } catch (error) {
    console.error('❌ PRODUCTION SEND EMAIL ERROR:', error);
    return NextResponse.json({ 
      error: 'Failed to send email',
      details: error.message
    }, { status: 500 });
  }
}
