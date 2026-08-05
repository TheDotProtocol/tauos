import { withTauMailAuth } from '@/lib/taumail/api-route';
import {
  deleteTauMailAvatar,
  getTauMailProfileRow,
  isAllowedAvatarImage,
  mapTauMailProfileAsync,
  uploadTauMailAvatar,
} from '@/lib/taumail/profile-server';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  return withTauMailAuth(request, async (userId) => {
    try {
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

      const result = await uploadTauMailAvatar(userId, file);
      const profile = await getTauMailProfileRow(userId);

      return NextResponse.json({
        success: true,
        avatarUrl: result.avatarUrl,
        profile: profile ? await mapTauMailProfileAsync(profile) : null,
      });
    } catch (error) {
      console.error('[taumail/profile/avatar]', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Upload failed' },
        { status: 500 },
      );
    }
  });
}

export async function DELETE(request: NextRequest) {
  return withTauMailAuth(request, async (userId) => {
    try {
      await deleteTauMailAvatar(userId);
      return NextResponse.json({ success: true });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to remove avatar' }, { status: 500 });
    }
  });
}
