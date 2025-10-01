import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import nodemailer from 'nodemailer';

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.tviqcormikopltejomkc:Ak1233%40%405@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=disable',
  ssl: { rejectUnauthorized: false }
});

// SMTP Configuration for Vultr server
const smtpConfig = {
  host: '136.244.83.147', // Your Vultr server IP
  port: 587,
  secure: false, // Use STARTTLS
  auth: {
    user: 'admin@tauos.org',
    pass: 'Ak1233@@5'
  },
  tls: {
    rejectUnauthorized: false
  }
};

const transporter = nodemailer.createTransport(smtpConfig);

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      // Handle JSON requests (manual simulation)
      const { to, from, subject, text, html } = await request.json();

      if (!to || !from || !subject) {
        return NextResponse.json({ 
          error: 'Missing required fields: to, from, subject' 
        }, { status: 400 });
      }

      // Find the recipient user
      const userResult = await pool.query('SELECT id, email FROM users WHERE email = $1', [to]);
      if (userResult.rows.length === 0) {
        return NextResponse.json({ error: 'Recipient not found' }, { status: 404 });
      }

      const userId = userResult.rows[0].id;

      // Store incoming email in database
      const result = await pool.query(`
        INSERT INTO incoming_emails (user_id, from_email, sender_name, subject, body, received_at, is_read, is_spam)
        VALUES ($1, $2, $3, $4, $5, NOW(), false, false)
        RETURNING id
      `, [userId, from, from.split('@')[0], subject, text || html]);

      console.log(`✅ Incoming email stored: ${from} -> ${to}`);

      return NextResponse.json({
        success: true,
        message: 'Email received and stored',
        emailId: result.rows[0].id
      });
      
    } else {
      // Handle raw email content (from Postfix)
      const rawEmail = await request.text();
      
      if (!rawEmail) {
        return NextResponse.json({ error: 'No email content received' }, { status: 400 });
      }

      // Parse raw email content
      const lines = rawEmail.split('\n');
      let from = '';
      let to = '';
      let subject = '';
      let body = '';
      let inBody = false;

      for (const line of lines) {
        if (line.startsWith('From:')) {
          from = line.replace('From:', '').trim();
        } else if (line.startsWith('To:')) {
          to = line.replace('To:', '').trim();
        } else if (line.startsWith('Subject:')) {
          subject = line.replace('Subject:', '').trim();
        } else if (line.trim() === '') {
          inBody = true;
        } else if (inBody) {
          body += line + '\n';
        }
      }

      if (!to || !from || !subject) {
        return NextResponse.json({ 
          error: 'Missing required email headers' 
        }, { status: 400 });
      }

      // Find the recipient user
      const userResult = await pool.query('SELECT id, email FROM users WHERE email = $1', [to]);
      if (userResult.rows.length === 0) {
        return NextResponse.json({ error: 'Recipient not found' }, { status: 404 });
      }

      const userId = userResult.rows[0].id;

      // Store incoming email in database
      const result = await pool.query(`
        INSERT INTO incoming_emails (user_id, from_email, sender_name, subject, body, received_at, is_read, is_spam)
        VALUES ($1, $2, $3, $4, $5, NOW(), false, false)
        RETURNING id
      `, [userId, from, from.split('@')[0], subject, body.trim()]);

      console.log(`✅ Raw email processed: ${from} -> ${to}`);

      return NextResponse.json({
        success: true,
        message: 'Raw email processed and stored',
        emailId: result.rows[0].id
      });
    }

  } catch (error) {
    console.error('SMTP incoming error:', error);
    return NextResponse.json({ 
      error: 'Failed to process incoming email',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

// Manual email simulation endpoint
export async function PUT(request: NextRequest) {
  try {
    const { to, from, subject, text, html, senderName } = await request.json();

    if (!to || !from || !subject) {
      return NextResponse.json({ 
        error: 'Missing required fields: to, from, subject' 
      }, { status: 400 });
    }

    // Find the recipient user
    const userResult = await pool.query('SELECT id, email FROM users WHERE email = $1', [to]);
    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'Recipient not found' }, { status: 404 });
    }

    const userId = userResult.rows[0].id;

    // Store simulated email in database
    const result = await pool.query(`
      INSERT INTO incoming_emails (user_id, from_email, sender_name, subject, body, received_at, is_read, is_spam)
      VALUES ($1, $2, $3, $4, $5, NOW(), false, false)
      RETURNING id
    `, [userId, from, senderName || from.split('@')[0], subject, text || html]);

    console.log(`✅ Simulated email stored: ${from} -> ${to}`);

    return NextResponse.json({
      success: true,
      message: 'Email simulated and stored',
      emailId: result.rows[0].id
    });

  } catch (error) {
    console.error('SMTP simulation error:', error);
    return NextResponse.json({ 
      error: 'Failed to simulate email',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}
// Force deployment
