/**
 * Shadow routing from gateway substrates (AI-3.2/AI-3.3).
 * LOG ONLY — does not alter /api/tauai/chat or runAiChat().
 */

import {
  shadowRoute,
  createDeterministicModelRouter,
  createDefaultHardwareDetector,
  createUnknownHardwareProfile,
  type RoutingRequest,
  type ShadowRoutingLogEntry,
  type PrivacyMode,
  type CapabilityId,
  type UserRoutingPreferences,
  type SystemRoutingPolicy,
  type RoutableSubstrate,
} from '@tau/ai';
import { createSubstrateRegistry } from '@/lib/ai-gateway/substrate-registry';
import { PROVIDER_CONFIGS, pickAutoProvider } from '@/lib/ai-gateway/registry';

export function buildRoutableSubstratesFromGateway(): RoutableSubstrate[] {
  const registry = createSubstrateRegistry();
  return registry
    .list()
    .map((substrate) => {
      const config = PROVIDER_CONFIGS.find((c) => c.id === substrate.id);
      return {
        substrate,
        priority: config?.priority ?? 50,
        defaultModelId: config?.defaultModel,
      };
    })
    .sort((a, b) => a.substrate.id.localeCompare(b.substrate.id));
}

export type GatewayShadowRoutingInput = {
  requestId?: string;
  capability: CapabilityId;
  privacyMode: PrivacyMode;
  userPreferences?: UserRoutingPreferences;
  systemPolicy?: SystemRoutingPolicy;
};

/** Shadow route against live gateway substrate registry — production path unchanged. */
export function shadowRouteFromGateway(
  input: GatewayShadowRoutingInput,
  log = false,
): ShadowRoutingLogEntry {
  const detector = createDefaultHardwareDetector();
  const detected = detector.detect();
  const hardwareProfile =
    detected instanceof Promise ? createUnknownHardwareProfile() : detected;
  const legacySubstrateId = pickAutoProvider().id;

  const request: RoutingRequest = {
    ...input,
    substrates: buildRoutableSubstratesFromGateway(),
    hardwareProfile,
  };

  return shadowRoute(request, createDeterministicModelRouter(), {
    log,
    legacySubstrateId,
  });
}
