import { withTauMailAuth } from '@/lib/taumail/api-route';
import { deleteTauMailAvatar, getTauMailProfileRow, uploadTauMailAvatar } from '@/lib/taumail/profile-server';
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
      if (!file.type.startsWith('image/')) {
        return NextResponse.json({ error: 'Avatar must be an image' }, { status: 400 });
      }
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: 'Avatar must be under 5 MB' }, { status: 400 });
      }

      const result = await uploadTauMailAvatar(userId, file);
      const profile = await getTauMailProfileRow(userId);

      return NextResponse.json({
        success: true,
        avatarUrl: result.avatarUrl,
        profile: profile
          ? {
              fullName: profile.full_name || '',
              displayName: profile.display_name || profile.username || '',
              email: profile.email || '',
              avatarUrl: profile.avatar_url,
            }
          : null,
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
