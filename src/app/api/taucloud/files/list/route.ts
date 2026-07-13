import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { listUserFiles } from '@/lib/taucloud-files';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder') || 'root';
    const files = await listUserFiles(auth.userId, folder);

    return NextResponse.json({ success: true, files });
  } catch (error) {
    console.error('TauCloud List Files Error:', error);
    return NextResponse.json({ error: 'Failed to list files' }, { status: 500 });
  }
}
