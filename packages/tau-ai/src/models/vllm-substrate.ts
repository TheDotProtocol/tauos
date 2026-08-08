/**
 * vLLM substrate contract stub (packages/tau-ai).
 * Full implementation deferred — metadata-ready (AI-3.1).
 */

import type { ModelSubstrate, ModelCapability } from './substrate';
import { buildSubstrateMetadata } from './metadata-helpers';

export const VLLM_SUBSTRATE_ID = 'vllm';

export type VLLMSubstrateConfig = {
  baseUrl?: string;
  model?: string;
};

export function createVLLMSubstrateMetadata() {
  return buildSubstrateMetadata({
    supportedCapabilities: [],
    privacyClass: 'LOCAL',
    costClass: 'FREE',
    latencyClass: 'UNKNOWN',
    availability: 'NOT_CONFIGURED',
    healthStatus: 'UNKNOWN',
    verificationLevel: 'METADATA_VERIFIED',
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
}

export function createVLLMSubstrateStub(config: VLLMSubstrateConfig = {}): ModelSubstrate {
  const baseUrl = config.baseUrl ?? process.env.VLLM_BASE_URL ?? process.env.VLLM_HOST;
  const model = config.model ?? process.env.VLLM_MODEL ?? 'default';
  const metadata = createVLLMSubstrateMetadata();
  const configured = Boolean(baseUrl);

  return {
    id: VLLM_SUBSTRATE_ID,
    kind: 'local',
    label: 'vLLM (Local Serving)',
    metadata,
    isConfigured: () => configured,
    getAvailability: () => (configured ? 'LOCAL' : 'NOT_CONFIGURED'),
    listCapabilities: (): ModelCapability[] => [
      {
        id: model,
        label: `vLLM (${model})`,
        available: configured,
        supportsStreaming: true,
      },
    ],
    async complete() {
      throw new Error('vLLM substrate implementation pending (AI-3.1 stub).');
    },
  };
}

/** Shared metadata for open-model families routable via vLLM (capability unknown until model selected). */
export const VLLM_OPEN_MODEL_FAMILIES = [
  'QWEN',
  'DEEPSEEK',
  'LLAMA',
  'MISTRAL',
  'GEMMA',
] as const;
