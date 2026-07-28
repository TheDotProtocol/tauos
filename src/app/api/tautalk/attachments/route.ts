import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { signedTalkFileUrl, uploadTalkFile } from '@/lib/tautalk-profile';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    if (file.size > 25 * 1024 * 1024) {
      return NextResponse.json({ error: 'File must be under 25 MB' }, { status: 400 });
    }

    const saved = await uploadTalkFile(auth.userId, file);
    const url = await signedTalkFileUrl(saved.path, 60 * 60 * 24 * 7);

    return NextResponse.json({
      success: true,
      attachment: { ...saved, url },
    });
  } catch (error) {
    console.error('TauTalk attachment upload:', error);
    const message = error instanceof Error ? error.message : 'Upload failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const path = request.nextUrl.searchParams.get('path');
    if (!path) {
      return NextResponse.json({ error: 'path required' }, { status: 400 });
    }

    const url = await signedTalkFileUrl(path, 3600);
    return NextResponse.json({ success: true, url });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to sign URL';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
