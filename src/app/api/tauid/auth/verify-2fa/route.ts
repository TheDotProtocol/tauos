import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getPool } from '@/lib/db-pool';
import { getSsoSecret } from '@/lib/tau-auth';
import { verifyTotpCode } from '@/lib/totp';
import { checkAuthRateLimit } from '@/lib/tauid/rate-limit';
import { attachAuthSession } from '@/lib/tau-session';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const limited = await checkAuthRateLimit(request, 'tauid-2fa');
    if (!limited.allowed) {
      return NextResponse.json({ error: 'Too many attempts' }, { status: 429 });
    }

    const { mfaToken, code } = await request.json();
    if (!mfaToken || !code) {
      return NextResponse.json({ error: 'Token and code required' }, { status: 400 });
    }

    let payload: { userId: string; purpose?: string };
    try {
      payload = jwt.verify(mfaToken, getSsoSecret()) as { userId: string; purpose?: string };
    } catch {
      return NextResponse.json({ error: 'MFA session expired. Sign in again.' }, { status: 401 });
    }

    if (payload.purpose !== 'tauid_mfa') {
      return NextResponse.json({ error: 'Invalid MFA token' }, { status: 401 });
    }

    const result = await getPool().query(
      `SELECT id, username, email, full_name, mfa_secret, mfa_enabled, is_active
       FROM users WHERE id = $1`,
      [payload.userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = result.rows[0];
    if (!user.mfa_enabled || !user.mfa_secret) {
      return NextResponse.json({ error: '2FA not enabled' }, { status: 400 });
    }

    if (!verifyTotpCode(String(code), user.mfa_secret)) {
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 401 });
    }

    await getPool().query('UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);

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
    console.error('TauID 2FA verify:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
