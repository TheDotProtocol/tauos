import { NextRequest, NextResponse } from 'next/server';
import { ARCHITECT_SYSTEM_PROMPT } from '@/lib/tau-ide/architect-prompt';
import { runAiChat } from '@/lib/ai-gateway';

export async function POST(request: NextRequest) {
  try {
    const { messages, phase = 'gather' } = await request.json();

    if (!messages?.length) {
      return NextResponse.json({ error: 'messages required' }, { status: 400 });
    }

    const phaseHint =
      phase === 'gather'
        ? 'Focus on asking clarifying questions and understanding requirements.'
        : phase === 'design'
          ? 'Focus on PRD, architecture, database, API, and frontend/backend design.'
          : 'Focus on implementation plan and tauscript-project JSON output.';

    const chatMessages = [
      { role: 'system' as const, content: `${ARCHITECT_SYSTEM_PROMPT}\n\nCurrent phase: ${phase}. ${phaseHint}` },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    ];

    const result = await runAiChat({
      messages: chatMessages,
      provider: 'auto',
      maxTokens: 4096,
      privacyMode: true,
    });

    return NextResponse.json({
      message: result.message,
      provider: result.provider,
      model: result.model,
      phase,
    });
  } catch (error) {
    console.error('[tau-ide/architect]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Architect request failed' },
      { status: 500 }
    );
  }
}
