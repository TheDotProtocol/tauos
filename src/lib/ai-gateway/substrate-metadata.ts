/**
 * Declared metadata for each ai-gateway provider substrate (AI-3.1).
 *
 * METADATA VERIFIED only — no fabricated licenses, benchmarks, or pricing.
 * Open model families (Qwen, Llama, etc.) are third-party substrates when
 * served via Ollama/vLLM — not Tau models.
 */

import {
  TAU_CAPABILITIES,
  buildSubstrateMetadata,
  type SubstrateMetadata,
} from '@tau/ai';
import type { AiProviderId } from './types';
import {
  REMOTE_CLIENT_INFERENCE_REQUIREMENTS,
  OLLAMA_RUNTIME_INFERENCE_REQUIREMENTS,
  FALLBACK_INFERENCE_REQUIREMENTS,
  VLLM_RUNTIME_INFERENCE_REQUIREMENTS,
  TAU_FOUNDATION_INFERENCE_REQUIREMENTS,
} from './inference-requirements';

const UNKNOWN_PROVENANCE = {
  modelId: 'UNKNOWN' as const,
  modelFamily: 'UNKNOWN' as const,
  provider: 'UNKNOWN' as const,
  license: 'UNKNOWN' as const,
  source: 'UNKNOWN' as const,
  version: 'UNKNOWN' as const,
  weightsLocation: 'UNKNOWN' as const,
  architecture: 'UNKNOWN' as const,
  modalities: 'UNKNOWN' as const,
};

export const PROVIDER_SUBSTRATE_METADATA: Record<AiProviderId, SubstrateMetadata> = {
  openai: buildSubstrateMetadata({
    supportedCapabilities: [
      TAU_CAPABILITIES.TEXT_REASONING,
      TAU_CAPABILITIES.CODE,
      TAU_CAPABILITIES.IMAGE_UNDERSTANDING,
    ],
    unsupportedCapabilities: [
      TAU_CAPABILITIES.IMAGE_GENERATION,
      TAU_CAPABILITIES.VIDEO_GENERATION,
      TAU_CAPABILITIES.SPEECH_TO_TEXT,
      TAU_CAPABILITIES.TEXT_TO_SPEECH,
    ],
    privacyClass: 'REMOTE',
    costClass: 'UNKNOWN',
    latencyClass: 'UNKNOWN',
    availability: 'REMOTE',
    healthStatus: 'UNKNOWN',
    verificationLevel: 'ADAPTER_VERIFIED',
    inferenceRequirements: REMOTE_CLIENT_INFERENCE_REQUIREMENTS,
    provenance: {
      ...UNKNOWN_PROVENANCE,
      provider: 'openai',
      source: 'THIRD_PARTY_API',
      weightsLocation: 'REMOTE',
      modalities: ['text', 'image'],
    },
  }),

  anthropic: buildSubstrateMetadata({
    supportedCapabilities: [
      TAU_CAPABILITIES.TEXT_REASONING,
      TAU_CAPABILITIES.CODE,
      TAU_CAPABILITIES.IMAGE_UNDERSTANDING,
    ],
    unsupportedCapabilities: [
      TAU_CAPABILITIES.IMAGE_GENERATION,
      TAU_CAPABILITIES.VIDEO_GENERATION,
      TAU_CAPABILITIES.SPEECH_TO_TEXT,
      TAU_CAPABILITIES.TEXT_TO_SPEECH,
    ],
    privacyClass: 'REMOTE',
    costClass: 'UNKNOWN',
    latencyClass: 'UNKNOWN',
    availability: 'REMOTE',
    healthStatus: 'UNKNOWN',
    verificationLevel: 'ADAPTER_VERIFIED',
    inferenceRequirements: REMOTE_CLIENT_INFERENCE_REQUIREMENTS,
    provenance: {
      ...UNKNOWN_PROVENANCE,
      provider: 'anthropic',
      source: 'THIRD_PARTY_API',
      weightsLocation: 'REMOTE',
      modalities: ['text', 'image'],
    },
  }),

  gemini: buildSubstrateMetadata({
    supportedCapabilities: [
      TAU_CAPABILITIES.TEXT_REASONING,
      TAU_CAPABILITIES.CODE,
      TAU_CAPABILITIES.IMAGE_UNDERSTANDING,
    ],
    unsupportedCapabilities: [
      TAU_CAPABILITIES.IMAGE_GENERATION,
      TAU_CAPABILITIES.VIDEO_GENERATION,
    ],
    privacyClass: 'REMOTE',
    costClass: 'UNKNOWN',
    latencyClass: 'UNKNOWN',
    availability: 'REMOTE',
    healthStatus: 'UNKNOWN',
    verificationLevel: 'ADAPTER_VERIFIED',
    inferenceRequirements: REMOTE_CLIENT_INFERENCE_REQUIREMENTS,
    provenance: {
      ...UNKNOWN_PROVENANCE,
      provider: 'google',
      source: 'THIRD_PARTY_API',
      weightsLocation: 'REMOTE',
      modalities: ['text', 'image'],
    },
  }),

  deepseek: buildSubstrateMetadata({
    supportedCapabilities: [
      TAU_CAPABILITIES.TEXT_REASONING,
      TAU_CAPABILITIES.CODE,
    ],
    privacyClass: 'REMOTE',
    costClass: 'UNKNOWN',
    latencyClass: 'UNKNOWN',
    availability: 'REMOTE',
    healthStatus: 'UNKNOWN',
    verificationLevel: 'ADAPTER_VERIFIED',
    inferenceRequirements: REMOTE_CLIENT_INFERENCE_REQUIREMENTS,
    provenance: {
      ...UNKNOWN_PROVENANCE,
      modelFamily: 'DEEPSEEK',
      provider: 'deepseek',
      source: 'THIRD_PARTY_API',
      weightsLocation: 'REMOTE',
      modalities: ['text'],
    },
  }),

  openrouter: buildSubstrateMetadata({
    supportedCapabilities: [TAU_CAPABILITIES.TEXT_REASONING],
    privacyClass: 'REMOTE',
    costClass: 'UNKNOWN',
    latencyClass: 'UNKNOWN',
    availability: 'REMOTE',
    healthStatus: 'UNKNOWN',
    verificationLevel: 'ADAPTER_VERIFIED',
    inferenceRequirements: REMOTE_CLIENT_INFERENCE_REQUIREMENTS,
    provenance: {
      ...UNKNOWN_PROVENANCE,
      provider: 'openrouter',
      source: 'THIRD_PARTY_AGGREGATOR',
      weightsLocation: 'REMOTE',
      modalities: ['text'],
    },
  }),

  'azure-openai': buildSubstrateMetadata({
    supportedCapabilities: [
      TAU_CAPABILITIES.TEXT_REASONING,
      TAU_CAPABILITIES.CODE,
    ],
    privacyClass: 'REMOTE',
    costClass: 'UNKNOWN',
    latencyClass: 'UNKNOWN',
    availability: 'REMOTE',
    healthStatus: 'UNKNOWN',
    verificationLevel: 'ADAPTER_VERIFIED',
    inferenceRequirements: REMOTE_CLIENT_INFERENCE_REQUIREMENTS,
    provenance: {
      ...UNKNOWN_PROVENANCE,
      provider: 'azure-openai',
      source: 'THIRD_PARTY_API',
      weightsLocation: 'REMOTE',
      modalities: ['text'],
    },
  }),

  ollama: buildSubstrateMetadata({
    supportedCapabilities: [TAU_CAPABILITIES.TEXT_REASONING],
    privacyClass: 'LOCAL',
    costClass: 'FREE',
    latencyClass: 'UNKNOWN',
    availability: 'LOCAL',
    healthStatus: 'UNKNOWN',
    verificationLevel: 'ADAPTER_VERIFIED',
    inferenceRequirements: OLLAMA_RUNTIME_INFERENCE_REQUIREMENTS,
    provenance: {
      modelId: 'UNKNOWN',
      modelFamily: 'UNKNOWN',
      provider: 'ollama',
      license: 'UNKNOWN',
      source: 'OPEN_MODEL_SUBSTRATE',
      version: 'UNKNOWN',
      weightsLocation: 'LOCAL',
      architecture: 'UNKNOWN',
      modalities: ['text'],
    },
  }),

  'tau-ai': buildSubstrateMetadata({
    supportedCapabilities: [],
    privacyClass: 'UNKNOWN',
    costClass: 'UNKNOWN',
    latencyClass: 'UNKNOWN',
    availability: 'NOT_CONFIGURED',
    healthStatus: 'UNKNOWN',
    verificationLevel: 'METADATA_VERIFIED',
    inferenceRequirements: TAU_FOUNDATION_INFERENCE_REQUIREMENTS,
    provenance: {
      modelId: 'UNKNOWN',
      modelFamily: 'TAU_FOUNDATION_MODEL',
      provider: 'tau',
      license: 'UNKNOWN',
      source: 'TAU_FOUNDATION_MODEL_TRACK',
      version: 'UNKNOWN',
      weightsLocation: 'UNKNOWN',
      architecture: 'UNKNOWN',
      modalities: ['text'],
    },
  }),

  fallback: buildSubstrateMetadata({
    supportedCapabilities: [TAU_CAPABILITIES.TEXT_REASONING],
    unsupportedCapabilities: [
      TAU_CAPABILITIES.CODE,
      TAU_CAPABILITIES.IMAGE_UNDERSTANDING,
      TAU_CAPABILITIES.IMAGE_GENERATION,
      TAU_CAPABILITIES.VIDEO_GENERATION,
      TAU_CAPABILITIES.SPEECH_TO_TEXT,
      TAU_CAPABILITIES.TEXT_TO_SPEECH,
      TAU_CAPABILITIES.EMBEDDING,
      TAU_CAPABILITIES.GENERAL_TOOL_USE,
    ],
    privacyClass: 'LOCAL',
    costClass: 'FREE',
    latencyClass: 'LOW',
    availability: 'AVAILABLE',
    healthStatus: 'HEALTHY',
    verificationLevel: 'ADAPTER_VERIFIED',
    inferenceRequirements: FALLBACK_INFERENCE_REQUIREMENTS,
    provenance: {
      modelId: 'tau-fallback',
      modelFamily: 'TAU_OFFLINE_FALLBACK',
      provider: 'tau',
      license: 'UNKNOWN',
      source: 'TAU_PRODUCT_LAYER',
      version: 'UNKNOWN',
      weightsLocation: 'LOCAL',
      architecture: 'UNKNOWN',
      modalities: ['text'],
    },
  }),
};

export const VLLM_SUBSTRATE_METADATA: SubstrateMetadata = buildSubstrateMetadata({
  supportedCapabilities: [],
  privacyClass: 'LOCAL',
  costClass: 'FREE',
  latencyClass: 'UNKNOWN',
  availability: 'NOT_CONFIGURED',
  healthStatus: 'UNKNOWN',
  verificationLevel: 'METADATA_VERIFIED',
  inferenceRequirements: VLLM_RUNTIME_INFERENCE_REQUIREMENTS,
  provenance: {
    modelId: 'UNKNOWN',
    modelFamily: 'UNKNOWN',
    provider: 'vllm',
    license: 'UNKNOWN',
    source: 'OPEN_MODEL_SUBSTRATE',
    version: 'UNKNOWN',
    weightsLocation: 'LOCAL',
    architecture: 'UNKNOWN',
    modalities: ['text'],
  },
});

export function getProviderSubstrateMetadata(id: AiProviderId): SubstrateMetadata {
  return PROVIDER_SUBSTRATE_METADATA[id];
}
