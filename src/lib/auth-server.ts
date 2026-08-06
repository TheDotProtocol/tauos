import { NextRequest } from 'next/server';
import { verifyTauToken, type TauTokenPayload } from '@/lib/tau-auth';
import { ACCESS_COOKIE } from '@/lib/tau-session';

export function getBearerToken(request: NextRequest): string | null {
  const auth = request.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  return auth.slice(7).trim();
}

/** Access token from Authorization header or httpOnly session cookie. */
export function getAccessToken(request: NextRequest): string | null {
  return getBearerToken(request) ?? request.cookies.get(ACCESS_COOKIE)?.value ?? null;
}

export function requireAuth(request: NextRequest): TauTokenPayload | null {
  const token = getAccessToken(request);
  if (!token) return null;
  return verifyTauToken(token);
}
