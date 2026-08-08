/**
 * Tau Constitution v0.1 — reference implementation (AI-4).
 *
 * Model-independent. Works with any third-party substrate or future Tau Foundation Model.
 */

import type { PrivacyMode } from '../routing/routing-types';
import type { IntelligenceRequest } from '../types/context';
import type { RoutingContext } from '../routing/router';
import type { SubstrateId } from '../types/context';
import {
  type Constitution,
  type ConstitutionContext,
  type ExecutionPolicyContext,
  type MemoryPolicyContext,
  type ModelPolicyContext,
  type PolicyDecision,
  type RequestPolicyContext,
  type ToolPolicyContext,
} from './constitution';
import { buildConstitutionalContextFragment } from './context-fragment';
import {
  createConstitutionEvaluator,
  type ConstitutionEvaluator,
} from './evaluator';
import { MEMORY_HIERARCHY_NOTE } from './hierarchy';
import { TAU_CONSTITUTION_V01_PRINCIPLES } from './principles';
import {
  derivePrivacyModeFromRequest,
  evaluateConstitutionalRouting,
} from './routing-integration';
import {
  TAU_CONSTITUTION_VERSION,
  type ConstitutionalContextFragment,
  type ConstitutionalEvaluation,
  type ConstitutionalEvaluationInput,
  type ConstitutionalPrinciple,
} from './types';

export type TauConstitution = Constitution & {
  readonly version: string;
  readonly principles: ConstitutionalPrinciple[];
  readonly evaluator: ConstitutionEvaluator;
  evaluateStructured(input: ConstitutionalEvaluationInput): ConstitutionalEvaluation;
  buildContextFragment(privacyMode?: PrivacyMode): ConstitutionalContextFragment;
  deriveRoutingPrivacyMode(request: IntelligenceRequest): PrivacyMode;
  readonly memoryHierarchyNote: string;
};

function policyFromEvaluation(evaluation: ConstitutionalEvaluation): PolicyDecision {
  if (evaluation.overall === 'BLOCK') {
    const blocked = evaluation.evaluations.find((e) => e.result === 'BLOCK');
    return {
      allowed: false,
      reason: blocked?.reason ?? 'Constitutional evaluation blocked.',
      code: blocked?.rule ?? 'CONSTITUTION_BLOCK',
    };
  }
  const warned = evaluation.evaluations.find((e) => e.result === 'WARN');
  return {
    allowed: true,
    reason: warned?.reason,
    code: warned ? 'CONSTITUTION_WARN' : 'CONSTITUTION_PASS',
  };
}

export class TauConstitutionV01 implements TauConstitution {
  readonly version = TAU_CONSTITUTION_VERSION;
  readonly principles = TAU_CONSTITUTION_V01_PRINCIPLES;
  readonly evaluator: ConstitutionEvaluator;
  readonly memoryHierarchyNote = MEMORY_HIERARCHY_NOTE;

  constructor(evaluator: ConstitutionEvaluator = createConstitutionEvaluator()) {
    this.evaluator = evaluator;
  }

  evaluateStructured(input: ConstitutionalEvaluationInput): ConstitutionalEvaluation {
    return this.evaluator.evaluate(input);
  }

  buildContextFragment(privacyMode: PrivacyMode = 'REMOTE_ALLOWED'): ConstitutionalContextFragment {
    return buildConstitutionalContextFragment(privacyMode);
  }

  deriveRoutingPrivacyMode(request: IntelligenceRequest): PrivacyMode {
    return derivePrivacyModeFromRequest(request);
  }

  async evaluateRequest(context: RequestPolicyContext): Promise<PolicyDecision> {
    const privacyMode = this.deriveRoutingPrivacyMode(context.request);
    const evaluation = this.evaluator.evaluate({
      kind: 'REQUEST',
      privacyMode,
      userExplicitLocalOnly: privacyMode === 'LOCAL_ONLY',
      requestedRemoteSubstrate: context.request.options?.substrate
        ? !String(context.request.options.substrate).startsWith('local')
        : false,
    });
    return policyFromEvaluation(evaluation);
  }

  async evaluateToolUse(context: ToolPolicyContext): Promise<PolicyDecision> {
    const evaluation = this.evaluator.evaluate({
      kind: 'TOOL_USE',
      toolName: context.toolName,
      toolRegistered: true,
      authorizationPresent: context.permissions.length > 0,
      scopeAllowed: context.permissions.length > 0,
    });
    return policyFromEvaluation(evaluation);
  }

  async evaluateExecution(context: ExecutionPolicyContext): Promise<PolicyDecision> {
    const authorized = context.request.metadata?.authorized === true;
    const evaluation = this.evaluator.evaluate({
      kind: 'TOOL_USE',
      toolName: context.request.action,
      toolRegistered: true,
      authorizationPresent: authorized,
      scopeAllowed: authorized,
      createsExternalSideEffect: context.request.metadata?.externalSideEffect === true,
    });
    return policyFromEvaluation(evaluation);
  }

  async evaluateMemoryWrite(context: MemoryPolicyContext): Promise<PolicyDecision> {
    const conflictsWithPrivacy =
      context.entry.metadata?.conflictsWithPrivacy === true ||
      context.entry.metadata?.overridePrivacy === true;
    const conflictsWithSecurity = context.entry.metadata?.conflictsWithSecurity === true;

    const evaluation = this.evaluator.evaluate({
      kind: 'MEMORY_WRITE',
      memoryPreferenceKey: context.entry.metadata?.preferenceKey as string | undefined,
      conflictsWithPrivacy,
      conflictsWithSecurity,
    });
    return policyFromEvaluation(evaluation);
  }

  async evaluateModelAccess(context: ModelPolicyContext): Promise<PolicyDecision> {
    const privacyMode: PrivacyMode = context.routing.privacyMode ? 'LOCAL_ONLY' : 'REMOTE_ALLOWED';
    const substrateClass = inferSubstratePrivacyClass(context.substrateId);
    const routingPolicy = evaluateConstitutionalRouting({
      privacyMode,
      selectedSubstratePrivacyClass: substrateClass,
      userRequestedLocalOnly: context.routing.privacyMode === true,
    });

    if (routingPolicy.blocked) {
      return {
        allowed: false,
        reason: routingPolicy.reason,
        code: 'CONSTITUTION_ROUTING_BLOCK',
      };
    }
    return { allowed: true, code: 'CONSTITUTION_ROUTING_PASS' };
  }
}

function inferSubstratePrivacyClass(substrateId: SubstrateId): 'LOCAL' | 'REMOTE' | 'UNKNOWN' {
  const id = substrateId.toLowerCase();
  if (id.includes('ollama') || id.includes('fallback') || id.includes('local') || id === 'tau-foundation') {
    return 'LOCAL';
  }
  if (
    id.includes('openai') ||
    id.includes('anthropic') ||
    id.includes('gemini') ||
    id.includes('deepseek') ||
    id.includes('openrouter') ||
    id.includes('azure')
  ) {
    return 'REMOTE';
  }
  return 'UNKNOWN';
}

/** Default Tau Constitution instance for engineering/shadow use. */
export function createTauConstitutionV01(): TauConstitution {
  return new TauConstitutionV01();
}

// Re-export for convenience in policy contexts
export type { ConstitutionContext };
