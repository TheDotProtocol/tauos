import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { getPool } from '@/lib/db-pool';
import { sendTauIdOtp } from '@/lib/tauid/otp';
import { checkAuthRateLimit } from '@/lib/tauid/rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const limited = await checkAuthRateLimit(request, 'tauid-verify-send');
    if (!limited.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userResult = await getPool().query(
      'SELECT email, email_verified FROM users WHERE id = $1',
      [auth.userId]
    );
    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = userResult.rows[0];
    if (user.email_verified) {
      return NextResponse.json({ message: 'Email already verified', alreadyVerified: true });
    }

    const sent = await sendTauIdOtp('email_verify', user.email, String(auth.userId));
    return NextResponse.json({ success: true, devCode: sent.devCode });
  } catch (error) {
    console.error('TauID verify send:', error);
    return NextResponse.json({ error: 'Could not send verification code' }, { status: 500 });
  }
}
