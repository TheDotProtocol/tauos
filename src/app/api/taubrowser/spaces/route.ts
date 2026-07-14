import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import {
  createSpace,
  deleteSpace,
  listSpaces,
  updateSpace,
} from '@/lib/taubrowser-data';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const spaces = await listSpaces(auth.userId);
    return NextResponse.json({ success: true, spaces });
  } catch (error) {
    console.error('TauBrowser spaces GET:', error);
    return NextResponse.json({ error: 'Failed to list spaces' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    if (!body.name) {
      return NextResponse.json({ error: 'name required' }, { status: 400 });
    }
    const space = await createSpace(auth.userId, body);
    return NextResponse.json({ success: true, space });
  } catch (error) {
    console.error('TauBrowser spaces POST:', error);
    return NextResponse.json({ error: 'Failed to create space' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: 'id required' }, { status: 400 });
    }
    const space = await updateSpace(auth.userId, body.id, body);
    return NextResponse.json({ success: true, space });
  } catch (error) {
    console.error('TauBrowser spaces PUT:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update space' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'id required' }, { status: 400 });
    }
    await deleteSpace(auth.userId, id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('TauBrowser spaces DELETE:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete space' },
      { status: 500 }
    );
  }
}
