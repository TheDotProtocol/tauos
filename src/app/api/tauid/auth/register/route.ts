import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db-pool';
import bcrypt from 'bcryptjs';
import { checkAuthRateLimit } from '@/lib/tauid/rate-limit';
import { normalizeEmail, validateRegisterInput } from '@/lib/tauid/validation';
import { sendTauIdOtp } from '@/lib/tauid/otp';
import { attachAuthSession } from '@/lib/tau-session';

export async function POST(request: NextRequest) {
  try {
    const limited = await checkAuthRateLimit(request, 'tauid-register');
    if (!limited.allowed) {
      return NextResponse.json(
        { error: `Too many attempts. Try again in ${limited.retryAfterSec}s.` },
        { status: 429 }
      );
    }

    const { email, password, username, fullName } = await request.json();
    const validationError = validateRegisterInput({
      email: email || '',
      password: password || '',
      username: username || '',
      fullName: fullName || '',
    });
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const normalizedEmail = normalizeEmail(email);
    const trimmedUsername = username.trim();

    const existingUser = await getPool().query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [normalizedEmail, trimmedUsername]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json({ error: 'An account with this email or username already exists' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await getPool().query(
      `INSERT INTO users (username, email, password_hash, full_name, is_active, email_verified, created_at)
       VALUES ($1, $2, $3, $4, true, false, CURRENT_TIMESTAMP)
       RETURNING id, username, email, full_name, email_verified`,
      [trimmedUsername, normalizedEmail, passwordHash, fullName.trim()]
    );

    const user = result.rows[0];

    let devCode: string | undefined;
    try {
      const sent = await sendTauIdOtp('email_verify', normalizedEmail, user.id);
      devCode = sent.devCode;
    } catch (err) {
      console.warn('[tauid-register] verification email failed:', err);
    }

    return attachAuthSession(
      request,
      {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.full_name,
      },
      {
        message: 'Registration successful',
        devCode,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.full_name,
          emailVerified: user.email_verified,
        },
      }
    );
  } catch (error) {
    console.error('TauID Registration Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
