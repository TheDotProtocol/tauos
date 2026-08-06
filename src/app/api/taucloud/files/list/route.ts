import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import {
  listRecentFiles,
  listSharedFiles,
  listStarredFiles,
  listTrashFiles,
  listUserFiles,
} from '@/lib/taucloud-files';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const view = searchParams.get('view');
    const folder = searchParams.get('folder') || 'root';

    let files;
    switch (view) {
      case 'recent':
        files = await listRecentFiles(auth.userId);
        break;
      case 'starred':
        files = await listStarredFiles(auth.userId);
        break;
      case 'shared':
        files = await listSharedFiles(auth.userId);
        break;
      case 'trash':
        files = await listTrashFiles(auth.userId);
        break;
      default:
        files = await listUserFiles(auth.userId, folder);
    }

    return NextResponse.json({ success: true, files, view: view || 'files' });
  } catch (error) {
    console.error('TauCloud List Files Error:', error);
    return NextResponse.json({ error: 'Failed to list files' }, { status: 500 });
  }
}
