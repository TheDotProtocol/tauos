/**
 * Deterministic routing request types (AI-3.2).
 */

import type { CapabilityId } from '../capabilities/types';
import type { HardwareProfile, HardwareCompatibility } from '../hardware/types';
import type { ModelSubstrate } from '../models/substrate';
import type { ModelId, SubstrateId, TauAIAppId, TauAIUserId } from '../types/context';

export const ROUTING_POLICY_VERSION = 'ai-3.3-v1';

export type PrivacyMode = 'LOCAL_ONLY' | 'PREFER_LOCAL' | 'REMOTE_ALLOWED' | 'ANY';

export type CostPreference = 'PREFER_FREE' | 'PREFER_LOW' | 'ANY';

export type LatencyPreference = 'PREFER_LOW' | 'ANY';

export type UserRoutingPreferences = {
  preferredSubstrateId?: SubstrateId;
  preferredProvider?: string;
  preferredModelFamily?: string;
  preferLocal?: boolean;
  costPreference?: CostPreference;
  latencyPreference?: LatencyPreference;
};

export type SystemRoutingPolicy = {
  privacyMode?: PrivacyMode;
  requiredCapability?: CapabilityId;
  disallowedSubstrateIds?: SubstrateId[];
  allowedSubstrateIds?: SubstrateId[];
  minimumAvailability?: 'AVAILABLE' | 'LOCAL' | 'REMOTE';
};

/** Substrate entry supplied to the router — priority is explicit and stable. */
export type RoutableSubstrate = {
  substrate: ModelSubstrate;
  /** Lower number = higher priority (matches gateway PROVIDER_CONFIGS). */
  priority: number;
  defaultModelId?: ModelId;
};

export type RoutingRequest = {
  requestId?: string;
  capability: CapabilityId;
  privacyMode: PrivacyMode;
  substrates: RoutableSubstrate[];
  /** Defaults to unknown profile when omitted (AI-3.3). */
  hardwareProfile?: HardwareProfile;
  userPreferences?: UserRoutingPreferences;
  systemPolicy?: SystemRoutingPolicy;
  userId?: TauAIUserId;
  appId?: TauAIAppId;
};

export type RejectionReason =
  | 'POLICY_DISALLOWED'
  | 'POLICY_NOT_IN_ALLOWLIST'
  | 'PRIVACY_LOCAL_ONLY_VIOLATION'
  | 'AVAILABILITY_NOT_CONFIGURED'
  | 'AVAILABILITY_UNAVAILABLE'
  | 'AVAILABILITY_UNKNOWN'
  | 'CAPABILITY_UNSUPPORTED'
  | 'CAPABILITY_UNKNOWN'
  | 'HARDWARE_INSUFFICIENT_RAM'
  | 'HARDWARE_INSUFFICIENT_VRAM'
  | 'HARDWARE_GPU_REQUIRED'
  | 'HARDWARE_ARCHITECTURE_MISMATCH'
  | 'HARDWARE_ENVIRONMENT_MISMATCH'
  | 'HARDWARE_INCOMPATIBLE';

export type SubstrateRejection = {
  substrateId: SubstrateId;
  reason: RejectionReason;
  detail?: string;
};

export type SelectionReasonCode =
  | 'CAPABILITY_MATCH'
  | 'PRIVACY_COMPLIANT'
  | 'AVAILABLE'
  | 'HARDWARE_COMPATIBLE'
  | 'HARDWARE_COMPATIBILITY_UNKNOWN'
  | 'USER_PREFERRED_SUBSTRATE'
  | 'PREFER_LOCAL'
  | 'COST_PREFERENCE'
  | 'LATENCY_PREFERENCE'
  | 'STABLE_PRIORITY'
  | 'STABLE_ID_TIEBREAK';

export type RoutingSuccess = {
  success: true;
  requestId?: string;
  capability: CapabilityId;
  privacyMode: PrivacyMode;
  substrateId: SubstrateId;
  modelId: ModelId;
  selectionReasons: SelectionReasonCode[];
  selectionSummary: string;
  hardwareCompatibility: HardwareCompatibility;
  eligibleSubstrateIds: SubstrateId[];
  rejectedSubstrates: SubstrateRejection[];
  routingPolicyVersion: string;
  timestamp: string;
};

export type RoutingFailureCode =
  | 'NO_ELIGIBLE_SUBSTRATE'
  | 'LOCAL_ONLY_NO_MATCH'
  | 'CAPABILITY_UNSUPPORTED'
  | 'POLICY_VIOLATION'
  | 'HARDWARE_INCOMPATIBLE';

export type ShadowRoutingMetrics = {
  legacySubstrateId?: SubstrateId;
  tauSubstrateId?: SubstrateId;
  routingAgreement?: boolean;
  hardwareRejected: number;
  privacyRejected: number;
  capabilityRejected: number;
};

export type RoutingFailure = {
  success: false;
  requestId?: string;
  capability: CapabilityId;
  privacyMode: PrivacyMode;
  failureCode: RoutingFailureCode;
  failureSummary: string;
  eligibleSubstrateIds: SubstrateId[];
  rejectedSubstrates: SubstrateRejection[];
  routingPolicyVersion: string;
  timestamp: string;
};

export type RoutingResult = RoutingSuccess | RoutingFailure;

/** Shadow-mode log entry — metadata only, no message content. */
export type ShadowRoutingLogEntry = RoutingResult & {
  shadow: true;
  productionPath: 'unchanged';
  metrics?: ShadowRoutingMetrics;
};
