import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import {
  listConversations,
  createDirectConversation,
  createGroupConversation,
  findUserByEmailOrUsername,
} from '@/lib/tautalk-data';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const conversations = await listConversations(auth.userId);
    return NextResponse.json({ success: true, conversations });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load conversations' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    if (body.type === 'group') {
      if (!body.title || !body.memberIds?.length) {
        return NextResponse.json({ error: 'title and memberIds required' }, { status: 400 });
      }
      const conv = await createGroupConversation(auth.userId, body.title, body.memberIds);
      return NextResponse.json({ success: true, conversation: conv });
    }

    const query = body.email || body.username || body.query;
    if (!query) {
      return NextResponse.json({ error: 'Recipient email or username required' }, { status: 400 });
    }

    const target = await findUserByEmailOrUsername(query);
    if (!target) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const conv = await createDirectConversation(auth.userId, target.id);
    return NextResponse.json({
      success: true,
      conversation: { ...conv, peer: target },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create conversation';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
