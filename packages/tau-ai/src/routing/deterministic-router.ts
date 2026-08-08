/**
 * Deterministic ModelRouter (AI-3.2/AI-3.3 — Tau Foundation v0.1).
 */

import type { ModelId } from '../types/context';
import { createUnknownHardwareProfile } from '../hardware/profile';
import type {
  RoutingRequest,
  RoutingResult,
  RoutingFailureCode,
} from './routing-types';
import { filterEligibleSubstrates } from './filters';
import { countRejectionsByReason } from './hardware-filter';
import { rankEligibleSubstrates, buildSelectionSummary } from './ranking';

export const DETERMINISTIC_ROUTING_POLICY_VERSION = 'ai-3.3-v1';

export class DeterministicModelRouter {
  route(request: RoutingRequest): RoutingResult {
    const timestamp = new Date().toISOString();
    const effectivePrivacy =
      request.systemPolicy?.privacyMode ?? request.privacyMode;
    const hardware = request.hardwareProfile ?? createUnknownHardwareProfile();

    const { eligible, rejected, hardwareCompatibilityById } = filterEligibleSubstrates(
      request.substrates,
      request.capability,
      request.privacyMode,
      hardware,
      request.systemPolicy,
    );

    if (eligible.length === 0) {
      const failureCode = resolveFailureCode(rejected, effectivePrivacy);
      return {
        success: false,
        requestId: request.requestId,
        capability: request.capability,
        privacyMode: effectivePrivacy,
        failureCode,
        failureSummary: buildFailureSummary(failureCode, effectivePrivacy, request.capability),
        eligibleSubstrateIds: [],
        rejectedSubstrates: rejected,
        routingPolicyVersion: DETERMINISTIC_ROUTING_POLICY_VERSION,
        timestamp,
      };
    }

    const ranked = rankEligibleSubstrates(
      eligible,
      effectivePrivacy,
      request.userPreferences,
      hardwareCompatibilityById,
    );
    const winner = ranked[0];
    const modelId = resolveModelId(winner.entry);
    const hardwareCompatibility =
      hardwareCompatibilityById.get(winner.entry.substrate.id) ?? 'UNKNOWN';

    return {
      success: true,
      requestId: request.requestId,
      capability: request.capability,
      privacyMode: effectivePrivacy,
      substrateId: winner.entry.substrate.id,
      modelId,
      selectionReasons: winner.selectionReasons,
      selectionSummary: buildSelectionSummary(winner.entry.substrate.id, winner.selectionReasons),
      hardwareCompatibility,
      eligibleSubstrateIds: ranked.map((r) => r.entry.substrate.id),
      rejectedSubstrates: rejected,
      routingPolicyVersion: DETERMINISTIC_ROUTING_POLICY_VERSION,
      timestamp,
    };
  }
}

/** Exposed for shadow metrics (AI-3.3). */
export function buildRoutingRejectionMetrics(rejected: { reason: string }[]) {
  return {
    hardwareRejected: countRejectionsByReason(rejected as never[], [
      'HARDWARE_INSUFFICIENT_RAM',
      'HARDWARE_INSUFFICIENT_VRAM',
      'HARDWARE_GPU_REQUIRED',
      'HARDWARE_ARCHITECTURE_MISMATCH',
      'HARDWARE_ENVIRONMENT_MISMATCH',
      'HARDWARE_INCOMPATIBLE',
    ]),
    privacyRejected: countRejectionsByReason(rejected as never[], [
      'PRIVACY_LOCAL_ONLY_VIOLATION',
    ]),
    capabilityRejected: countRejectionsByReason(rejected as never[], [
      'CAPABILITY_UNSUPPORTED',
      'CAPABILITY_UNKNOWN',
    ]),
  };
}

function resolveModelId(entry: { substrate: { listCapabilities: () => { id: string; available: boolean }[] }; defaultModelId?: ModelId }): ModelId {
  if (entry.defaultModelId) return entry.defaultModelId;
  const models = entry.substrate.listCapabilities().filter((m) => m.available);
  if (models.length > 0) return models[0].id;
  const all = entry.substrate.listCapabilities();
  return all[0]?.id ?? 'default';
}

function resolveFailureCode(
  rejected: { reason: string }[],
  privacyMode: string,
): RoutingFailureCode {
  if (privacyMode === 'LOCAL_ONLY') {
    if (rejected.some((r) => r.reason === 'PRIVACY_LOCAL_ONLY_VIOLATION')) {
      return 'LOCAL_ONLY_NO_MATCH';
    }
  }
  if (rejected.some((r) => r.reason.startsWith('HARDWARE_'))) {
    return 'HARDWARE_INCOMPATIBLE';
  }
  if (rejected.some((r) => r.reason === 'POLICY_DISALLOWED' || r.reason === 'POLICY_NOT_IN_ALLOWLIST')) {
    return 'POLICY_VIOLATION';
  }
  if (rejected.every((r) => r.reason === 'CAPABILITY_UNSUPPORTED' || r.reason === 'CAPABILITY_UNKNOWN')) {
    return 'CAPABILITY_UNSUPPORTED';
  }
  return 'NO_ELIGIBLE_SUBSTRATE';
}

function buildFailureSummary(
  code: RoutingFailureCode,
  privacyMode: string,
  capability: string,
): string {
  switch (code) {
    case 'LOCAL_ONLY_NO_MATCH':
      return `No eligible substrate. Reason: ${privacyMode} + NO_LOCAL_${capability}_CAPABLE_SUBSTRATE`;
    case 'CAPABILITY_UNSUPPORTED':
      return `No eligible substrate. Reason: CAPABILITY_${capability}_NOT_SUPPORTED`;
    case 'POLICY_VIOLATION':
      return 'No eligible substrate. Reason: POLICY_VIOLATION';
    case 'HARDWARE_INCOMPATIBLE':
      return 'No eligible substrate. Reason: HARDWARE_INCOMPATIBLE';
    default:
      return 'No eligible substrate. Reason: NO_ELIGIBLE_SUBSTRATE';
  }
}

export function createDeterministicModelRouter(): DeterministicModelRouter {
  return new DeterministicModelRouter();
}
