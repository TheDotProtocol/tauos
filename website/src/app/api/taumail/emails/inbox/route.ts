import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import { verifyJWT, setSecurityHeaders, securityMiddleware, logSecurityEvent } from '../middleware/security';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Database connection - production ready with enhanced security
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.tviqcormikopltejomkc:Ak1233%40%405@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=require',
  ssl: {
    rejectUnauthorized: false
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export async function GET(request: NextRequest) {
  try {
    // Apply security middleware
    const securityResponse = await securityMiddleware(request);
    if (securityResponse) return securityResponse;

    // Verify JWT token
    const jwtResult = await verifyJWT(request);
    if (!jwtResult.valid) {
      logSecurityEvent('INVALID_TOKEN_ATTEMPT', { error: jwtResult.error }, request);
      return NextResponse.json({ error: jwtResult.error }, { status: 401 });
    }

    const user = jwtResult.user;
    
    // Get user's incoming emails with proper sender information and security filtering
    const result = await pool.query(
      `SELECT ie.id, ie.subject, ie.body, ie.from_email, ie.from_name, 
              ie.received_at, ie.is_read, ie.is_spam, ie.is_important,
              COALESCE(u.username, ie.from_name, ie.from_email) as sender_name,
              ie.from_email as sender_email,
              CASE 
                WHEN ie.is_spam = true THEN 'spam'
                WHEN ie.is_important = true THEN 'important'
                ELSE 'normal'
              END as priority
       FROM incoming_emails ie 
       LEFT JOIN users u ON ie.from_email = u.email 
       WHERE ie.user_id = $1 AND ie.is_deleted = false
       ORDER BY ie.received_at DESC
       LIMIT 50`,
      [user.id]
    );

    // Log successful inbox access
    logSecurityEvent('INBOX_ACCESS', { 
      userId: user.id, 
      emailCount: result.rows.length 
    }, request);

    const response = NextResponse.json({
      success: true,
      emails: result.rows,
      total: result.rows.length
    });

    // Apply security headers
    setSecurityHeaders(response);
    return response;

  } catch (error) {
    console.error('TauMail Inbox Error:', error);
    
    // Log security event for debugging
    logSecurityEvent('INBOX_ERROR', { 
      error: error.message,
      stack: error.stack 
    }, request);
    
    return NextResponse.json({ 
      error: 'Failed to load inbox',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}
