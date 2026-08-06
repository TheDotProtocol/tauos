import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { getUserStorage, getUserStorageBreakdown } from '@/lib/taucloud-files';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const [storage, breakdown] = await Promise.all([
      getUserStorage(auth.userId),
      getUserStorageBreakdown(auth.userId),
    ]);

    return NextResponse.json({ success: true, storage, breakdown });
  } catch (error) {
    console.error('TauCloud storage breakdown:', error);
    return NextResponse.json({ error: 'Failed to load storage stats' }, { status: 500 });
  }
}
