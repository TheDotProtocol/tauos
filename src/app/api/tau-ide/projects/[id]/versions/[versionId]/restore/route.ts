import { NextRequest, NextResponse } from 'next/server';
import { requireAuthUser, authErrorResponse } from '@/lib/tau-ide/server/auth';
import { restoreVersion } from '@/lib/tau-ide/server/memory';

type Ctx = { params: { id: string; versionId: string } };

export async function POST(request: NextRequest, { params }: Ctx) {
  try {
    requireAuthUser(request);
    const snapshot = await restoreVersion(params.id, params.versionId);
    return NextResponse.json({ success: true, snapshot });
  } catch (e) {
    return authErrorResponse(e) ?? NextResponse.json({ error: e instanceof Error ? e.message : 'Restore failed' }, { status: 500 });
  }
}
