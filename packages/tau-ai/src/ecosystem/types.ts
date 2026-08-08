/**
 * AI-11 — Ecosystem product integration contract (packages/tau-ai).
 *
 * Products consume Tau Foundation through TauAIClient / TauFoundationClient.
 * This module defines generic types only — no product-specific logic.
 */

import type { ChatMessage } from '../types/messages';
import type { IntelligenceOptions } from '../types/context';

/** Honest integration verification — do not claim live unless tested */
export type EcosystemIntegrationLevel =
  | 'CONTRACT_VERIFIED'
  | 'ADAPTER_VERIFIED'
  | 'INTEGRATION_VERIFIED'
  | 'LIVE_MODEL_VERIFIED'
  | 'END_TO_END_VERIFIED';

/** Readiness of a Tau product to consume Foundation */
export type EcosystemProductReadiness = 'READY' | 'PARTIALLY_READY' | 'NOT_READY';

/** Scoped memory — product memory must not leak into global Tau memory without governance */
export type EcosystemMemoryScope = {
  /** Product identifier — maps to memory productId / appId */
  productId: string;
  /** When true, memories stay product-scoped unless promoted via governed rules */
  isolated: boolean;
};

/** Product-provided context — intelligence remains in Foundation */
export type EcosystemProductContext = {
  appId: string;
  memoryScope: EcosystemMemoryScope;
  /** Optional system preamble — product UX/workflow context only */
  systemPreamble?: string;
  /** Tool names the product may request — execution still governed by AI-6/7 */
  allowedToolHints?: string[];
};

export type EcosystemChatRequest = {
  userId: string;
  messages: ChatMessage[];
  context: EcosystemProductContext;
  threadId?: string;
  options?: IntelligenceOptions;
};

export type EcosystemChatResult = {
  message: string;
  model: string;
  substrateId?: string;
  capability?: string;
  integrationLevel: EcosystemIntegrationLevel;
  integrationPath: 'foundation' | 'legacy';
  appId: string;
  timestamp: string;
};

/** Registered ecosystem consumer — metadata only */
export type EcosystemProductRegistration = {
  appId: string;
  displayName: string;
  readiness: EcosystemProductReadiness;
  integrationLevel: EcosystemIntegrationLevel;
  foundationRoute?: string;
  legacyRoute?: string;
  note?: string;
};
