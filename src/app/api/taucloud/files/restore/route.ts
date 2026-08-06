import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { restoreUserFile } from '@/lib/taucloud-files';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const body = await request.json();
    const fileId = body.fileId || body.id;
    if (!fileId) {
      return NextResponse.json({ error: 'File id required' }, { status: 400 });
    }

    const restored = await restoreUserFile(auth.userId, fileId);
    return NextResponse.json({ success: true, file: restored });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Restore failed';
    const status = message.includes('not found') ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
