/**
 * Gateway-backed TauAIClient — internal integration path (AI-2).
 * NOT wired to public API routes yet (cutover in AI-8).
 */

import type {
  TauAIClient,
  TauAIClientConfig,
  TauAIChatParams,
  TauAIChatResult,
  TauAIStreamChunk,
  IntelligenceService,
} from '@tau/ai';
import { createGatewayIntelligenceService } from './intelligence-service';

export class GatewayTauAIClient implements TauAIClient {
  readonly appId: TauAIClientConfig['appId'];

  constructor(
    config: TauAIClientConfig,
    private readonly intelligence: IntelligenceService = createGatewayIntelligenceService(),
  ) {
    this.appId = config.appId;
    this.config = config;
  }

  private readonly config: TauAIClientConfig;

  async chat(params: TauAIChatParams): Promise<TauAIChatResult> {
    const result = await this.intelligence.chat({
      messages: params.messages,
      threadId: params.threadId,
      userId: params.userId ?? this.config.userId,
      appId: this.appId,
      options: params.options,
    });
    return {
      message: result.message,
      model: result.model,
      usage: result.usage,
      finishReason: result.finishReason,
    };
  }

  async *stream(params: TauAIChatParams): AsyncGenerator<TauAIStreamChunk> {
    const stream = this.intelligence.stream;
    if (!stream) {
      const result = await this.chat(params);
      yield { delta: result.message, done: true, model: result.model, usage: result.usage };
      return;
    }
    for await (const chunk of stream({
      messages: params.messages,
      threadId: params.threadId,
      userId: params.userId ?? this.config.userId,
      appId: this.appId,
      options: params.options,
    })) {
      yield {
        delta: chunk.delta,
        done: chunk.done,
        model: chunk.model,
        usage: chunk.usage,
        finishReason: chunk.finishReason,
      };
    }
  }
}

export function createGatewayTauAIClient(
  config: TauAIClientConfig,
  intelligence?: IntelligenceService,
): TauAIClient {
  return new GatewayTauAIClient(config, intelligence);
}
