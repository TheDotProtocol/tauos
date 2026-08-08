/**
 * TauAIClient — public integration boundary for Tau applications.
 *
 * Applications (TauMail, Tau IDE, future Grayscale via ATHENA) consume Tau AI
 * through this interface. They must not depend on model providers directly.
 *
 *   Application → TauAIClient → Tau AI Core → Model Abstraction
 *
 * Grayscale-specific logic stays outside packages/tau-ai/.
 */

import type {
  FinishReason,
  IntelligenceOptions,
  TauAIAppId,
  TauAIThreadId,
  TauAIUserId,
} from '../types';
import type { ChatMessage, TokenUsage } from '../types/messages';

export type TauAIClientConfig = {
  appId: TauAIAppId;
  userId?: TauAIUserId;
  defaultThreadId?: TauAIThreadId;
};

export type TauAIChatParams = {
  messages: ChatMessage[];
  threadId?: TauAIThreadId;
  userId?: TauAIUserId;
  options?: IntelligenceOptions;
};

export type TauAIChatResult = {
  message: string;
  model: string;
  usage?: TokenUsage;
  finishReason?: FinishReason;
};

export type TauAIStreamChunk = {
  delta: string;
  done: boolean;
  model: string;
  usage?: TokenUsage;
  finishReason?: FinishReason;
};

/**
 * Public Tau AI client contract. HTTP/SDK implementations arrive in AI-8.
 */
export interface TauAIClient {
  readonly appId: TauAIAppId;

  chat(params: TauAIChatParams): Promise<TauAIChatResult>;
  stream?(params: TauAIChatParams): AsyncGenerator<TauAIStreamChunk>;
}

export type TauAIClientFactory = (
  config: TauAIClientConfig,
) => TauAIClient;
