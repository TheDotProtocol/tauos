/**
 * Tau Foundation v0.1 composition types (AI-8).
 */

import type { CapabilityId } from '../capabilities/types';
import type { TauConstitution } from '../constitution/tau-constitution-v01';
import type { GovernedExecutionExecutor } from '../execution/executor';
import type { TauExecutionAdapterRegistry } from '../execution/registry-impl';
import type { GovernedExecutionRequest, GovernedExecutionResult } from '../execution/types';
import type { IntelligenceService } from '../core/intelligence';
import type { HardwareDetector } from '../hardware/detector';
import type { TauMemoryFoundation } from '../memory/in-memory-store';
import type { MemoryWriteRequest, MemoryWriteResult } from '../memory/types';
import type { DeterministicModelRouter } from '../routing/deterministic-router';
import type { PrivacyMode, RoutableSubstrate, RoutingResult } from '../routing/routing-types';
import type { GovernedToolExecutor } from '../tools/executor';
import type { TauToolRegistry } from '../tools/registry-impl';
import type { ToolRequest, ToolExecutionResult } from '../tools/types';
import type { ConstitutionalEvaluation, ResponseEvaluationInput } from '../constitution/types';
import type { IntelligenceRequest, IntelligenceResponse } from '../types/context';

export const TAU_FOUNDATION_PIPELINE_VERSION = 'tau-foundation-v0.1';

export type FoundationPipelineRequest = IntelligenceRequest & {
  requestId?: string;
  capabilityOverride?: CapabilityId;
  privacyModeOverride?: PrivacyMode;
  toolRequest?: ToolRequest;
  executionRequest?: GovernedExecutionRequest;
  memoryWrite?: MemoryWriteRequest;
  responseCheck?: ResponseEvaluationInput;
};

export type FoundationPipelineResult = {
  requestId: string;
  capability: CapabilityId;
  privacyMode: PrivacyMode;
  constitutionAllowed: boolean;
  routing: RoutingResult;
  memoryContextCount: number;
  memoryWrite?: MemoryWriteResult;
  toolResult?: ToolExecutionResult;
  executionResult?: GovernedExecutionResult;
  responseCheck?: ConstitutionalEvaluation;
  response?: IntelligenceResponse;
  shadow: ShadowPipelineLogEntry;
  success: boolean;
  latencyMs: number;
};

export type ShadowPipelineLogEntry = {
  shadow: true;
  productionPath: 'unchanged';
  pipelineVersion: string;
  requestId: string;
  capability: CapabilityId;
  privacyMode: PrivacyMode;
  substrateId?: string;
  routingSuccess: boolean;
  routingAgreement?: boolean;
  legacySubstrateId?: string;
  constitutionResult: 'PASS' | 'WARN' | 'BLOCK';
  memoryDecision?: string;
  toolDecision?: string;
  executionDecision?: string;
  responseCheckResult?: 'PASS' | 'WARN' | 'BLOCK';
  latencyMs: number;
  success: boolean;
  timestamp: string;
};

export type TauFoundationPipelineDeps = {
  memory: TauMemoryFoundation;
  constitution: TauConstitution;
  router: DeterministicModelRouter;
  toolExecutor: GovernedToolExecutor;
  executionExecutor: GovernedExecutionExecutor;
  toolRegistry: TauToolRegistry;
  executionRegistry: TauExecutionAdapterRegistry;
  substrates: RoutableSubstrate[];
  intelligence?: IntelligenceService;
  hardwareDetector?: HardwareDetector;
};

export type ShadowComparisonResult = {
  productionSubstrateId?: string;
  foundationSubstrateId?: string;
  agreement?: boolean;
  foundationLog: ShadowPipelineLogEntry;
};
