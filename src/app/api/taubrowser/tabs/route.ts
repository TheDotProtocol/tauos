import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { createTab, deleteTab, listTabs, updateTab } from '@/lib/taubrowser-data';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const spaceId = request.nextUrl.searchParams.get('spaceId') ?? undefined;
    const tabs = await listTabs(auth.userId, spaceId);
    return NextResponse.json({ success: true, tabs });
  } catch (error) {
    console.error('TauBrowser tabs GET:', error);
    return NextResponse.json({ error: 'Failed to list tabs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    if (!body.space_id) {
      return NextResponse.json({ error: 'space_id required' }, { status: 400 });
    }
    const tab = await createTab(auth.userId, body);
    return NextResponse.json({ success: true, tab });
  } catch (error) {
    console.error('TauBrowser tabs POST:', error);
    return NextResponse.json({ error: 'Failed to create tab' }, { status: 500 });
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
    const tab = await updateTab(auth.userId, body.id, body);
    return NextResponse.json({ success: true, tab });
  } catch (error) {
    console.error('TauBrowser tabs PUT:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update tab' },
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
    await deleteTab(auth.userId, id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('TauBrowser tabs DELETE:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete tab' },
      { status: 500 }
    );
  }
}
