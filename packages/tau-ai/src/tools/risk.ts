/**
 * Tool risk model and confirmation policy (AI-6).
 */

import type { ConfirmationPolicy, ToolRiskClass } from './types';

export function deriveConfirmationPolicy(riskClass: ToolRiskClass): ConfirmationPolicy {
  switch (riskClass) {
    case 'READ_ONLY':
      return { required: false };
    case 'LOW_IMPACT':
      return { required: false, autoWhenAuthorized: true };
    case 'REVERSIBLE_ACTION':
      return { required: true, userConfirmationRequired: true };
    case 'EXTERNAL_SIDE_EFFECT':
      return { required: true, userConfirmationRequired: true };
    case 'HIGH_IMPACT':
      return { required: true, userConfirmationRequired: true };
    default:
      return { required: true, userConfirmationRequired: true };
  }
}

export function isConsequentialRisk(riskClass: ToolRiskClass): boolean {
  return (
    riskClass === 'REVERSIBLE_ACTION' ||
    riskClass === 'EXTERNAL_SIDE_EFFECT' ||
    riskClass === 'HIGH_IMPACT'
  );
}

export function requiresUserConfirmation(
  policy: ConfirmationPolicy,
  riskClass: ToolRiskClass,
): boolean {
  if (policy.userConfirmationRequired) return true;
  if (policy.required) return true;
  if (riskClass === 'EXTERNAL_SIDE_EFFECT' || riskClass === 'HIGH_IMPACT') return true;
  return false;
}
