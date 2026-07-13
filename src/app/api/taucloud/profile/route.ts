import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { getUserStorage } from '@/lib/taucloud-files';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const storage = await getUserStorage(auth.userId);
    return NextResponse.json({
      success: true,
      storage,
      user: {
        id: auth.userId,
        email: auth.email,
        username: auth.username,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load profile' }, { status: 500 });
  }
}
