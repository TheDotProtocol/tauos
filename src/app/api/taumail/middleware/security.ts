import { verifyTauToken } from '@/lib/tau-auth';
import { getAccessToken } from '@/lib/auth-server';
import { NextRequest } from 'next/server';

/** Unified Tau SSO token verification — works for all apps (Mail, Cloud, Talk, etc.). */
export async function verifyTauMailToken(request: NextRequest) {
  const token = getAccessToken(request);
  if (!token) {
    return { error: 'No token provided', status: 401 as const };
  }

  const decoded = verifyTauToken(token);
  if (!decoded?.userId) {
    return { error: 'Invalid or expired token', status: 401 as const };
  }

  return { userId: decoded.userId };
}

export { getPool } from '@/lib/db-pool';
