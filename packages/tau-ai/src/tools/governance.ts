/**
 * Constitution-governed tool request evaluation (AI-6).
 */

import type { Constitution } from '../constitution/constitution';
import { TAU_CONSTITUTION_VERSION } from '../constitution/types';
import { isConsequentialRisk, requiresUserConfirmation } from './risk';
import { isScopeAuthorized, isScopeEscalationAttempt, toolSupportsScope } from './scope';
import type {
  TauToolDefinition,
  ToolAuthorizationContext,
  ToolConfirmationState,
  ToolExecutionResult,
  ToolRequest,
} from './types';

export type ToolGovernanceDecision = {
  allowed: boolean;
  status: ToolExecutionResult['status'];
  policyResult: 'PASS' | 'WARN' | 'BLOCK';
  reason?: string;
  constitutionVersion?: string;
  confirmationRequired?: boolean;
};

export async function evaluateToolRequestGovernance(
  tool: TauToolDefinition,
  request: ToolRequest,
  options: { constitution?: Constitution },
): Promise<ToolGovernanceDecision> {
  const constitutionVersion = TAU_CONSTITUTION_VERSION;

  if (tool.availability === 'UNAVAILABLE') {
    return {
      allowed: false,
      status: 'UNAVAILABLE',
      policyResult: 'BLOCK',
      reason: `Tool "${tool.id}" is unavailable.`,
      constitutionVersion,
    };
  }
  if (tool.availability === 'NOT_CONFIGURED') {
    return {
      allowed: false,
      status: 'NOT_CONFIGURED',
      policyResult: 'BLOCK',
      reason: `Tool "${tool.id}" is not configured.`,
      constitutionVersion,
    };
  }
  if (tool.availability === 'DISABLED') {
    return {
      allowed: false,
      status: 'BLOCKED',
      policyResult: 'BLOCK',
      reason: `Tool "${tool.id}" is disabled.`,
      constitutionVersion,
    };
  }

  if (request.capability !== tool.capability) {
    return {
      allowed: false,
      status: 'BLOCKED',
      policyResult: 'BLOCK',
      reason: 'Capability mismatch — capability honesty violation.',
      constitutionVersion,
    };
  }

  if (request.privacyMode === 'LOCAL_ONLY' && tool.privacyClass === 'REMOTE_ALLOWED') {
    return {
      allowed: false,
      status: 'BLOCKED',
      policyResult: 'BLOCK',
      reason: 'LOCAL_ONLY: tool requires remote access.',
      constitutionVersion,
    };
  }

  if (!toolSupportsScope(request.scope, tool.requiredScopes)) {
    return {
      allowed: false,
      status: 'BLOCKED',
      policyResult: 'BLOCK',
      reason: 'Insufficient tool scope.',
      constitutionVersion,
    };
  }

  if (!isScopeAuthorized(request.scope, request.authorization.authorizedScopes)) {
    return {
      allowed: false,
      status: 'BLOCKED',
      policyResult: 'BLOCK',
      reason: 'Unauthorized scope.',
      constitutionVersion,
    };
  }

  if (isScopeEscalationAttempt(request.scope, request.authorization.authorizedScopes)) {
    return {
      allowed: false,
      status: 'BLOCKED',
      policyResult: 'BLOCK',
      reason: 'Scope escalation to SYSTEM blocked.',
      constitutionVersion,
    };
  }

  if (!request.authorization.granted) {
    return {
      allowed: false,
      status: 'BLOCKED',
      policyResult: 'BLOCK',
      reason: 'Tool authorization not granted.',
      constitutionVersion,
    };
  }

  if (
    request.authorization.fromMemory &&
    isConsequentialRisk(tool.riskClass)
  ) {
    return {
      allowed: false,
      status: 'BLOCKED',
      policyResult: 'BLOCK',
      reason: 'Memory cannot grant authority for consequential tool actions.',
      constitutionVersion,
    };
  }

  const confirmationRequired = resolveConfirmationRequired(tool, request.confirmation);

  if (options.constitution) {
    const decision = await options.constitution.evaluateToolUse({
      userId: request.userId,
      appId: request.appId,
      toolName: tool.id,
      permissions: tool.permissions,
      execution: { userId: request.userId, appId: request.appId },
    });
    if (!decision.allowed) {
      return {
        allowed: false,
        status: 'BLOCKED',
        policyResult: 'BLOCK',
        reason: decision.reason ?? 'Constitution blocked tool use.',
        constitutionVersion,
      };
    }
  }

  if (confirmationRequired && request.confirmation.denied) {
    return {
      allowed: false,
      status: 'BLOCKED',
      policyResult: 'BLOCK',
      reason: 'User denied tool confirmation.',
      constitutionVersion,
      confirmationRequired: true,
    };
  }

  if (confirmationRequired && !request.confirmation.granted) {
    return {
      allowed: false,
      status: 'REQUIRES_CONFIRMATION',
      policyResult: 'PASS',
      reason: 'Explicit user confirmation required — model cannot waive.',
      constitutionVersion,
      confirmationRequired: true,
    };
  }

  if (
    tool.sideEffectClass === 'EXTERNAL' ||
    tool.sideEffectClass === 'IRREVERSIBLE' ||
    tool.riskClass === 'HIGH_IMPACT'
  ) {
    if (!request.confirmation.granted && request.requestedBy === 'MODEL') {
      return {
        allowed: false,
        status: 'REQUIRES_CONFIRMATION',
        policyResult: 'PASS',
        reason: 'High-impact/external side-effect requires user confirmation.',
        constitutionVersion,
        confirmationRequired: true,
      };
    }
  }

  return {
    allowed: true,
    status: 'SUCCESS',
    policyResult: 'PASS',
    constitutionVersion,
    confirmationRequired,
  };
}

function resolveConfirmationRequired(
  tool: TauToolDefinition,
  confirmation: ToolConfirmationState,
): boolean {
  if (confirmation.required) return true;
  return requiresUserConfirmation(tool.confirmationPolicy, tool.riskClass);
}

/** Model-provided confirmation alone is never sufficient. */
export function isValidUserConfirmation(
  auth: ToolAuthorizationContext,
  confirmation: ToolConfirmationState,
  userConfirmed?: boolean,
): boolean {
  if (!confirmation.granted && !userConfirmed) return false;
  if (auth.fromMemory && !userConfirmed) return false;
  return confirmation.granted === true || userConfirmed === true;
}
