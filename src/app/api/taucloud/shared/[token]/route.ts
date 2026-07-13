import { NextRequest, NextResponse } from 'next/server';
import { getSharedFile, getSharedDownloadUrl } from '@/lib/taucloud-files';

export const dynamic = 'force-dynamic';

type RouteParams = { params: { token: string } };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const row = await getSharedFile(params.token);
    return NextResponse.json({
      success: true,
      file: {
        id: row.id,
        original_name: row.original_name,
        file_size: row.file_size,
        mime_type: row.mime_type,
        uploaded_at: row.uploaded_at,
      },
      share: {
        token: row.token,
        expires_at: row.expires_at,
        download_count: row.download_count,
        password_required: Boolean(row.password_hash),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Not found';
    return NextResponse.json({ error: message }, { status: 404 });
  }
}

export async function POST(_request: NextRequest, { params }: RouteParams) {
  try {
    const download = await getSharedDownloadUrl(params.token);
    return NextResponse.json({ success: true, ...download });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Download failed';
    return NextResponse.json({ error: message }, { status: 404 });
  }
}
