import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db-pool';
import { verifyTauToken } from '@/lib/tau-auth';
import { getAccessToken } from '@/lib/auth-server';
import {
  clearSessionCookies,
  rotateRefreshSession,
  setSessionCookies,
  REFRESH_COOKIE,
  revokeRefreshToken,
} from '@/lib/tau-session';

export const dynamic = 'force-dynamic';

async function readRefreshToken(request: NextRequest): Promise<string | null> {
  const cookieToken = request.cookies.get(REFRESH_COOKIE)?.value;
  if (cookieToken) return cookieToken;

  const contentType = request.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) return null;

  try {
    const body = await request.json();
    if (body?.refreshToken && typeof body.refreshToken === 'string') {
      return body.refreshToken;
    }
  } catch {
    /* no JSON body */
  }
  return null;
}

export async function GET(request: NextRequest) {
  const token = getAccessToken(request);
  if (!token) {
    return NextResponse.json({ error: 'No session' }, { status: 401 });
  }

  const payload = verifyTauToken(token);
  if (!payload?.userId) {
    return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 });
  }

  const result = await getPool().query(
    'SELECT id, username, email, full_name, is_active, last_login_at FROM users WHERE id = $1',
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
    app: payload.app ?? 'tauid',
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.full_name,
      lastLogin: user.last_login_at,
    },
  });
}

export async function POST(request: NextRequest) {
  const refreshToken = await readRefreshToken(request);
  if (!refreshToken) {
    return NextResponse.json({ error: 'No refresh session' }, { status: 401 });
  }

  const rotated = await rotateRefreshSession(refreshToken, request);
  if (!rotated) {
    const res = NextResponse.json({ error: 'Session expired. Sign in again.' }, { status: 401 });
    clearSessionCookies(res);
    return res;
  }

  const userResult = await getPool().query(
    'SELECT id, username, email, full_name FROM users WHERE id = $1',
    [rotated.userId]
  );
  const user = userResult.rows[0];

  const res = NextResponse.json({
    success: true,
    token: rotated.accessToken,
    refreshToken: rotated.refreshToken,
    sso: true,
    user: user
      ? {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.full_name,
        }
      : undefined,
  });
  setSessionCookies(res, rotated.accessToken, rotated.refreshToken);
  return res;
}

export async function DELETE(request: NextRequest) {
  const refreshToken = await readRefreshToken(request);
  if (refreshToken) {
    await revokeRefreshToken(refreshToken);
  }
  const res = NextResponse.json({ success: true, message: 'Signed out' });
  clearSessionCookies(res);
  return res;
}
