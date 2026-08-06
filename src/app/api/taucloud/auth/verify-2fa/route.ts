import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getPool } from '@/lib/db-pool';
import { issueSsoToken } from '@/lib/tau-auth';
import { getSsoSecret } from '@/lib/tau-auth';
import { verifyTotpCode } from '@/lib/totp';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { mfaToken, code } = await request.json();
    if (!mfaToken || !code) {
      return NextResponse.json({ error: 'Token and code required' }, { status: 400 });
    }

    let payload: { userId: number; purpose?: string };
    try {
      payload = jwt.verify(mfaToken, getSsoSecret()) as { userId: number; purpose?: string };
    } catch {
      return NextResponse.json({ error: 'MFA session expired. Sign in again.' }, { status: 401 });
    }

    if (payload.purpose !== 'taucloud_mfa') {
      return NextResponse.json({ error: 'Invalid MFA token' }, { status: 401 });
    }

    const result = await getPool().query(
      `SELECT u.id, u.username, u.email, u.full_name, u.mfa_secret, u.mfa_enabled, u.is_active,
              o.name as organization_name, o.domain as organization_domain, u.organization_id
       FROM users u
       LEFT JOIN organizations o ON u.organization_id = o.id
       WHERE u.id = $1`,
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

    const token = issueSsoToken({
      id: user.id,
      email: user.email,
      username: user.username,
      fullName: user.full_name,
    });

    return NextResponse.json({
      message: 'Login successful',
      token,
      sso: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        organization: {
          id: user.organization_id,
          name: user.organization_name,
          domain: user.organization_domain,
        },
      },
    });
  } catch (error) {
    console.error('TauCloud 2FA verify:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
