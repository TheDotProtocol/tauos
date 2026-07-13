import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { listMessages, sendMessage } from '@/lib/tautalk-data';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');
    if (!conversationId) {
      return NextResponse.json({ error: 'conversationId required' }, { status: 400 });
    }

    const since = searchParams.get('since') ?? undefined;
    const messages = await listMessages(auth.userId, conversationId, since);
    return NextResponse.json({ success: true, messages });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load messages';
    const status = message.includes('not found') ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { conversationId, contentEncrypted, contentType, replyTo } = await request.json();
    if (!conversationId || !contentEncrypted) {
      return NextResponse.json({ error: 'conversationId and contentEncrypted required' }, { status: 400 });
    }

    const message = await sendMessage(
      auth.userId,
      conversationId,
      contentEncrypted,
      contentType,
      replyTo
    );
    return NextResponse.json({ success: true, message });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Send failed';
    const status = message.includes('not found') ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
