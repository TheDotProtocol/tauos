import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { getPool } from '@/lib/db-pool';
import { userInConversation } from '@/lib/tautalk-data';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const conversationId = request.nextUrl.searchParams.get('conversationId');
    if (!conversationId) {
      return NextResponse.json({ error: 'conversationId required' }, { status: 400 });
    }
    const allowed = await userInConversation(auth.userId, conversationId);
    if (!allowed) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const result = await getPool().query(
      `SELECT u.id, u.username, u.full_name, t.updated_at
       FROM tautalk_typing t
       JOIN users u ON u.id = t.user_id
       WHERE t.conversation_id = $1
         AND t.user_id <> $2
         AND t.updated_at > NOW() - INTERVAL '8 seconds'`,
      [conversationId, auth.userId]
    );

    return NextResponse.json({ success: true, typing: result.rows });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load typing' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { conversationId } = await request.json();
    if (!conversationId) {
      return NextResponse.json({ error: 'conversationId required' }, { status: 400 });
    }
    const allowed = await userInConversation(auth.userId, conversationId);
    if (!allowed) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    await getPool().query(
      `INSERT INTO tautalk_typing (conversation_id, user_id, updated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (conversation_id, user_id)
       DO UPDATE SET updated_at = NOW()`,
      [conversationId, auth.userId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update typing' }, { status: 500 });
  }
}
