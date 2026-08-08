/**
 * Tau Tool Foundation types (AI-6).
 */

import type { CapabilityId } from '../capabilities/types';
import type { PrivacyMode } from '../routing/routing-types';
import type { TauAIAppId, TauAIUserId } from '../types/context';
import type { JSONSchema } from '../types/json-schema';
import type { ToolPermission } from './registry';

export const TAU_TOOL_FOUNDATION_VERSION = 'tau-tools-v0.1';

export type ToolAvailability = 'AVAILABLE' | 'UNAVAILABLE' | 'NOT_CONFIGURED' | 'DISABLED';

export type ToolRiskClass =
  | 'READ_ONLY'
  | 'LOW_IMPACT'
  | 'REVERSIBLE_ACTION'
  | 'EXTERNAL_SIDE_EFFECT'
  | 'HIGH_IMPACT';

export type ToolScope = 'USER' | 'PROJECT' | 'PRODUCT' | 'SYSTEM';

export type ToolPrivacyClass = 'LOCAL' | 'REMOTE_ALLOWED' | 'UNKNOWN';

export type SideEffectClass = 'NONE' | 'LOCAL' | 'EXTERNAL' | 'IRREVERSIBLE';

export type ToolRequestSource = 'MODEL' | 'USER' | 'SYSTEM';

export type ConfirmationPolicy = {
  required: boolean;
  /** May auto-execute when explicitly authorized (LOW_IMPACT). */
  autoWhenAuthorized?: boolean;
  /** Requires explicit user confirmation channel — model cannot waive. */
  userConfirmationRequired?: boolean;
};

export type ToolProvenance = {
  provider: string;
  version: string;
  source: string;
  registeredAt: string;
};

export type ToolExecutionStatus =
  | 'SUCCESS'
  | 'FAILURE'
  | 'BLOCKED'
  | 'REQUIRES_CONFIRMATION'
  | 'UNAVAILABLE'
  | 'NOT_CONFIGURED';

export type ToolExecutionContext = {
  userId?: TauAIUserId;
  appId?: TauAIAppId;
  threadId?: string;
  signal?: AbortSignal;
  /** Explicit user confirmation — never from model output alone. */
  userConfirmed?: boolean;
};

/**
 * Strongly typed Tau tool contract (AI-6).
 * Not every tool is executable — availability and policy govern execution.
 */
export interface TauToolDefinition {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly version: string;
  readonly capability: CapabilityId;
  readonly inputSchema: JSONSchema;
  readonly outputSchema: JSONSchema;
  readonly permissions: ToolPermission[];
  readonly requiredScopes: ToolScope[];
  readonly privacyClass: ToolPrivacyClass;
  readonly riskClass: ToolRiskClass;
  readonly sideEffectClass: SideEffectClass;
  readonly confirmationPolicy: ConfirmationPolicy;
  readonly availability: ToolAvailability;
  readonly provenance: ToolProvenance;
  readonly executable: boolean;
  execute?(input: unknown, context: ToolExecutionContext): Promise<ToolExecutionResult>;
}

export type ToolAuthorizationContext = {
  granted: boolean;
  authorizedScopes: ToolScope[];
  /** Must not silently authorize consequential tools from memory alone. */
  fromMemory?: boolean;
};

export type ToolConfirmationState = {
  required: boolean;
  granted?: boolean;
  denied?: boolean;
};

export type ToolRequest = {
  requestId: string;
  toolId: string;
  requestedBy: ToolRequestSource;
  capability: CapabilityId;
  scope: ToolScope;
  input: unknown;
  privacyMode?: PrivacyMode;
  authorization: ToolAuthorizationContext;
  confirmation: ToolConfirmationState;
  provenance: {
    source: string;
    timestamp: string;
  };
  userId?: TauAIUserId;
  appId?: TauAIAppId;
};

export type ToolExecutionResult = {
  status: ToolExecutionStatus;
  toolId: string;
  requestId: string;
  executed: boolean;
  output?: unknown;
  error?: string;
  policyResult?: 'PASS' | 'WARN' | 'BLOCK';
  constitutionVersion?: string;
  toolVersion?: string;
  auditId?: string;
};

export type ToolAuditEntry = {
  timestamp: string;
  requestId: string;
  toolId: string;
  toolVersion: string;
  constitutionVersion?: string;
  policyResult?: 'PASS' | 'WARN' | 'BLOCK';
  authorizationResult: 'GRANTED' | 'DENIED';
  confirmationResult: 'NOT_REQUIRED' | 'GRANTED' | 'DENIED' | 'PENDING';
  executionStatus: ToolExecutionStatus;
  lifecycleStage:
    | 'DISCOVER'
    | 'DESCRIBE'
    | 'REQUEST'
    | 'AUTHORIZE'
    | 'CONFIRM'
    | 'EXECUTE'
    | 'VALIDATE'
    | 'AUDIT';
  metadata?: Record<string, string | number | boolean>;
};

export type ToolRegistrationResult = {
  success: boolean;
  toolId?: string;
  error?: string;
};

export type ToolValidationResult = {
  valid: boolean;
  errors: string[];
};

export type ToolRegistryFilter = {
  capability?: CapabilityId;
  scope?: ToolScope;
  availability?: ToolAvailability;
  appId?: TauAIAppId;
};
