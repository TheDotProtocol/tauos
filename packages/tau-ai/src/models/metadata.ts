/**
 * Model substrate metadata types (AI-3.1 — Tau Foundation v0.1).
 *
 * Qualitative classifications only — no fabricated benchmarks or pricing.
 */

import type { CapabilityId, KnownCapability, Modality } from '../capabilities/types';
import type { InferenceRequirements } from '../hardware/requirements';

export type PrivacyClass = 'LOCAL' | 'REMOTE' | 'HYBRID' | 'UNKNOWN';

/** Operational / deployment availability — semantically distinct states. */
export type AvailabilityState =
  | 'AVAILABLE'
  | 'UNAVAILABLE'
  | 'REMOTE'
  | 'LOCAL'
  | 'NOT_CONFIGURED'
  | 'UNKNOWN';

export type HealthStatus =
  | 'HEALTHY'
  | 'DEGRADED'
  | 'UNAVAILABLE'
  | 'UNKNOWN';

export type CostClass = 'FREE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'UNKNOWN';

export type LatencyClass = 'LOW' | 'MEDIUM' | 'HIGH' | 'UNKNOWN';

/** Explicit capability support — never implicit. */
export type CapabilitySupport = 'SUPPORTED' | 'UNSUPPORTED' | 'UNKNOWN';

export type SubstrateCapabilityDeclaration = {
  capability: CapabilityId;
  support: CapabilitySupport;
};

/** Verification level — distinguishes metadata from live/production readiness. */
export type SubstrateVerificationLevel =
  | 'METADATA_VERIFIED'
  | 'ADAPTER_VERIFIED'
  | 'MODEL_LIVE_VERIFIED'
  | 'PRODUCTION_READY';

export type WeightsLocation = 'LOCAL' | 'REMOTE' | 'UNKNOWN';

/** Future provenance tracking — unknown values marked UNKNOWN. */
export type ModelProvenance = {
  modelId: string | 'UNKNOWN';
  modelFamily: string | 'UNKNOWN';
  provider: string | 'UNKNOWN';
  license: string | 'UNKNOWN';
  source: string | 'UNKNOWN';
  version: string | 'UNKNOWN';
  weightsLocation: WeightsLocation;
  architecture: string | 'UNKNOWN';
  modalities: Modality[] | 'UNKNOWN';
};

export type SubstrateMetadata = {
  /** Explicit capability declarations for all known capability ids. */
  capabilities: SubstrateCapabilityDeclaration[];
  privacyClass: PrivacyClass;
  costClass: CostClass;
  latencyClass: LatencyClass;
  /** Declared default availability (runtime may override via resolveAvailability). */
  availability: AvailabilityState;
  healthStatus: HealthStatus;
  provenance: ModelProvenance;
  verificationLevel: SubstrateVerificationLevel;
  /** Optional hardware compatibility requirements (AI-3.3). */
  inferenceRequirements?: InferenceRequirements;
};

export type SubstrateMetadataInput = Omit<SubstrateMetadata, 'capabilities'> & {
  supportedCapabilities?: KnownCapability[];
  unsupportedCapabilities?: KnownCapability[];
  unknownCapabilities?: KnownCapability[];
  inferenceRequirements?: InferenceRequirements;
};
