import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { createProductFoundationClient } from '@/lib/tau-ai-app/foundation-service';

export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { messages, threadId, privacyMode, message } = body;

    const chatMessages =
      messages ??
      (message
        ? [{ role: 'user' as const, content: String(message) }]
        : null);

    if (!chatMessages?.length) {
      return NextResponse.json({ error: 'messages or message required' }, { status: 400 });
    }

    const client = createProductFoundationClient();
    const result = await client.chat({
      messages: chatMessages,
      threadId,
      userId: String(auth.userId),
      options: { privacyMode: Boolean(privacyMode) },
    });

    return NextResponse.json({
      success: true,
      message: result.message,
      model: result.model,
      substrateId: result.substrateId,
      capability: result.capability,
      usage: result.usage,
      finishReason: result.finishReason,
      shadow: result.shadowLog,
      userId: auth.userId,
      privacyMode: Boolean(privacyMode),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[tau-foundation/chat]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Foundation chat failed' },
      { status: 500 },
    );
  }
}
