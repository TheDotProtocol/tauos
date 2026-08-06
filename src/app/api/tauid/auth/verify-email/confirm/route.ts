import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { getPool } from '@/lib/db-pool';
import { verifyTauIdOtp } from '@/lib/tauid/otp';
import { normalizeEmail } from '@/lib/tauid/validation';
import { checkAuthRateLimit } from '@/lib/tauid/rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const limited = await checkAuthRateLimit(request, 'tauid-verify-confirm');
    if (!limited.allowed) {
      return NextResponse.json({ error: 'Too many attempts' }, { status: 429 });
    }

    const auth = requireAuth(request);
    const body = await request.json();
    const code = String(body.code || '').trim();
    if (!code) {
      return NextResponse.json({ error: 'Verification code required' }, { status: 400 });
    }

    let email = body.email ? normalizeEmail(body.email) : null;
    if (auth?.userId) {
      const userResult = await getPool().query('SELECT email FROM users WHERE id = $1', [auth.userId]);
      if (userResult.rows.length > 0) email = userResult.rows[0].email;
    }
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const verified = await verifyTauIdOtp('email_verify', email, code);
    if (!verified.ok) {
      return NextResponse.json({ error: verified.error || 'Invalid code' }, { status: 400 });
    }

    await getPool().query(
      'UPDATE users SET email_verified = true WHERE email = $1',
      [email]
    );

    return NextResponse.json({ success: true, message: 'Email verified' });
  } catch (error) {
    console.error('TauID verify confirm:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
