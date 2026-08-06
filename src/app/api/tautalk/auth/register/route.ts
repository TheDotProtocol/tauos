import { getPool } from '@/lib/db-pool';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { attachAuthSession } from '@/lib/tau-session';
import { normalizeEmail, normalizePhone, verifyOtp } from '@/lib/tautalk-otp';

export async function POST(request: NextRequest) {
  try {
    const {
      email,
      password,
      username,
      fullName,
      phone,
      emailOtp,
      phoneOtp,
    } = await request.json();

    if (!email || !password || !username || !fullName || !emailOtp) {
      return NextResponse.json(
        { error: 'Email, password, username, full name, and email verification code are required' },
        { status: 400 }
      );
    }

    const normalizedEmail = normalizeEmail(email);
    const normalizedPhone = normalizePhone(phone);
    const cleanUsername = String(username).trim().replace(/^@/, '').toLowerCase();

    if (!/^[a-z0-9_-]{3,32}$/.test(cleanUsername)) {
      return NextResponse.json(
        { error: 'Username must be 3–32 characters: letters, numbers, _ or -' },
        { status: 400 }
      );
    }

    const emailOk = await verifyOtp('email', normalizedEmail, String(emailOtp));
    if (!emailOk) {
      return NextResponse.json({ error: 'Invalid or expired email verification code' }, { status: 400 });
    }

    if (normalizedPhone) {
      const twilioReady = Boolean(
        process.env.TWILIO_ACCOUNT_SID?.trim() &&
          process.env.TWILIO_AUTH_TOKEN?.trim() &&
          process.env.TWILIO_PHONE_NUMBER?.trim()
      );
      if (twilioReady) {
        if (!phoneOtp) {
          return NextResponse.json(
            { error: 'Phone verification code required when phone is provided' },
            { status: 400 }
          );
        }
        const phoneOk = await verifyOtp('phone', normalizedPhone, String(phoneOtp));
        if (!phoneOk) {
          return NextResponse.json({ error: 'Invalid or expired phone verification code' }, { status: 400 });
        }
      }
    }

    const existing = await getPool().query(
      `SELECT id FROM users
       WHERE email = $1 OR username = $2 OR ($3::text IS NOT NULL AND phone = $3)`,
      [normalizedEmail, cleanUsername, normalizedPhone]
    );
    if (existing.rows.length > 0) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    const hash = await bcrypt.hash(password, 10);
    const result = await getPool().query(
      `INSERT INTO users (
         username, email, password_hash, full_name, phone,
         is_active, email_verified, phone_verified, created_at
       )
       VALUES ($1, $2, $3, $4, $5, true, true, $6, CURRENT_TIMESTAMP)
       RETURNING id, username, email, full_name, phone, avatar_url`,
      [
        cleanUsername,
        normalizedEmail,
        hash,
        fullName,
        normalizedPhone,
        Boolean(
          normalizedPhone &&
            process.env.TWILIO_ACCOUNT_SID?.trim() &&
            process.env.TWILIO_AUTH_TOKEN?.trim() &&
            process.env.TWILIO_PHONE_NUMBER?.trim() &&
            phoneOtp
        ),
      ]
    );

    const user = result.rows[0];
    return attachAuthSession(
      request,
      { id: user.id, email: user.email, username: user.username, fullName: user.full_name },
      {
        message: 'Registration successful',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          phone: user.phone ?? null,
          fullName: user.full_name,
          avatarUrl: user.avatar_url ?? null,
        },
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    console.error('TauTalk register:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
