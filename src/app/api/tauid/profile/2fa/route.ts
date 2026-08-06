import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { getPool } from '@/lib/db-pool';
import { buildOtpAuthUrl, generateTotpSecret, verifyTotpCode } from '@/lib/totp';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await getPool().query(
      'SELECT email, mfa_enabled FROM users WHERE id = $1',
      [auth.userId]
    );
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      enabled: Boolean(result.rows[0].mfa_enabled),
      email: result.rows[0].email,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to load 2FA status' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const action = body.action as 'setup' | 'enable' | 'disable';

    const userResult = await getPool().query(
      'SELECT email, mfa_enabled, mfa_secret FROM users WHERE id = $1',
      [auth.userId]
    );
    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const user = userResult.rows[0];

    if (action === 'setup') {
      if (user.mfa_enabled) {
        return NextResponse.json({ error: '2FA is already enabled' }, { status: 400 });
      }
      const secret = generateTotpSecret();
      await getPool().query('UPDATE users SET mfa_secret = $2 WHERE id = $1', [auth.userId, secret]);
      const otpauthUrl = buildOtpAuthUrl(user.email, secret, 'Tau ID');
      return NextResponse.json({ success: true, secret, otpauthUrl });
    }

    const code = String(body.code || '').trim();
    if (!code) {
      return NextResponse.json({ error: 'Verification code required' }, { status: 400 });
    }
    if (!user.mfa_secret) {
      return NextResponse.json({ error: 'Run 2FA setup first' }, { status: 400 });
    }
    if (!verifyTotpCode(code, user.mfa_secret)) {
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 401 });
    }

    if (action === 'enable') {
      await getPool().query('UPDATE users SET mfa_enabled = true WHERE id = $1', [auth.userId]);
      return NextResponse.json({ success: true, enabled: true });
    }

    if (action === 'disable') {
      await getPool().query(
        'UPDATE users SET mfa_enabled = false, mfa_secret = NULL WHERE id = $1',
        [auth.userId]
      );
      return NextResponse.json({ success: true, enabled: false });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: '2FA request failed' }, { status: 500 });
  }
}
