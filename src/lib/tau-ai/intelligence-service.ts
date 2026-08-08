/**
 * Gateway-backed IntelligenceService — delegates to existing runAiChat (AI-2).
 * Zero user-visible behaviour change; proves Tau AI layer sits above gateway.
 */

import type {
  IntelligenceService,
  IntelligenceRequest,
  IntelligenceResponse,
  IntelligenceStreamChunk,
  FinishReason,
} from '@tau/ai';
import type { ChatMessage, AiProviderId } from '@/lib/ai-gateway/types';
import { runAiChat, streamAiChat } from '@/lib/ai-gateway';

function toGatewayMessages(messages: IntelligenceRequest['messages']): ChatMessage[] {
  return messages
    .filter(
      (m): m is ChatMessage =>
        m.role === 'system' || m.role === 'user' || m.role === 'assistant',
    )
    .map((m) => ({ role: m.role, content: m.content }));
}

function mapFinishReason(reason?: string): FinishReason | undefined {
  if (!reason) return undefined;
  if (reason === 'stop' || reason === 'length' || reason === 'tool_calls' || reason === 'error' || reason === 'cancelled') {
    return reason;
  }
  return undefined;
}

function toGatewayRequest(request: IntelligenceRequest) {
  const substrate = request.options?.substrate;
  return {
    messages: toGatewayMessages(request.messages),
    model: request.options?.model,
    provider:
      substrate && substrate !== 'auto'
        ? (substrate as AiProviderId)
        : ('auto' as const),
    temperature: request.options?.temperature,
    maxTokens: request.options?.maxTokens,
    privacyMode: request.options?.privacyMode,
    agent: request.options?.agent,
  };
}

export class GatewayIntelligenceService implements IntelligenceService {
  async chat(request: IntelligenceRequest): Promise<IntelligenceResponse> {
    const result = await runAiChat(toGatewayRequest(request));
    return {
      message: result.message,
      substrateId: result.provider,
      model: result.model,
      usage: result.usage,
      finishReason: mapFinishReason(result.finishReason),
    };
  }

  async *stream(
    request: IntelligenceRequest,
  ): AsyncGenerator<IntelligenceStreamChunk> {
    for await (const chunk of streamAiChat(toGatewayRequest(request))) {
      yield {
        delta: chunk.delta,
        done: chunk.done,
        substrateId: chunk.provider,
        model: chunk.model,
        usage: chunk.usage,
      };
    }
  }
}

export function createGatewayIntelligenceService(): IntelligenceService {
  return new GatewayIntelligenceService();
}
