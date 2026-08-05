import { verifyTauMailToken, getPool } from '@/app/api/taumail/middleware/security';
import { ensureTauMailSchema } from '@/lib/taumail/schema';
import { NextRequest, NextResponse } from 'next/server';

export async function withTauMailAuth(
  request: NextRequest,
  handler: (userId: string) => Promise<NextResponse>,
): Promise<NextResponse> {
  const auth = await verifyTauMailToken(request);
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const pool = getPool();
  try {
    await ensureTauMailSchema(pool);
  } catch (error) {
    console.error('[taumail] schema ensure failed (non-fatal):', error);
  }
  return handler(String(auth.userId));
}
