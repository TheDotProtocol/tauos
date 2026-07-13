import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { getSettings, getPrivacyStats, ensureBrowserProfile } from '@/lib/taubrowser-data';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await ensureBrowserProfile(auth.userId);
    const [settings, privacy] = await Promise.all([
      getSettings(auth.userId),
      getPrivacyStats(auth.userId),
    ]);
    return NextResponse.json({
      success: true,
      user: {
        id: auth.userId,
        email: auth.email,
        username: auth.username,
        fullName: auth.fullName,
      },
      settings,
      privacy,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load profile' }, { status: 500 });
  }
}
