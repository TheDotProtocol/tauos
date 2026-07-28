import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import {
  getConversationParticipants,
  userInConversation,
  getPublicKey,
} from '@/lib/tautalk-data';

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
    const participants = await getConversationParticipants(conversationId);
    const keys = await Promise.all(
      participants.map(async (p) => ({
        userId: p.id,
        username: p.username,
        fullName: p.full_name,
        publicKey: (await getPublicKey(p.id))?.public_key ?? null,
        lastReadAt: p.last_read_at,
      }))
    );
    return NextResponse.json({ success: true, participants: keys });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load keys' }, { status: 500 });
  }
}
