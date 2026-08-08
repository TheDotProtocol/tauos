/**
 * Model routing contract — substrate selection only (AI-1).
 *
 * Advanced routing (privacy → local, task-aware selection, cost/latency) is AI-3.
 */

import type { ModelId, SubstrateId, TauAIAppId, TauAIUserId } from '../types';
import type { ModelCapability } from '../models/substrate';

export type RoutingTaskKind =
  | 'chat'
  | 'completion'
  | 'embedding'
  | 'vision'
  | 'voice'
  | 'tool-planning';

export type RoutingContext = {
  userId?: TauAIUserId;
  appId?: TauAIAppId;
  taskKind?: RoutingTaskKind;
  privacyMode?: boolean;
  preferredSubstrate?: SubstrateId | 'auto';
  preferredModel?: ModelId;
  agent?: string;
  requiredCapabilities?: Array<keyof Pick<
    ModelCapability,
    'supportsStreaming' | 'supportsVision' | 'supportsEmbeddings'
  >>;
};

export type RoutingDecision = {
  substrateId: SubstrateId;
  modelId: ModelId;
  reason?: string;
  fallback?: boolean;
};

/**
 * Selects the appropriate intelligence substrate for a request.
 * Does not perform inference — delegates to ModelSubstrate implementations.
 */
export interface ModelRouter {
  select(context: RoutingContext): Promise<RoutingDecision>;
}
