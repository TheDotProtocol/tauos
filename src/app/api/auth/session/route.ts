import { NextRequest, NextResponse } from 'next/server';
import { verifyTauToken } from '@/lib/tau-auth';
import { getBearerToken } from '@/lib/auth-server';
import { getPool } from '@/lib/db-pool';

export async function GET(request: NextRequest) {
  const token = getBearerToken(request);
  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }

  const payload = verifyTauToken(token);
  if (!payload?.userId) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }

  const result = await getPool().query(
    'SELECT id, username, email, full_name, is_active, last_login FROM users WHERE id = $1',
    [payload.userId]
  );

  if (result.rows.length === 0) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const user = result.rows[0];
  if (!user.is_active) {
    return NextResponse.json({ error: 'Account deactivated' }, { status: 403 });
  }

  return NextResponse.json({
    authenticated: true,
    sso: Boolean(payload.sso),
    app: payload.app ?? 'unknown',
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.full_name,
      lastLogin: user.last_login,
    },
  });
}
