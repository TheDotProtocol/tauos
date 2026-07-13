import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { deleteUserFile } from '@/lib/taucloud-files';

export const dynamic = 'force-dynamic';

export async function DELETE(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('id');
    if (!fileId) {
      return NextResponse.json({ error: 'File id required' }, { status: 400 });
    }

    const deleted = await deleteUserFile(auth.userId, fileId);
    return NextResponse.json({ success: true, file: deleted });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Delete failed';
    const status = message.includes('not found') ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
