import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { syncAll } from '@/lib/taubrowser-data';

export const dynamic = 'force-dynamic';

/** Full sync payload for native Tau Browser (bookmarks, history, settings, privacy). */
export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const data = await syncAll(auth.userId);
    return NextResponse.json({
      success: true,
      user: { id: auth.userId, email: auth.email, username: auth.username },
      ...data,
      syncedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('TauBrowser sync:', error);
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
  }
}
