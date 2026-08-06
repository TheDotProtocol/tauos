import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { getFilePreviewUrl } from '@/lib/taucloud-files';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const fileId = request.nextUrl.searchParams.get('id');
    if (!fileId) {
      return NextResponse.json({ error: 'File id required' }, { status: 400 });
    }

    const { url, file } = await getFilePreviewUrl(auth.userId, fileId);
    return NextResponse.json({
      success: true,
      file: {
        id: file.id,
        original_name: file.original_name,
        file_size: file.file_size,
        mime_type: file.mime_type,
        folder: file.folder,
        uploaded_at: file.uploaded_at,
        is_shared: file.is_shared,
        is_starred: file.is_starred,
        deleted_at: file.deleted_at,
      },
      previewUrl: url,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load file';
    const status = message.includes('not found') ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
