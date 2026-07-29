import { NextRequest, NextResponse } from 'next/server';
import { runAiChat, streamAiChat } from '@/lib/ai-gateway';
import { getPhasePrompt, type ArchitectPhaseId } from '@/lib/tau-ide/architect/phases';
import { buildOrchestratorPrompt, getAgentsForPhase, type AgentRole } from '@/lib/tau-ide/architect/agents';
import { buildMemoryContext, type ProjectMemory } from '@/lib/tau-ide/architect/memory';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      messages,
      phase = 'discovery',
      mode = 'beginner',
      memory,
      provider,
      model,
      stream = false,
    } = body as {
      messages: { role: string; content: string }[];
      phase?: ArchitectPhaseId;
      mode?: 'beginner' | 'professional';
      memory?: ProjectMemory;
      provider?: string;
      model?: string;
      stream?: boolean;
    };

    if (!messages?.length) {
      return NextResponse.json({ error: 'messages required' }, { status: 400 });
    }

    const phaseAgents = getAgentsForPhase(phase).map((a) => a.role);
    const orchestrator = buildOrchestratorPrompt(phase, phaseAgents as AgentRole[]);
    const phasePrompt = getPhasePrompt(phase, mode);
    const memoryContext = memory ? buildMemoryContext(memory) : '';

    const systemContent = `${orchestrator}\n\n${phasePrompt}${memoryContext}`;

    const chatMessages = [
      { role: 'system' as const, content: systemContent },
      ...messages.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    ];

    if (stream) {
      const encoder = new TextEncoder();
      const streamResponse = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of streamAiChat({
              messages: chatMessages,
              provider: provider as never,
              model,
              maxTokens: 8192,
              privacyMode: true,
              stream: true,
              agent: `architect-${phase}`,
            })) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`));
              if (chunk.done) break;
            }
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          } catch (e) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: e instanceof Error ? e.message : 'Stream failed', done: true })}\n\n`));
          }
          controller.close();
        },
      });

      return new Response(streamResponse, {
        headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' },
      });
    }

    const result = await runAiChat({
      messages: chatMessages,
      provider: (provider as never) || 'auto',
      model,
      maxTokens: 8192,
      privacyMode: true,
      agent: `architect-${phase}`,
    });

    return NextResponse.json({
      message: result.message,
      provider: result.provider,
      model: result.model,
      phase,
      usage: result.usage,
      agents: phaseAgents,
    });
  } catch (error) {
    console.error('[tau-ide/architect]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Architect request failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: '/api/tau-ide/architect',
    phases: ['discovery', 'product', 'architecture', 'generation', 'review', 'implementation', 'validation', 'deployment'],
    modes: ['beginner', 'professional'],
    streaming: true,
  });
}
