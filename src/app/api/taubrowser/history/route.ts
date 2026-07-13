import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import {
  listHistory,
  addHistoryEntry,
  clearHistory,
} from '@/lib/taubrowser-data';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get('limit') ?? 100);
    const history = await listHistory(auth.userId, limit);
    return NextResponse.json({ success: true, history });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load history' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    if (!body.url) {
      return NextResponse.json({ error: 'url required' }, { status: 400 });
    }
    const entry = await addHistoryEntry(auth.userId, body);
    return NextResponse.json({ success: true, entry });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save history' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await clearHistory(auth.userId);
    return NextResponse.json({ success: true, cleared: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to clear history' }, { status: 500 });
  }
}
