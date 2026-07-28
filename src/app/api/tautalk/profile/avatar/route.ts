import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { deleteTalkAvatar, getTalkProfile, uploadTalkAvatar } from '@/lib/tautalk-profile';

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
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Avatar must be an image' }, { status: 400 });
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Avatar must be under 5 MB' }, { status: 400 });
    }

    const result = await uploadTalkAvatar(auth.userId, file);
    const profile = await getTalkProfile(auth.userId);

    return NextResponse.json({
      success: true,
      avatarUrl: result.avatarUrl,
      path: result.path,
      profile: profile
        ? {
            id: profile.id,
            username: profile.username,
            email: profile.email,
            fullName: profile.full_name,
            phone: profile.phone,
            avatarUrl: profile.avatar_url,
          }
        : null,
    });
  } catch (error) {
    console.error('TauTalk avatar upload:', error);
    const message = error instanceof Error ? error.message : 'Upload failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await deleteTalkAvatar(auth.userId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to remove avatar' }, { status: 500 });
  }
}
