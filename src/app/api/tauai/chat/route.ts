import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import { runAiChat } from '@/lib/ai-gateway';

export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    const body = await request.json();
    const { messages, model, provider, temperature, maxTokens, privacyMode, message } = body;

    const chatMessages =
      messages ??
      (message
        ? [{ role: 'user' as const, content: String(message) }]
        : null);

    if (!chatMessages?.length) {
      return NextResponse.json({ error: 'messages or message required' }, { status: 400 });
    }

    const result = await runAiChat({
      messages: chatMessages,
      model,
      provider,
      temperature,
      maxTokens,
      privacyMode,
    });

    return NextResponse.json({
      success: true,
      ...result,
      userId: auth?.userId ?? null,
      privacyMode: Boolean(privacyMode),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[tauai/chat]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Chat failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: '/api/tauai/chat',
    methods: ['POST'],
    providers: ['openai', 'anthropic', 'ollama', 'auto', 'fallback'],
  });
}
