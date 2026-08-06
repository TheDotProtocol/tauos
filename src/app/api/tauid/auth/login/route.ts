import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db-pool';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getSsoSecret } from '@/lib/tau-auth';
import { checkAuthRateLimit } from '@/lib/tauid/rate-limit';
import { normalizeEmail, validateEmail } from '@/lib/tauid/validation';
import { attachAuthSession } from '@/lib/tau-session';

export async function POST(request: NextRequest) {
  try {
    const limited = await checkAuthRateLimit(request, 'tauid-login');
    if (!limited.allowed) {
      return NextResponse.json(
        { error: `Too many attempts. Try again in ${limited.retryAfterSec}s.` },
        { status: 429 }
      );
    }

    const { email, password } = await request.json();
    const emailError = validateEmail(email || '');
    if (emailError || !password) {
      return NextResponse.json({ error: emailError || 'Password is required' }, { status: 400 });
    }

    const sanitizedEmail = normalizeEmail(email);

    const result = await getPool().query(
      `SELECT id, username, email, password_hash, full_name, is_active, mfa_enabled, mfa_secret
       FROM users WHERE email = $1`,
      [sanitizedEmail]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const user = result.rows[0];
    if (!user.is_active) {
      return NextResponse.json({ error: 'Account is deactivated' }, { status: 401 });
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (user.mfa_enabled && user.mfa_secret) {
      const mfaToken = jwt.sign(
        { userId: user.id, purpose: 'tauid_mfa' },
        getSsoSecret(),
        { expiresIn: '5m' }
      );
      return NextResponse.json({
        requires2fa: true,
        mfaToken,
        message: 'Two-factor authentication required',
      });
    }

    await getPool().query(
      'UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    return attachAuthSession(
      request,
      {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.full_name,
      },
      {
        message: 'Login successful',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.full_name,
        },
      }
    );
  } catch (error) {
    console.error('TauID Login Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
