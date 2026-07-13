import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { uploadUserFile } from '@/lib/taucloud-files';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'root';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const saved = await uploadUserFile(auth.userId, file, folder);

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      file: saved,
    });
  } catch (error) {
    console.error('TauCloud Upload Error:', error);
    const message = error instanceof Error ? error.message : 'Failed to upload file';
    const status = message.includes('quota') ? 413 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
