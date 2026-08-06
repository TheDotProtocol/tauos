import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import {
  getConversationParticipants,
  userInConversation,
  getPublicKeysForUser,
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
      participants.map(async (p) => {
        try {
          const publicKeys = await getPublicKeysForUser(p.id);
          return {
            userId: String(p.id),
            username: p.username,
            fullName: p.full_name,
            publicKey: publicKeys[0] ?? null,
            publicKeys,
            lastReadAt: p.last_read_at,
          };
        } catch (err) {
          console.error('TauTalk keys participant error:', p.id, err);
          return {
            userId: String(p.id),
            username: p.username,
            fullName: p.full_name,
            publicKey: null,
            publicKeys: [] as string[],
            lastReadAt: p.last_read_at,
          };
        }
      })
    );
    return NextResponse.json({ success: true, participants: keys });
  } catch (error) {
    console.error('TauTalk keys route error:', error);
    const message = error instanceof Error ? error.message : 'Failed to load keys';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
