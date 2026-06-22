import { getPool, getJwtSecret } from '@/lib/db-pool';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export async function verifyTauMailToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return { error: 'No token provided', status: 401 as const };
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, getJwtSecret('taumail')) as { userId: string };
    return { userId: decoded.userId };
  } catch {
    return { error: 'Invalid token', status: 401 as const };
  }
}

export async function checkRateLimit(_userId: string): Promise<boolean> {
  return true;
}

export { getPool };
