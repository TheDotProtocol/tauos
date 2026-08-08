/**
 * Model / intelligence substrate abstraction.
 *
 * Substrates perform inference only. They do not own routing, constitution,
 * memory, or product prompts. Implementations may wrap Ollama, vLLM, remote
 * APIs, or the future Tau Foundation Model — without exposing provider names
 * to application code.
 */

import type { ChatMessage, FinishReason, TokenUsage } from '../types/messages';
import type { ModelId, SubstrateId } from '../types/context';
import type { SubstrateMetadata } from './metadata';
import type { AvailabilityState } from './metadata';

export type { InferenceRequirements } from '../hardware/requirements';
export { declareCapabilities, buildSubstrateMetadata, resolveAvailability, supportsCapability, getSupportedCapabilities } from './metadata-helpers';

export type SubstrateKind = 'local' | 'remote' | 'foundation';

export type ModelCapability = {
  id: ModelId;
  label: string;
  available: boolean;
  contextWindow?: number;
  supportsStreaming?: boolean;
  supportsVision?: boolean;
  supportsEmbeddings?: boolean;
};

export type SubstrateHealth = {
  substrateId: SubstrateId;
  available: boolean;
  latencyMs?: number;
  error?: string;
  lastChecked: string;
};

export type CompletionRequest = {
  messages: ChatMessage[];
  model: ModelId;
  maxTokens: number;
  temperature: number;
};

export type CompletionResponse = {
  message: string;
  model: ModelId;
  usage?: TokenUsage;
  finishReason?: FinishReason;
};

export type CompletionStreamChunk = {
  delta: string;
  done: boolean;
  model: ModelId;
  usage?: TokenUsage;
  finishReason?: FinishReason;
};

/**
 * Provider/substrate-agnostic inference contract.
 * Evolves from the existing ai-gateway `AiProviderAdapter` in AI-2.
 */
export interface ModelSubstrate {
  readonly id: SubstrateId;
  readonly kind: SubstrateKind;
  readonly label: string;
  /** Tau Foundation v0.1 — explicit capability and provenance metadata (AI-3.1). */
  readonly metadata: SubstrateMetadata;

  isConfigured(): boolean;
  /** Resolved runtime availability — distinct from declared metadata.availability. */
  getAvailability?(): AvailabilityState;
  listCapabilities(): ModelCapability[];
  complete(request: CompletionRequest): Promise<CompletionResponse>;
  stream?(
    request: CompletionRequest,
  ): AsyncGenerator<CompletionStreamChunk>;
  healthCheck?(): Promise<SubstrateHealth>;
}

export interface ModelSubstrateRegistry {
  register(substrate: ModelSubstrate): void;
  get(id: SubstrateId): ModelSubstrate | undefined;
  list(): ModelSubstrate[];
}
