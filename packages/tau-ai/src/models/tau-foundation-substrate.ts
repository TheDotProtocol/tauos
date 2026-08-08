/**
 * Tau Foundation Model substrate placeholder (AI-3.1).
 *
 * First-class substrate for future Tau-owned/derived model weights.
 * NOT trained or deployed in this milestone — metadata only.
 */

import { TAU_CAPABILITIES } from '../capabilities/types';
import type { ModelSubstrate, ModelCapability } from './substrate';
import { buildSubstrateMetadata } from './metadata-helpers';

export const TAU_FOUNDATION_SUBSTRATE_ID = 'tau-foundation';

export function createTauFoundationSubstrateStub(): ModelSubstrate {
  const metadata = buildSubstrateMetadata({
    supportedCapabilities: [
      TAU_CAPABILITIES.TEXT_REASONING,
      TAU_CAPABILITIES.CODE,
      TAU_CAPABILITIES.GENERAL_TOOL_USE,
    ],
    unsupportedCapabilities: [
      TAU_CAPABILITIES.IMAGE_GENERATION,
      TAU_CAPABILITIES.VIDEO_GENERATION,
    ],
    privacyClass: 'UNKNOWN',
    costClass: 'UNKNOWN',
    latencyClass: 'UNKNOWN',
    availability: 'NOT_CONFIGURED',
    healthStatus: 'UNKNOWN',
    verificationLevel: 'METADATA_VERIFIED',
    provenance: {
      modelId: 'tau-foundation',
      modelFamily: 'TAU_FOUNDATION_MODEL',
      provider: 'tau',
      license: 'UNKNOWN',
      source: 'TAU_FOUNDATION_MODEL_TRACK',
      version: 'UNKNOWN',
      weightsLocation: 'UNKNOWN',
      architecture: 'UNKNOWN',
      modalities: ['text', 'tool'],
    },
  });

  return {
    id: TAU_FOUNDATION_SUBSTRATE_ID,
    kind: 'foundation',
    label: 'Tau Foundation Model',
    metadata,
    isConfigured: () => false,
    getAvailability: () => 'NOT_CONFIGURED',
    listCapabilities: (): ModelCapability[] => [
      {
        id: 'tau-foundation',
        label: 'Tau Foundation Model (placeholder)',
        available: false,
        supportsStreaming: true,
      },
    ],
    async complete() {
      throw new Error(
        'Tau Foundation Model is not available yet. Await Tau Foundation Model development track.',
      );
    },
  };
}
