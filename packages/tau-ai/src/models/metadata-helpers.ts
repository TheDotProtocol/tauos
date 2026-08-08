/**
 * Substrate metadata helpers (AI-3.1).
 */

import { TAU_CAPABILITIES, type KnownCapability } from '../capabilities/types';
import type {
  AvailabilityState,
  CapabilitySupport,
  SubstrateCapabilityDeclaration,
  SubstrateMetadata,
  SubstrateMetadataInput,
} from './metadata';

const ALL_KNOWN_CAPABILITIES = Object.values(TAU_CAPABILITIES) as KnownCapability[];

export function declareCapabilities(
  supported: KnownCapability[] = [],
  unsupported: KnownCapability[] = [],
): SubstrateCapabilityDeclaration[] {
  const supportedSet = new Set(supported);
  const unsupportedSet = new Set(unsupported);

  return ALL_KNOWN_CAPABILITIES.map((capability) => {
    let support: CapabilitySupport = 'UNKNOWN';
    if (supportedSet.has(capability)) support = 'SUPPORTED';
    else if (unsupportedSet.has(capability)) support = 'UNSUPPORTED';
    return { capability, support };
  });
}

export function buildSubstrateMetadata(input: SubstrateMetadataInput): SubstrateMetadata {
  const {
    supportedCapabilities = [],
    unsupportedCapabilities = [],
    ...rest
  } = input;

  return {
    ...rest,
    capabilities: declareCapabilities(supportedCapabilities, unsupportedCapabilities),
  };
}

/**
 * Resolve runtime availability from declared metadata + configuration state.
 * Declared capability ≠ runtime availability.
 */
export function resolveAvailability(
  metadata: SubstrateMetadata,
  isConfigured: boolean,
): AvailabilityState {
  if (!isConfigured) return 'NOT_CONFIGURED';
  if (metadata.availability === 'UNAVAILABLE') return 'UNAVAILABLE';
  if (metadata.availability === 'AVAILABLE') return 'AVAILABLE';
  if (metadata.privacyClass === 'LOCAL') return 'LOCAL';
  if (metadata.privacyClass === 'REMOTE') return 'REMOTE';
  return metadata.availability;
}

export function supportsCapability(
  metadata: SubstrateMetadata,
  capability: KnownCapability,
): CapabilitySupport {
  return (
    metadata.capabilities.find((c) => c.capability === capability)?.support ?? 'UNKNOWN'
  );
}

export function getSupportedCapabilities(
  metadata: SubstrateMetadata,
): KnownCapability[] {
  return metadata.capabilities
    .filter((c): c is SubstrateCapabilityDeclaration & { capability: KnownCapability } =>
      (Object.values(TAU_CAPABILITIES) as string[]).includes(c.capability) &&
      c.support === 'SUPPORTED',
    )
    .map((c) => c.capability as KnownCapability);
}
