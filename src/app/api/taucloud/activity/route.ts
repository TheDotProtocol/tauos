import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { listUserActivity } from '@/lib/taucloud-files';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const limit = Math.min(Number(request.nextUrl.searchParams.get('limit') || 50), 100);
    const activity = await listUserActivity(auth.userId, limit);
    return NextResponse.json({ success: true, activity });
  } catch (error) {
    console.error('TauCloud activity:', error);
    return NextResponse.json({ error: 'Failed to load activity' }, { status: 500 });
  }
}
