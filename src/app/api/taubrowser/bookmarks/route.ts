import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import {
  listBookmarks,
  addBookmark,
  deleteBookmark,
} from '@/lib/taubrowser-data';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const bookmarks = await listBookmarks(auth.userId);
    return NextResponse.json({ success: true, bookmarks });
  } catch (error) {
    console.error('TauBrowser bookmarks list:', error);
    return NextResponse.json({ error: 'Failed to load bookmarks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    if (!body.title || !body.url) {
      return NextResponse.json({ error: 'title and url required' }, { status: 400 });
    }
    const bookmark = await addBookmark(auth.userId, body);
    return NextResponse.json({ success: true, bookmark });
  } catch (error) {
    console.error('TauBrowser bookmark add:', error);
    return NextResponse.json({ error: 'Failed to add bookmark' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'id required' }, { status: 400 });
    }
    await deleteBookmark(auth.userId, id);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Delete failed';
    return NextResponse.json({ error: message }, { status: 404 });
  }
}
