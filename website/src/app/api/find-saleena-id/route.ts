import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

// FIND SALEENA ID API - FIND THE CORRECT USER ID
const pool = new Pool({
  connectionString: 'postgresql://postgres.tviqcormikopltejomkc:Ak1233%40%405@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=disable',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 FINDING SALEENA ID...');
    
    // Find saleena@tauos.org user
    const saleenaUser = await pool.query(`
      SELECT id, email, username, full_name
      FROM users 
      WHERE email = 'saleena@tauos.org'
    `);
    
    console.log('🔍 Saleena user found:', saleenaUser.rows.length);
    
    if (saleenaUser.rows.length > 0) {
      const userId = saleenaUser.rows[0].id;
      console.log('🔍 Saleena user ID:', userId);
      
      // Check emails for this user
      const emails = await pool.query(`
        SELECT id, subject, from_email, received_at
        FROM incoming_emails 
        WHERE user_id = $1
        ORDER BY received_at DESC
        LIMIT 5
      `, [userId]);
      
      console.log('🔍 Emails for saleena:', emails.rows.length);
      
      return NextResponse.json({
        success: true,
        saleenaUser: saleenaUser.rows[0],
        emails: emails.rows,
        timestamp: new Date().toISOString()
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Saleena user not found',
        timestamp: new Date().toISOString()
      });
    }
    
  } catch (error) {
    console.error('❌ FIND SALEENA ID ERROR:', error);
    return NextResponse.json({ 
      error: 'Find saleena id failed',
      details: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
