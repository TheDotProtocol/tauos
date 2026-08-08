/**
 * Deterministic routing filters (AI-3.2) — hard constraints, fail closed.
 */

import type { CapabilityId } from '../capabilities/types';
import type { HardwareProfile, HardwareCompatibility } from '../hardware/types';
import { createUnknownHardwareProfile } from '../hardware/profile';
import type { AvailabilityState, CapabilitySupport } from '../models/metadata';
import type {
  PrivacyMode,
  RejectionReason,
  RoutableSubstrate,
  SubstrateRejection,
  SystemRoutingPolicy,
} from './routing-types';
import { passesHardwareFilter } from './hardware-filter';

const ELIGIBLE_AVAILABILITY = new Set<AvailabilityState>([
  'AVAILABLE',
  'LOCAL',
  'REMOTE',
]);

export function getRuntimeAvailability(entry: RoutableSubstrate): AvailabilityState {
  const { substrate } = entry;
  if (substrate.getAvailability) return substrate.getAvailability();
  return substrate.isConfigured()
    ? substrate.metadata.availability
    : 'NOT_CONFIGURED';
}

export function isLocalSubstrate(entry: RoutableSubstrate): boolean {
  return entry.substrate.metadata.privacyClass === 'LOCAL';
}

export function isRemoteSubstrate(entry: RoutableSubstrate): boolean {
  return entry.substrate.metadata.privacyClass === 'REMOTE';
}

export function passesPrivacyFilter(
  entry: RoutableSubstrate,
  privacyMode: PrivacyMode,
): { pass: boolean; reason?: RejectionReason } {
  if (privacyMode === 'LOCAL_ONLY' && !isLocalSubstrate(entry)) {
    return { pass: false, reason: 'PRIVACY_LOCAL_ONLY_VIOLATION' };
  }
  return { pass: true };
}

export function passesAvailabilityFilter(
  entry: RoutableSubstrate,
): { pass: boolean; reason?: RejectionReason; availability: AvailabilityState } {
  const availability = getRuntimeAvailability(entry);

  if (availability === 'NOT_CONFIGURED') {
    return { pass: false, reason: 'AVAILABILITY_NOT_CONFIGURED', availability };
  }
  if (availability === 'UNAVAILABLE') {
    return { pass: false, reason: 'AVAILABILITY_UNAVAILABLE', availability };
  }
  if (availability === 'UNKNOWN') {
    return { pass: false, reason: 'AVAILABILITY_UNKNOWN', availability };
  }
  if (!ELIGIBLE_AVAILABILITY.has(availability)) {
    return { pass: false, reason: 'AVAILABILITY_UNKNOWN', availability };
  }
  return { pass: true, availability };
}

export function getCapabilitySupport(
  entry: RoutableSubstrate,
  capability: CapabilityId,
): CapabilitySupport {
  const found = entry.substrate.metadata.capabilities.find(
    (c) => c.capability === capability,
  );
  return found?.support ?? 'UNKNOWN';
}

export function passesCapabilityFilter(
  entry: RoutableSubstrate,
  capability: CapabilityId,
): { pass: boolean; reason?: RejectionReason } {
  const support = getCapabilitySupport(entry, capability);
  if (support === 'SUPPORTED') return { pass: true };
  if (support === 'UNSUPPORTED') {
    return { pass: false, reason: 'CAPABILITY_UNSUPPORTED' };
  }
  return { pass: false, reason: 'CAPABILITY_UNKNOWN' };
}

export function passesSystemPolicy(
  entry: RoutableSubstrate,
  policy?: SystemRoutingPolicy,
): { pass: boolean; reason?: RejectionReason } {
  if (!policy) return { pass: true };

  const id = entry.substrate.id;
  if (policy.disallowedSubstrateIds?.includes(id)) {
    return { pass: false, reason: 'POLICY_DISALLOWED' };
  }
  if (
    policy.allowedSubstrateIds &&
    policy.allowedSubstrateIds.length > 0 &&
    !policy.allowedSubstrateIds.includes(id)
  ) {
    return { pass: false, reason: 'POLICY_NOT_IN_ALLOWLIST' };
  }
  return { pass: true };
}

export function evaluateSubstrate(
  entry: RoutableSubstrate,
  capability: CapabilityId,
  privacyMode: PrivacyMode,
  hardware: HardwareProfile,
  systemPolicy?: SystemRoutingPolicy,
): {
  eligible: boolean;
  rejection?: SubstrateRejection;
  hardwareCompatibility?: HardwareCompatibility;
} {
  const policyCheck = passesSystemPolicy(entry, systemPolicy);
  if (!policyCheck.pass) {
    return {
      eligible: false,
      rejection: {
        substrateId: entry.substrate.id,
        reason: policyCheck.reason!,
      },
    };
  }

  const effectivePrivacy = systemPolicy?.privacyMode ?? privacyMode;
  const privacyCheck = passesPrivacyFilter(entry, effectivePrivacy);
  if (!privacyCheck.pass) {
    return {
      eligible: false,
      rejection: {
        substrateId: entry.substrate.id,
        reason: privacyCheck.reason!,
      },
    };
  }

  const availabilityCheck = passesAvailabilityFilter(entry);
  if (!availabilityCheck.pass) {
    return {
      eligible: false,
      rejection: {
        substrateId: entry.substrate.id,
        reason: availabilityCheck.reason!,
        detail: availabilityCheck.availability,
      },
    };
  }

  const hardwareCheck = passesHardwareFilter(entry, hardware);
  if (!hardwareCheck.pass) {
    return {
      eligible: false,
      rejection: hardwareCheck.rejection,
    };
  }

  const capabilityCheck = passesCapabilityFilter(entry, capability);
  if (!capabilityCheck.pass) {
    return {
      eligible: false,
      rejection: {
        substrateId: entry.substrate.id,
        reason: capabilityCheck.reason!,
      },
    };
  }

  return {
    eligible: true,
    hardwareCompatibility: hardwareCheck.compatibility,
  };
}

export function filterEligibleSubstrates(
  substrates: RoutableSubstrate[],
  capability: CapabilityId,
  privacyMode: PrivacyMode,
  hardware: HardwareProfile = createUnknownHardwareProfile(),
  systemPolicy?: SystemRoutingPolicy,
): {
  eligible: RoutableSubstrate[];
  rejected: SubstrateRejection[];
  hardwareCompatibilityById: Map<string, HardwareCompatibility>;
} {
  const eligible: RoutableSubstrate[] = [];
  const rejected: SubstrateRejection[] = [];
  const hardwareCompatibilityById = new Map<string, HardwareCompatibility>();

  const sorted = [...substrates].sort((a, b) =>
    a.substrate.id.localeCompare(b.substrate.id),
  );

  for (const entry of sorted) {
    const result = evaluateSubstrate(
      entry,
      capability,
      privacyMode,
      hardware,
      systemPolicy,
    );
    if (result.eligible) {
      eligible.push(entry);
      hardwareCompatibilityById.set(
        entry.substrate.id,
        result.hardwareCompatibility ?? 'UNKNOWN',
      );
    } else if (result.rejection) {
      rejected.push(result.rejection);
    }
  }

  return { eligible, rejected, hardwareCompatibilityById };
}
