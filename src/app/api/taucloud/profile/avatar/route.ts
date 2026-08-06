import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import {
  deleteTauCloudAvatar,
  isAllowedAvatarImage,
  uploadTauCloudAvatar,
} from '@/lib/taucloud-profile';

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
    if (!isAllowedAvatarImage(file)) {
      return NextResponse.json({ error: 'Avatar must be a PNG, JPG, WEBP, or HEIC image' }, { status: 400 });
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Avatar must be under 5 MB' }, { status: 400 });
    }

    const result = await uploadTauCloudAvatar(auth.userId, file);
    return NextResponse.json({ success: true, avatarUrl: result.avatarUrl });
  } catch (error) {
    console.error('[taucloud/profile/avatar]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await deleteTauCloudAvatar(auth.userId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to remove avatar' }, { status: 500 });
  }
}
