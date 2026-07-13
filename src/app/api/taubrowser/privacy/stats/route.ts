import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { getPrivacyStats, incrementPrivacyStats } from '@/lib/taubrowser-data';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const privacy = await getPrivacyStats(auth.userId);
    return NextResponse.json({ success: true, privacy });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load privacy stats' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const delta = await request.json();
    const privacy = await incrementPrivacyStats(auth.userId, delta);
    return NextResponse.json({ success: true, privacy });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update privacy stats' }, { status: 500 });
  }
}
