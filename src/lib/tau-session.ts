import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db-pool';
import { issueSsoToken } from '@/lib/tau-auth';

export const ACCESS_COOKIE = 'tau_access';
export const REFRESH_COOKIE = 'tau_refresh';
const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function cookieOptions(maxAgeSec: number) {
  const secure = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: maxAgeSec,
  };
}

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

async function ensureSessionsTable() {
  await getPool().query(`
    CREATE TABLE IF NOT EXISTS tau_auth_sessions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token_hash TEXT NOT NULL UNIQUE,
      expires_at TIMESTAMPTZ NOT NULL,
      revoked_at TIMESTAMPTZ,
      user_agent TEXT,
      ip_address TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await getPool().query(`
    CREATE INDEX IF NOT EXISTS idx_tau_auth_sessions_user
    ON tau_auth_sessions (user_id, created_at DESC)
  `);
}

export function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

export function isNativeTauClient(request: NextRequest): boolean {
  const client = request.headers.get('x-tau-client');
  if (client === 'native') return true;
  const ua = request.headers.get('user-agent') || '';
  return /ReactNative|TauTalkMobile|TauIDMobile/i.test(ua);
}

export function setSessionCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string
): void {
  response.cookies.set(ACCESS_COOKIE, accessToken, cookieOptions(15 * 60));
  response.cookies.set(REFRESH_COOKIE, refreshToken, cookieOptions(7 * 24 * 60 * 60));
}

export function clearSessionCookies(response: NextResponse): void {
  response.cookies.set(ACCESS_COOKIE, '', { ...cookieOptions(0), maxAge: 0 });
  response.cookies.set(REFRESH_COOKIE, '', { ...cookieOptions(0), maxAge: 0 });
}

export async function revokeRefreshToken(refreshToken: string): Promise<void> {
  await ensureSessionsTable();
  const tokenHash = hashToken(refreshToken);
  await getPool().query(
    `UPDATE tau_auth_sessions SET revoked_at = NOW() WHERE token_hash = $1 AND revoked_at IS NULL`,
    [tokenHash]
  );
}

export async function revokeAllUserSessions(userId: string | number): Promise<void> {
  await ensureSessionsTable();
  await getPool().query(
    `UPDATE tau_auth_sessions SET revoked_at = NOW() WHERE user_id = $1 AND revoked_at IS NULL`,
    [userId]
  );
}

export async function rotateRefreshSession(
  refreshToken: string,
  request: NextRequest
): Promise<{ userId: string; accessToken: string; refreshToken: string } | null> {
  await ensureSessionsTable();
  const tokenHash = hashToken(refreshToken);

  const existing = await getPool().query(
    `SELECT id, user_id FROM tau_auth_sessions
     WHERE token_hash = $1 AND revoked_at IS NULL AND expires_at > NOW()`,
    [tokenHash]
  );

  if (existing.rows.length === 0) return null;

  const row = existing.rows[0];
  await getPool().query(`UPDATE tau_auth_sessions SET revoked_at = NOW() WHERE id = $1`, [row.id]);

  const userResult = await getPool().query(
    `SELECT id, email, username, full_name, is_active FROM users WHERE id = $1`,
    [row.user_id]
  );
  if (userResult.rows.length === 0 || !userResult.rows[0].is_active) return null;

  const user = userResult.rows[0];
  const accessToken = issueSsoToken({
    id: user.id,
    email: user.email,
    username: user.username,
    fullName: user.full_name,
  });

  const newRefresh = crypto.randomBytes(48).toString('base64url');
  const newHash = hashToken(newRefresh);
  const expiresAt = new Date(Date.now() + REFRESH_TTL_MS);

  await getPool().query(
    `INSERT INTO tau_auth_sessions (user_id, token_hash, expires_at, user_agent, ip_address)
     VALUES ($1, $2, $3, $4, $5)`,
    [
      user.id,
      newHash,
      expiresAt.toISOString(),
      request.headers.get('user-agent')?.slice(0, 512) ?? null,
      getClientIp(request),
    ]
  );

  return { userId: String(user.id), accessToken, refreshToken: newRefresh };
}

/** Build login/register JSON + httpOnly session cookies (SSO across all Tau apps). */
export async function attachAuthSession(
  request: NextRequest,
  user: {
    id: string | number;
    email: string;
    username: string;
    fullName?: string;
  },
  body: Record<string, unknown>,
  includeRefreshTokenInBody = isNativeTauClient(request)
): Promise<NextResponse> {
  const accessToken = issueSsoToken({
    id: user.id,
    email: user.email,
    username: user.username,
    fullName: user.fullName,
  });

  await ensureSessionsTable();
  const refreshToken = crypto.randomBytes(48).toString('base64url');
  const tokenHash = hashToken(refreshToken);
  const expiresAt = new Date(Date.now() + REFRESH_TTL_MS);

  await getPool().query(
    `INSERT INTO tau_auth_sessions (user_id, token_hash, expires_at, user_agent, ip_address)
     VALUES ($1, $2, $3, $4, $5)`,
    [
      user.id,
      tokenHash,
      expiresAt.toISOString(),
      request.headers.get('user-agent')?.slice(0, 512) ?? null,
      getClientIp(request),
    ]
  );

  const response = NextResponse.json({
    ...body,
    token: accessToken,
    sso: true,
    ...(includeRefreshTokenInBody ? { refreshToken } : {}),
  });
  setSessionCookies(response, accessToken, refreshToken);
  return response;
}
