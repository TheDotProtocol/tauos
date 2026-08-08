/**
 * Execution side-effect policy (AI-7).
 *
 * Separate from tool risk — execution class governs adapter-level side effects.
 */

import type { ConfirmationPolicy } from '../tools/types';
import type { ExecutionSideEffectClass } from './types';

export function deriveExecutionConfirmationPolicy(
  sideEffectClass: ExecutionSideEffectClass,
): ConfirmationPolicy {
  switch (sideEffectClass) {
    case 'NO_SIDE_EFFECT':
    case 'READ_ONLY':
      return { required: false };
    case 'LOCAL_SIDE_EFFECT':
      return { required: true, userConfirmationRequired: true };
    case 'REVERSIBLE_SIDE_EFFECT':
      return { required: true, userConfirmationRequired: true };
    case 'EXTERNAL_SIDE_EFFECT':
      return { required: true, userConfirmationRequired: true };
    case 'HIGH_IMPACT_SIDE_EFFECT':
      return { required: true, userConfirmationRequired: true };
    default:
      return { required: true, userConfirmationRequired: true };
  }
}

export function isConsequentialSideEffect(sideEffectClass: ExecutionSideEffectClass): boolean {
  return (
    sideEffectClass === 'LOCAL_SIDE_EFFECT' ||
    sideEffectClass === 'REVERSIBLE_SIDE_EFFECT' ||
    sideEffectClass === 'EXTERNAL_SIDE_EFFECT' ||
    sideEffectClass === 'HIGH_IMPACT_SIDE_EFFECT'
  );
}

export function requiresExecutionConfirmation(
  sideEffectClass: ExecutionSideEffectClass,
  policy: ConfirmationPolicy,
): boolean {
  if (policy.userConfirmationRequired) return true;
  if (policy.required) return true;
  return (
    sideEffectClass === 'EXTERNAL_SIDE_EFFECT' ||
    sideEffectClass === 'HIGH_IMPACT_SIDE_EFFECT' ||
    sideEffectClass === 'REVERSIBLE_SIDE_EFFECT'
  );
}
