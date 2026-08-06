import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import {
  deleteContactLabel,
  getContactLabel,
  upsertContactLabel,
} from '@/lib/tautalk-data';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const contactUserId = request.nextUrl.searchParams.get('contactUserId');
    if (!contactUserId) {
      return NextResponse.json({ error: 'contactUserId required' }, { status: 400 });
    }
    const label = await getContactLabel(auth.userId, contactUserId);
    return NextResponse.json({ success: true, label });
  } catch (error) {
    console.error('TauTalk contact label GET:', error);
    return NextResponse.json({ error: 'Failed to load contact label' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { contactUserId, displayName } = await request.json();
    if (!contactUserId || !displayName?.trim()) {
      return NextResponse.json({ error: 'contactUserId and displayName required' }, { status: 400 });
    }
    await upsertContactLabel(auth.userId, contactUserId, displayName);
    return NextResponse.json({ success: true, label: displayName.trim() });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to save contact label';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const contactUserId = request.nextUrl.searchParams.get('contactUserId');
    if (!contactUserId) {
      return NextResponse.json({ error: 'contactUserId required' }, { status: 400 });
    }
    await deleteContactLabel(auth.userId, contactUserId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to remove contact label' }, { status: 500 });
  }
}
