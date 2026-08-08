/**
 * Tau Execution Foundation types (AI-7).
 */

import type { CapabilityId } from '../capabilities/types';
import type { PrivacyMode } from '../routing/routing-types';
import type { ToolConfirmationState, ToolScope } from '../tools/types';
import type { TauAIAppId, TauAIUserId } from '../types/context';

export const TAU_EXECUTION_FOUNDATION_VERSION = 'tau-execution-v0.1';

export type ExecutionSideEffectClass =
  | 'NO_SIDE_EFFECT'
  | 'READ_ONLY'
  | 'LOCAL_SIDE_EFFECT'
  | 'REVERSIBLE_SIDE_EFFECT'
  | 'EXTERNAL_SIDE_EFFECT'
  | 'HIGH_IMPACT_SIDE_EFFECT';

export type AdapterRuntimeEnvironment = 'LOCAL' | 'CONTAINER' | 'REMOTE' | 'UNKNOWN';

export type ExecutionAvailability =
  | 'AVAILABLE'
  | 'UNAVAILABLE'
  | 'NOT_CONFIGURED'
  | 'DISABLED'
  | 'UNKNOWN';

export type ExecutionPrivacyClass = 'LOCAL' | 'REMOTE_ALLOWED' | 'UNKNOWN';

export type ExecutionHealthStatus = 'HEALTHY' | 'UNHEALTHY' | 'UNKNOWN';

export type ExecutionPolicyDecision =
  | 'ALLOW'
  | 'DENY'
  | 'REQUIRES_CONFIRMATION'
  | 'UNAVAILABLE'
  | 'NOT_CONFIGURED'
  | 'INVALID';

export type ExecutionStatus =
  | 'SUCCESS'
  | 'FAILED'
  | 'BLOCKED'
  | 'REQUIRES_CONFIRMATION'
  | 'UNAVAILABLE'
  | 'NOT_CONFIGURED'
  | 'INVALID';

export type ExecutionProvenance = {
  provider: string;
  version: string;
  source: string;
  registeredAt: string;
};

export type ExecutionRequirements = {
  minimumEnvironment?: AdapterRuntimeEnvironment;
  offlineCapable?: boolean;
  timeoutMs?: number;
};

export type ExecutionValidationResult = {
  valid: boolean;
  errors: string[];
};

export type ExecutionRunContext = {
  userId?: TauAIUserId;
  appId?: TauAIAppId;
  threadId?: string;
  userConfirmed?: boolean;
  signal?: AbortSignal;
};

export interface ExecutionAdapterDefinition {
  readonly id: string;
  readonly name: string;
  readonly version: string;
  readonly supportedCapabilities: CapabilityId[];
  readonly supportedEnvironments: AdapterRuntimeEnvironment[];
  readonly privacyClass: ExecutionPrivacyClass;
  readonly availability: ExecutionAvailability;
  readonly sideEffectClass: ExecutionSideEffectClass;
  readonly provenance: ExecutionProvenance;
  readonly executionRequirements?: ExecutionRequirements;
  readonly healthStatus?: ExecutionHealthStatus;
  readonly executable: boolean;
  execute?(
    request: GovernedExecutionRequest,
    context: ExecutionRunContext,
  ): Promise<GovernedExecutionResult>;
  validate?(input: unknown): ExecutionValidationResult;
}

export type ExecutionAuthorizationContext = {
  toolAuthorized: boolean;
  executionAuthorized: boolean;
  authorizedScopes: ToolScope[];
  fromMemory?: boolean;
};

export type GovernedExecutionRequest = {
  requestId: string;
  toolId: string;
  executionAdapterId: string;
  requestedBy: 'MODEL' | 'USER' | 'SYSTEM' | 'TOOL';
  capability: CapabilityId;
  scope: ToolScope;
  privacyMode?: PrivacyMode;
  sideEffectClass: ExecutionSideEffectClass;
  authorization: ExecutionAuthorizationContext;
  confirmation: ToolConfirmationState;
  input: unknown;
  provenance: {
    source: string;
    timestamp: string;
  };
  constitutionVersion?: string;
  requiredEnvironment?: AdapterRuntimeEnvironment;
  userId?: TauAIUserId;
  appId?: TauAIAppId;
};

export type GovernedExecutionResult = {
  status: ExecutionStatus;
  executed: boolean;
  requestId: string;
  executionId?: string;
  toolId: string;
  adapterId: string;
  adapterVersion?: string;
  constitutionVersion?: string;
  policyDecision?: ExecutionPolicyDecision;
  output?: unknown;
  error?: string;
  errorClassification?: string;
  provenance?: ExecutionProvenance;
  timestamp: string;
};

export type ExecutionAuditEntry = {
  timestamp: string;
  requestId: string;
  executionId?: string;
  toolId: string;
  adapterId: string;
  adapterVersion: string;
  constitutionVersion?: string;
  policyDecision: ExecutionPolicyDecision;
  confirmationResult: 'NOT_REQUIRED' | 'GRANTED' | 'DENIED' | 'PENDING';
  executionStatus: ExecutionStatus;
  metadata?: Record<string, string | number | boolean>;
};

export type ExecutionRegistrationResult = {
  success: boolean;
  adapterId?: string;
  error?: string;
};

export type ExecutionRegistryFilter = {
  capability?: CapabilityId;
  environment?: AdapterRuntimeEnvironment;
  availability?: ExecutionAvailability;
};
