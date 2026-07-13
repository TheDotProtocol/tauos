import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { findUserByEmailOrUsername, upsertPublicKey, getPublicKey } from '@/lib/tautalk-data';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    if (q) {
      const user = await findUserByEmailOrUsername(q);
      if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      const key = await getPublicKey(user.id);
      return NextResponse.json({ success: true, user, key });
    }

    const key = await getPublicKey(auth.userId);
    return NextResponse.json({
      success: true,
      user: { id: auth.userId, email: auth.email, username: auth.username },
      key,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Profile failed' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { publicKey } = await request.json();
    if (!publicKey) {
      return NextResponse.json({ error: 'publicKey required' }, { status: 400 });
    }
    await upsertPublicKey(auth.userId, publicKey);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Key upload failed' }, { status: 500 });
  }
}
