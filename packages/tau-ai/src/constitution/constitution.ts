/**
 * Constitution contract — policy governance (AI-1 scaffold, AI-4 implementation).
 *
 * Governs system behaviour, privacy, data handling, tool/model/execution
 * permissions, and user authority. Reference implementation: TauConstitutionV01.
 */

import type {
  IntelligenceRequest,
  TauAIAppId,
  TauAIUserId,
} from '../types';
import type { MemoryEntry } from '../memory/store';
import type { RoutingContext } from '../routing/router';
import type { ToolPermission } from '../tools/registry';
import type { ToolExecutionContext } from '../tools/types';
import type { ExecutionRequest } from '../execution/adapter';
import type { SubstrateId } from '../types/context';

export type PolicyDecision = {
  allowed: boolean;
  reason?: string;
  code?: string;
};

export type ConstitutionContext = {
  userId?: TauAIUserId;
  appId?: TauAIAppId;
};

export type RequestPolicyContext = ConstitutionContext & {
  request: IntelligenceRequest;
};

export type ToolPolicyContext = ConstitutionContext & {
  toolName: string;
  permissions: ToolPermission[];
  execution: ToolExecutionContext;
};

export type ExecutionPolicyContext = ConstitutionContext & {
  request: ExecutionRequest;
};

export type MemoryPolicyContext = ConstitutionContext & {
  entry: MemoryEntry;
};

export type ModelPolicyContext = ConstitutionContext & {
  routing: RoutingContext;
  substrateId: SubstrateId;
};

/**
 * Policy engine hooks consumed by IntelligenceService before routing,
 * tool use, execution, and memory writes.
 */
export interface Constitution {
  evaluateRequest(context: RequestPolicyContext): Promise<PolicyDecision>;
  evaluateToolUse(context: ToolPolicyContext): Promise<PolicyDecision>;
  evaluateExecution(context: ExecutionPolicyContext): Promise<PolicyDecision>;
  evaluateMemoryWrite(context: MemoryPolicyContext): Promise<PolicyDecision>;
  evaluateModelAccess(context: ModelPolicyContext): Promise<PolicyDecision>;
}
