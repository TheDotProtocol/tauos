import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

const STATE_COOKIE = 'tau_oauth_state';
const STATE_TTL_SEC = 10 * 60;

function oauthSecret(): string {
  return process.env.TAU_JWT_SECRET || process.env.JWT_SECRET || 'tau-oauth-dev-only';
}

export function signOAuthState(payload: { provider: string; redirect: string; ts: number }): string {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', oauthSecret()).update(data).digest('base64url');
  return `${data}.${sig}`;
}

export function verifyOAuthState(state: string): { provider: string; redirect: string; ts: number } | null {
  const [data, sig] = state.split('.');
  if (!data || !sig) return null;
  const expected = crypto.createHmac('sha256', oauthSecret()).update(data).digest('base64url');
  if (sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
    return null;
  }
  try {
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf8')) as {
      provider: string;
      redirect: string;
      ts: number;
    };
    if (Date.now() - payload.ts > STATE_TTL_SEC * 1000) return null;
    return payload;
  } catch {
    return null;
  }
}

export function setOAuthStateCookie(response: NextResponse, state: string): void {
  const secure = process.env.NODE_ENV === 'production';
  response.cookies.set(STATE_COOKIE, state, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: STATE_TTL_SEC,
  });
}

export function readOAuthStateCookie(request: NextRequest): string | null {
  return request.cookies.get(STATE_COOKIE)?.value ?? null;
}

export function clearOAuthStateCookie(response: NextResponse): void {
  response.cookies.set(STATE_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 });
}
