/**
 * Tau Constitution types (AI-4).
 *
 * Structured, versioned, machine-readable — not a provider-specific prompt blob.
 */

import type { PrivacyMode } from '../routing/routing-types';
import type { CapabilityId } from '../capabilities/types';
import type { SubstrateId } from '../types/context';

export const TAU_CONSTITUTION_VERSION = 'tau-constitution-v0.1';

export type ConstitutionalPrincipleId =
  | 'TRUTHFULNESS'
  | 'UNCERTAINTY'
  | 'TRANSPARENCY'
  | 'USER_AUTONOMY'
  | 'PRIVACY'
  | 'SECURITY'
  | 'PROVENANCE'
  | 'CORRECTION'
  | 'CAPABILITY_HONESTY'
  | 'INSTRUCTION_HIERARCHY';

export type EvaluationResult = 'PASS' | 'WARN' | 'BLOCK';

export type ConstitutionalPrinciple = {
  id: ConstitutionalPrincipleId;
  title: string;
  summary: string;
  priority: number;
};

export type InstructionHierarchyLevel = {
  rank: number;
  id: string;
  label: string;
  description: string;
};

export type RuleEvaluation = {
  principle: ConstitutionalPrincipleId;
  rule: string;
  result: EvaluationResult;
  reason: string;
};

export type ConstitutionalAuditRecord = {
  constitutionVersion: string;
  rule: string;
  result: EvaluationResult;
  reason: string;
  timestamp: string;
};

export type ConstitutionalEvaluation = {
  constitutionVersion: string;
  overall: EvaluationResult;
  evaluations: RuleEvaluation[];
  auditRecords: ConstitutionalAuditRecord[];
};

/** Short structured constraints for substrate adapters — not a giant system prompt. */
export type ConstitutionalContextFragment = {
  constitutionVersion: string;
  privacyMode: PrivacyMode;
  instructionHierarchy: InstructionHierarchyLevel[];
  activePrincipleIds: ConstitutionalPrincipleId[];
  constraints: string[];
};

export type EvaluationKind =
  | 'REQUEST'
  | 'RESPONSE'
  | 'TOOL_USE'
  | 'MEMORY_WRITE'
  | 'ROUTING'
  | 'EXTERNAL_CONTENT';

export type ResponseEvaluationInput = {
  kind: 'RESPONSE';
  claimsVerifiedFact?: boolean;
  hasEvidence?: boolean;
  expressesUncertainty?: boolean;
  informationComplete?: boolean;
  claimsActionPerformed?: boolean;
  actionActuallyPerformed?: boolean;
  claimedCapabilities?: CapabilityId[];
  availableCapabilities?: CapabilityId[];
  provenanceAvailable?: boolean;
  citesFabricatedSource?: boolean;
  acknowledgesPriorError?: boolean;
};

export type RequestEvaluationInput = {
  kind: 'REQUEST';
  privacyMode?: PrivacyMode;
  userExplicitLocalOnly?: boolean;
  requestedRemoteSubstrate?: boolean;
};

export type ToolEvaluationInput = {
  kind: 'TOOL_USE';
  toolName: string;
  toolRegistered: boolean;
  authorizationPresent: boolean;
  requiresConfirmation?: boolean;
  confirmationPresent?: boolean;
  involvesProtectedData?: boolean;
  privacyMode?: PrivacyMode;
  createsExternalSideEffect?: boolean;
  scopeAllowed?: boolean;
};

export type RoutingEvaluationInput = {
  kind: 'ROUTING';
  privacyMode: PrivacyMode;
  selectedSubstrateId?: SubstrateId;
  selectedSubstratePrivacyClass: 'LOCAL' | 'REMOTE' | 'UNKNOWN';
  userRequestedLocalOnly?: boolean;
};

export type ExternalContentEvaluationInput = {
  kind: 'EXTERNAL_CONTENT';
  contentRole: 'RETRIEVED' | 'USER_PROVIDED' | 'MODEL_OUTPUT';
  attemptsInstructionOverride?: boolean;
  markedUntrusted?: boolean;
};

export type MemoryEvaluationInput = {
  kind: 'MEMORY_WRITE';
  memoryPreferenceKey?: string;
  conflictsWithPrivacy?: boolean;
  conflictsWithSecurity?: boolean;
  privacyMode?: PrivacyMode;
};

export type ConstitutionalEvaluationInput =
  | ResponseEvaluationInput
  | RequestEvaluationInput
  | ToolEvaluationInput
  | RoutingEvaluationInput
  | ExternalContentEvaluationInput
  | MemoryEvaluationInput;
