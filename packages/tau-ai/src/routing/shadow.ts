/**
 * Shadow routing mode (AI-3.2/AI-3.3) — log decisions only, never alter production.
 */

import type { RoutingRequest, ShadowRoutingLogEntry, ShadowRoutingMetrics } from './routing-types';
import { DeterministicModelRouter, buildRoutingRejectionMetrics } from './deterministic-router';

export type ShadowRoutingOptions = {
  log?: boolean;
  legacySubstrateId?: string;
  metrics?: Partial<ShadowRoutingMetrics>;
};

export function shadowRoute(
  request: RoutingRequest,
  router: DeterministicModelRouter = new DeterministicModelRouter(),
  options: ShadowRoutingOptions = {},
): ShadowRoutingLogEntry {
  const result = router.route(request);
  const rejectionMetrics = buildRoutingRejectionMetrics(result.rejectedSubstrates);
  const metrics: ShadowRoutingMetrics = {
    legacySubstrateId: options.legacySubstrateId,
    tauSubstrateId: result.success ? result.substrateId : undefined,
    routingAgreement:
      result.success && options.legacySubstrateId
        ? result.substrateId === options.legacySubstrateId
        : undefined,
    ...rejectionMetrics,
    ...options.metrics,
  };

  const entry: ShadowRoutingLogEntry = {
    ...result,
    shadow: true,
    productionPath: 'unchanged',
    metrics,
  };

  if (options.log && typeof console !== 'undefined' && console.debug) {
    if (result.success) {
      console.debug('[tau-ai/shadow-router]', JSON.stringify({
        requestId: result.requestId,
        capability: result.capability,
        privacyMode: result.privacyMode,
        success: true,
        selectedSubstrate: result.substrateId,
        hardwareCompatibility: result.hardwareCompatibility,
        selectionSummary: result.selectionSummary,
        eligibleSubstrates: result.eligibleSubstrateIds,
        rejectedCount: result.rejectedSubstrates.length,
        metrics,
        routingPolicyVersion: result.routingPolicyVersion,
        timestamp: result.timestamp,
      }));
    } else if ('failureCode' in result) {
      console.debug('[tau-ai/shadow-router]', JSON.stringify({
        requestId: result.requestId,
        capability: result.capability,
        privacyMode: result.privacyMode,
        success: false,
        failureCode: result.failureCode,
        failureSummary: result.failureSummary,
        rejectedCount: result.rejectedSubstrates.length,
        metrics,
        routingPolicyVersion: result.routingPolicyVersion,
        timestamp: result.timestamp,
      }));
    }
  }

  return entry;
}
