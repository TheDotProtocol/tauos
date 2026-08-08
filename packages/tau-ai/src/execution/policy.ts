/**
 * Deterministic execution policy (AI-7).
 */

import type { Constitution } from '../constitution/constitution';
import { TAU_CONSTITUTION_VERSION } from '../constitution/types';
import { isScopeAuthorized, isScopeEscalationAttempt } from '../tools/scope';
import {
  isConsequentialSideEffect,
  requiresExecutionConfirmation,
} from './side-effect';
import { deriveExecutionConfirmationPolicy } from './side-effect';
import type {
  ExecutionAdapterDefinition,
  ExecutionPolicyDecision,
  GovernedExecutionRequest,
} from './types';

export type ExecutionPolicyResult = {
  decision: ExecutionPolicyDecision;
  allowed: boolean;
  reason?: string;
  constitutionVersion?: string;
  confirmationRequired?: boolean;
};

export async function evaluateExecutionPolicy(
  adapter: ExecutionAdapterDefinition,
  request: GovernedExecutionRequest,
  options: { constitution?: Constitution },
): Promise<ExecutionPolicyResult> {
  const constitutionVersion = request.constitutionVersion ?? TAU_CONSTITUTION_VERSION;

  if (adapter.availability === 'UNAVAILABLE') {
    return { decision: 'UNAVAILABLE', allowed: false, reason: 'Adapter unavailable.', constitutionVersion };
  }
  if (adapter.availability === 'NOT_CONFIGURED') {
    return { decision: 'NOT_CONFIGURED', allowed: false, reason: 'Adapter not configured.', constitutionVersion };
  }
  if (adapter.availability === 'DISABLED') {
    return { decision: 'DENY', allowed: false, reason: 'Adapter disabled.', constitutionVersion };
  }
  if (adapter.availability === 'UNKNOWN') {
    return { decision: 'INVALID', allowed: false, reason: 'Adapter availability unknown.', constitutionVersion };
  }

  if (!adapter.supportedCapabilities.includes(request.capability)) {
    return {
      decision: 'INVALID',
      allowed: false,
      reason: 'Capability not supported by adapter.',
      constitutionVersion,
    };
  }

  if (
    request.requiredEnvironment &&
    !adapter.supportedEnvironments.includes(request.requiredEnvironment)
  ) {
    return {
      decision: 'UNAVAILABLE',
      allowed: false,
      reason: `Required environment ${request.requiredEnvironment} not supported.`,
      constitutionVersion,
    };
  }

  if (request.privacyMode === 'LOCAL_ONLY' && adapter.privacyClass === 'REMOTE_ALLOWED') {
    return {
      decision: 'DENY',
      allowed: false,
      reason: 'LOCAL_ONLY: execution adapter requires remote access.',
      constitutionVersion,
    };
  }

  if (!request.authorization.toolAuthorized) {
    return {
      decision: 'DENY',
      allowed: false,
      reason: 'Tool not authorized — execution denied.',
      constitutionVersion,
    };
  }

  if (!request.authorization.executionAuthorized) {
    return {
      decision: 'DENY',
      allowed: false,
      reason: 'Execution authorization not granted.',
      constitutionVersion,
    };
  }

  if (!isScopeAuthorized(request.scope, request.authorization.authorizedScopes)) {
    return {
      decision: 'DENY',
      allowed: false,
      reason: 'Execution scope not authorized.',
      constitutionVersion,
    };
  }

  if (isScopeEscalationAttempt(request.scope, request.authorization.authorizedScopes)) {
    return {
      decision: 'DENY',
      allowed: false,
      reason: 'Scope escalation blocked.',
      constitutionVersion,
    };
  }

  if (
    request.authorization.fromMemory &&
    isConsequentialSideEffect(request.sideEffectClass)
  ) {
    return {
      decision: 'DENY',
      allowed: false,
      reason: 'Memory cannot grant execution authority for consequential side effects.',
      constitutionVersion,
    };
  }

  const confirmPolicy = deriveExecutionConfirmationPolicy(request.sideEffectClass);
  const confirmationRequired = requiresExecutionConfirmation(
    request.sideEffectClass,
    confirmPolicy,
  );

  if (options.constitution) {
    const externalSideEffect =
      request.sideEffectClass === 'EXTERNAL_SIDE_EFFECT' ||
      request.sideEffectClass === 'HIGH_IMPACT_SIDE_EFFECT';
    const decision = await options.constitution.evaluateExecution({
      userId: request.userId,
      appId: request.appId,
      request: {
        action: request.toolId,
        payload: request.input,
        metadata: {
          authorized: request.authorization.executionAuthorized,
          externalSideEffect,
        },
      },
    });
    if (!decision.allowed) {
      return {
        decision: 'DENY',
        allowed: false,
        reason: decision.reason ?? 'Constitution blocked execution.',
        constitutionVersion,
      };
    }
  }

  if (confirmationRequired && request.confirmation.denied) {
    return {
      decision: 'DENY',
      allowed: false,
      reason: 'User denied execution confirmation.',
      constitutionVersion,
      confirmationRequired: true,
    };
  }

  if (confirmationRequired && !request.confirmation.granted) {
    return {
      decision: 'REQUIRES_CONFIRMATION',
      allowed: false,
      reason: 'Explicit user confirmation required for execution.',
      constitutionVersion,
      confirmationRequired: true,
    };
  }

  if (
    (request.sideEffectClass === 'EXTERNAL_SIDE_EFFECT' ||
      request.sideEffectClass === 'HIGH_IMPACT_SIDE_EFFECT') &&
    request.requestedBy === 'MODEL' &&
    !request.confirmation.granted
  ) {
    return {
      decision: 'REQUIRES_CONFIRMATION',
      allowed: false,
      reason: 'Model cannot waive external/high-impact execution confirmation.',
      constitutionVersion,
      confirmationRequired: true,
    };
  }

  return { decision: 'ALLOW', allowed: true, constitutionVersion, confirmationRequired };
}
