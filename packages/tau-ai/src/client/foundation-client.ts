/**
 * Tau Foundation client — composed shadow pipeline (AI-8).
 *
 * Primary orchestration boundary. Delegates to injected layers — not monolithic.
 */

import type {
  TauAIClient,
  TauAIClientConfig,
  TauAIChatParams,
  TauAIChatResult,
} from './tau-ai-client';
import type { TauFoundationPipeline } from '../foundation/pipeline';
import type { FoundationPipelineRequest, ShadowPipelineLogEntry } from '../foundation/types';
import type { IntelligenceService } from '../core/intelligence';

export type TauFoundationClientConfig = TauAIClientConfig & {
  /** When set, pipeline may delegate inference after routing (shadow-safe). */
  intelligence?: IntelligenceService;
};

export type TauFoundationChatResult = TauAIChatResult & {
  /** Shadow metadata — never includes private message content. */
  shadowLog?: ShadowPipelineLogEntry;
  substrateId?: string;
  capability?: string;
};

export class TauFoundationClient implements TauAIClient {
  readonly appId: TauAIClientConfig['appId'];

  constructor(
    config: TauFoundationClientConfig,
    private readonly pipeline: TauFoundationPipeline,
    private readonly intelligence?: IntelligenceService,
  ) {
    this.appId = config.appId;
    this.config = config;
  }

  private readonly config: TauFoundationClientConfig;

  async chat(params: TauAIChatParams): Promise<TauFoundationChatResult> {
    const pipelineRequest: FoundationPipelineRequest = {
      messages: params.messages,
      threadId: params.threadId,
      userId: params.userId ?? this.config.userId,
      appId: this.appId,
      options: params.options,
    };

    const result = await this.pipeline.process(pipelineRequest);

    if (!result.routing.success) {
      const failureSummary =
        'failureSummary' in result.routing ? result.routing.failureSummary : 'Routing failed.';
      return {
        message: failureSummary,
        model: 'none',
        shadowLog: result.shadow,
        substrateId: undefined,
        capability: result.capability,
      };
    }

    if (result.response) {
      return {
        message: result.response.message,
        model: result.response.model,
        usage: result.response.usage,
        finishReason: result.response.finishReason,
        shadowLog: result.shadow,
        substrateId: result.response.substrateId,
        capability: result.capability,
      };
    }

    if (this.intelligence) {
      const inf = await this.intelligence.chat(pipelineRequest);
      return {
        message: inf.message,
        model: inf.model,
        usage: inf.usage,
        finishReason: inf.finishReason,
        shadowLog: result.shadow,
        substrateId: inf.substrateId,
        capability: result.capability,
      };
    }

    return {
      message: `[shadow] routed to ${result.routing.substrateId}`,
      model: result.routing.modelId,
      shadowLog: result.shadow,
      substrateId: result.routing.substrateId,
      capability: result.capability,
    };
  }
}

export function createTauFoundationClient(
  config: TauFoundationClientConfig,
  pipeline: TauFoundationPipeline,
): TauFoundationClient {
  return new TauFoundationClient(config, pipeline, config.intelligence);
}
