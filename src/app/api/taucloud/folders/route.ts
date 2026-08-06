import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { createUserFolder, listUserFolders } from '@/lib/taucloud-files';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const folders = await listUserFolders(auth.userId);
    return NextResponse.json({ success: true, folders });
  } catch (error) {
    console.error('TauCloud folders list:', error);
    return NextResponse.json({ error: 'Failed to load folders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const body = await request.json();
    const name = String(body.name || '').trim();
    if (!name) {
      return NextResponse.json({ error: 'Folder name required' }, { status: 400 });
    }

    const folder = await createUserFolder(auth.userId, name);
    return NextResponse.json({ success: true, folder });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Folder creation failed';
    const status = message.includes('Invalid') ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
