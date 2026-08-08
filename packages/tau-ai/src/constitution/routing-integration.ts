/**
 * Constitution → routing integration (AI-4).
 *
 * Constitutional privacy policy feeds the deterministic ModelRouter.
 * Constitution is never bypassed for substrate capability alone.
 */

import type { PrivacyMode } from '../routing/routing-types';
import type { IntelligenceRequest } from '../types/context';
import type { ConstitutionalEvaluationInput } from './types';
import { createConstitutionEvaluator } from './evaluator';

export type ConstitutionalRoutingPolicy = {
  privacyMode: PrivacyMode;
  constitutionVersion: string;
  blocked: boolean;
  reason?: string;
};

/**
 * Derive routing privacy mode from request signals.
 * Explicit LOCAL_ONLY wins over generic remote preference.
 */
export function derivePrivacyModeFromRequest(request: IntelligenceRequest): PrivacyMode {
  if (request.options?.privacyMode === true) {
    return 'LOCAL_ONLY';
  }
  return 'REMOTE_ALLOWED';
}

/**
 * Evaluate whether routing may proceed under constitutional privacy rules.
 */
export function evaluateConstitutionalRouting(input: {
  privacyMode: PrivacyMode;
  selectedSubstratePrivacyClass: 'LOCAL' | 'REMOTE' | 'UNKNOWN';
  userRequestedLocalOnly?: boolean;
}): ConstitutionalRoutingPolicy {
  const evaluator = createConstitutionEvaluator();
  const evaluation = evaluator.evaluate({
    kind: 'ROUTING',
    privacyMode: input.privacyMode,
    selectedSubstratePrivacyClass: input.selectedSubstratePrivacyClass,
    userRequestedLocalOnly: input.userRequestedLocalOnly,
  });

  const blocked = evaluation.overall === 'BLOCK';
  const blockReason = evaluation.evaluations.find((e) => e.result === 'BLOCK')?.reason;

  return {
    privacyMode: input.privacyMode,
    constitutionVersion: evaluation.constitutionVersion,
    blocked,
    reason: blockReason,
  };
}

/** Map structured evaluation input to router privacy mode when user demands local-only. */
export function resolveEffectivePrivacyMode(
  baseMode: PrivacyMode,
  input: Extract<ConstitutionalEvaluationInput, { kind: 'REQUEST' }>,
): PrivacyMode {
  if (input.userExplicitLocalOnly || input.privacyMode === 'LOCAL_ONLY') {
    return 'LOCAL_ONLY';
  }
  return baseMode;
}
