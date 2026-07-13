import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { createShareLink } from '@/lib/taucloud-files';

export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const { fileId, expiresInHours } = await request.json();
    if (!fileId) {
      return NextResponse.json({ error: 'fileId required' }, { status: 400 });
    }

    const share = await createShareLink(auth.userId, fileId, expiresInHours ?? 168);
    return NextResponse.json({
      success: true,
      share: {
        ...share,
        fullUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.tauos.org'}${share.url}`,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Share failed';
    const status = message.includes('not found') ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
