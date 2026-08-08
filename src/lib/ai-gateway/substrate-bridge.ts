/**
 * Bridges existing AiProviderAdapter implementations to @tau/ai ModelSubstrate.
 * Reuses provider logic without rewriting inference code.
 */

import type {
  ModelSubstrate,
  SubstrateKind,
  SubstrateMetadata,
  CompletionRequest,
  CompletionResponse,
  CompletionStreamChunk,
  SubstrateHealth,
  ModelCapability,
  AvailabilityState,
} from '@tau/ai';
import { resolveAvailability } from '@tau/ai';
import type { FinishReason } from '@tau/ai';
import type { AiProviderAdapter, ChatMessage as GatewayChatMessage } from './types';

export type SubstrateMeta = {
  kind: SubstrateKind;
  label: string;
  metadata: SubstrateMetadata;
};

function toGatewayMessages(messages: CompletionRequest['messages']): GatewayChatMessage[] {
  return messages
    .filter(
      (m): m is GatewayChatMessage =>
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

export function toModelSubstrate(adapter: AiProviderAdapter, meta: SubstrateMeta): ModelSubstrate {
  const substrate: ModelSubstrate = {
    id: adapter.id,
    kind: meta.kind,
    label: meta.label,
    metadata: meta.metadata,
    isConfigured: () => adapter.isConfigured(),
    getAvailability: (): AvailabilityState =>
      resolveAvailability(meta.metadata, adapter.isConfigured()),
    listCapabilities: (): ModelCapability[] =>
      adapter.listModels().map((m) => ({
        id: m.id,
        label: m.label,
        available: m.available,
        contextWindow: m.contextWindow,
        supportsStreaming: m.supportsStreaming,
        supportsVision: m.supportsVision,
      })),
    async complete(request: CompletionRequest): Promise<CompletionResponse> {
      const result = await adapter.chat(toGatewayMessages(request.messages), {
        model: request.model,
        maxTokens: request.maxTokens,
        temperature: request.temperature,
      });
      return {
        message: result.message,
        model: result.model,
        usage: result.usage,
        finishReason: mapFinishReason(result.finishReason),
      };
    },
  };

  if (adapter.stream) {
    substrate.stream = async function* (
      request: CompletionRequest,
    ): AsyncGenerator<CompletionStreamChunk> {
      for await (const chunk of adapter.stream!(
        toGatewayMessages(request.messages),
        {
          model: request.model,
          maxTokens: request.maxTokens,
          temperature: request.temperature,
        },
      )) {
        yield {
          delta: chunk.delta,
          done: chunk.done,
          model: chunk.model,
          usage: chunk.usage,
        };
      }
    };
  }

  if (adapter.healthCheck) {
    substrate.healthCheck = async (): Promise<SubstrateHealth> => {
      const health = await adapter.healthCheck!();
      return {
        substrateId: health.id,
        available: health.available,
        latencyMs: health.latencyMs,
        error: health.error,
        lastChecked: health.lastChecked,
      };
    };
  }

  return substrate;
}
