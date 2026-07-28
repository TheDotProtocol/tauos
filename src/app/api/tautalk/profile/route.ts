import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { getTalkProfile, updateTalkProfile } from '@/lib/tautalk-profile';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const profile = await getTalkProfile(auth.userId);
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      profile: {
        id: profile.id,
        username: profile.username,
        email: profile.email,
        fullName: profile.full_name,
        phone: profile.phone,
        avatarUrl: profile.avatar_url,
      },
    });
  } catch (error) {
    console.error('TauTalk profile GET:', error);
    return NextResponse.json({ error: 'Failed to load profile' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const username =
      typeof body.username === 'string'
        ? body.username.trim().replace(/^@/, '').toLowerCase()
        : undefined;
    const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : undefined;

    if (username && !/^[a-z0-9_-]{3,32}$/.test(username)) {
      return NextResponse.json(
        { error: 'Username must be 3–32 characters: letters, numbers, _ or -' },
        { status: 400 }
      );
    }

    const profile = await updateTalkProfile(auth.userId, { username, fullName });
    return NextResponse.json({
      success: true,
      profile: {
        id: profile.id,
        username: profile.username,
        email: profile.email,
        fullName: profile.full_name,
        phone: profile.phone,
        avatarUrl: profile.avatar_url,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Update failed';
    const status = message.includes('taken') ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
