import { NextRequest } from 'next/server';
import { verifyTauToken, type TauTokenPayload } from '@/lib/tau-auth';

export function getBearerToken(request: NextRequest): string | null {
  const auth = request.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  return auth.slice(7).trim();
}

export function requireAuth(request: NextRequest): TauTokenPayload | null {
  const token = getBearerToken(request);
  if (!token) return null;
  return verifyTauToken(token);
}
