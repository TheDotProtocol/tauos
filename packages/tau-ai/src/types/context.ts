/**
 * Shared request/response context for Tau AI core contracts.
 */

import type { ChatMessage, FinishReason, TokenUsage } from './messages';

/** Opaque substrate identifier — not a provider name exposed to applications. */
export type SubstrateId = string;

/** Opaque model identifier within a substrate. */
export type ModelId = string;

export type TauAIAppId = string;
export type TauAIUserId = string;
export type TauAIThreadId = string;

export type IntelligenceOptions = {
  model?: ModelId;
  substrate?: SubstrateId | 'auto';
  temperature?: number;
  maxTokens?: number;
  privacyMode?: boolean;
  stream?: boolean;
  agent?: string;
};

export type IntelligenceRequest = {
  messages: ChatMessage[];
  threadId?: TauAIThreadId;
  userId?: TauAIUserId;
  appId?: TauAIAppId;
  options?: IntelligenceOptions;
};

export type IntelligenceResponse = {
  message: string;
  substrateId: SubstrateId;
  model: ModelId;
  usage?: TokenUsage;
  finishReason?: FinishReason;
};

export type IntelligenceStreamChunk = {
  delta: string;
  done: boolean;
  substrateId: SubstrateId;
  model: ModelId;
  usage?: TokenUsage;
  finishReason?: FinishReason;
};
