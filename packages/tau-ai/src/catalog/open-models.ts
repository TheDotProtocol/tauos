/**
 * Open model catalog — families, runtimes, and substrate distinctions (AI-3.4).
 *
 * CATALOG ONLY — no models downloaded. Requirements UNKNOWN unless verified.
 */

import { TAU_CAPABILITIES } from '../capabilities/types';
import type { OpenModelCatalog } from './types';

const UNKNOWN_REQ = {
  gpuRequired: 'UNKNOWN' as const,
  minimumSystemMemoryBytes: 'UNKNOWN' as const,
  minimumGpuMemoryBytes: 'UNKNOWN' as const,
  minimumCpuCores: 'UNKNOWN' as const,
  supportedArchitectures: 'UNKNOWN' as const,
  supportedEnvironments: 'UNKNOWN' as const,
  preferredAccelerator: 'UNKNOWN' as const,
};

export const OPEN_MODEL_CATALOG: OpenModelCatalog = {
  runtimes: [
    {
      id: 'ollama',
      label: 'Ollama',
      role: 'INFERENCE_RUNTIME',
      inferenceRequirements: {
        gpuRequired: 'UNKNOWN',
        minimumSystemMemoryBytes: 'UNKNOWN',
        minimumGpuMemoryBytes: 'UNKNOWN',
        minimumCpuCores: 'UNKNOWN',
        supportedArchitectures: ['ARM64', 'X86_64'],
        supportedEnvironments: ['MACOS', 'LINUX', 'WINDOWS'],
        preferredAccelerator: 'UNKNOWN',
      },
      verificationLevel: 'METADATA_VERIFIED',
      notes: 'Runtime OS/arch support from Ollama project documentation. Per-model requirements UNKNOWN.',
    },
    {
      id: 'vllm',
      label: 'vLLM',
      role: 'INFERENCE_RUNTIME',
      inferenceRequirements: UNKNOWN_REQ,
      verificationLevel: 'METADATA_VERIFIED',
      notes: 'Stub only — not deployed. Requirements UNKNOWN until configured.',
    },
    {
      id: 'api',
      label: 'Remote API',
      role: 'INFERENCE_RUNTIME',
      inferenceRequirements: {
        gpuRequired: false,
        minimumSystemMemoryBytes: 'UNKNOWN',
        minimumGpuMemoryBytes: 'UNKNOWN',
        minimumCpuCores: 'UNKNOWN',
        supportedArchitectures: 'UNKNOWN',
        supportedEnvironments: 'UNKNOWN',
        preferredAccelerator: 'UNKNOWN',
      },
      verificationLevel: 'METADATA_VERIFIED',
      notes: 'Client-side GPU not required — inference on provider infrastructure.',
    },
  ],

  families: [
    {
      id: 'qwen',
      family: 'QWEN',
      label: 'Qwen (third-party)',
      exampleModelIds: ['qwen2.5', 'qwen2.5-coder'],
      typicalCapabilities: [TAU_CAPABILITIES.TEXT_REASONING, TAU_CAPABILITIES.CODE],
      inferenceRuntimes: ['ollama', 'vllm', 'openrouter'],
      license: 'UNKNOWN',
      inferenceRequirements: UNKNOWN_REQ,
      verificationLevel: 'CATALOG_ONLY',
      notes: 'Third-party model family — not a Tau model. Per-checkpoint requirements UNKNOWN.',
    },
    {
      id: 'deepseek',
      family: 'DEEPSEEK',
      label: 'DeepSeek (third-party)',
      exampleModelIds: ['deepseek-chat', 'deepseek-coder'],
      typicalCapabilities: [TAU_CAPABILITIES.TEXT_REASONING, TAU_CAPABILITIES.CODE],
      inferenceRuntimes: ['api', 'openrouter'],
      license: 'UNKNOWN',
      inferenceRequirements: UNKNOWN_REQ,
      verificationLevel: 'CATALOG_ONLY',
      notes: 'DeepSeek API adapter ADAPTER VERIFIED. Local weights requirements UNKNOWN.',
    },
    {
      id: 'llama',
      family: 'LLAMA',
      label: 'Llama (third-party)',
      exampleModelIds: ['llama3.2', 'llama3.1'],
      typicalCapabilities: [TAU_CAPABILITIES.TEXT_REASONING],
      inferenceRuntimes: ['ollama', 'vllm'],
      license: 'UNKNOWN',
      inferenceRequirements: UNKNOWN_REQ,
      verificationLevel: 'CATALOG_ONLY',
      notes: 'Meta Llama family — third-party substrate when served locally.',
    },
    {
      id: 'mistral',
      family: 'MISTRAL',
      label: 'Mistral (third-party)',
      exampleModelIds: ['mistral', 'codestral'],
      typicalCapabilities: [TAU_CAPABILITIES.TEXT_REASONING, TAU_CAPABILITIES.CODE],
      inferenceRuntimes: ['ollama', 'api'],
      license: 'UNKNOWN',
      inferenceRequirements: UNKNOWN_REQ,
      verificationLevel: 'CATALOG_ONLY',
      notes: 'Third-party model family.',
    },
    {
      id: 'gemma',
      family: 'GEMMA',
      label: 'Gemma (third-party)',
      exampleModelIds: ['gemma2'],
      typicalCapabilities: [TAU_CAPABILITIES.TEXT_REASONING],
      inferenceRuntimes: ['ollama'],
      license: 'UNKNOWN',
      inferenceRequirements: UNKNOWN_REQ,
      verificationLevel: 'CATALOG_ONLY',
      notes: 'Google Gemma family — third-party substrate.',
    },
  ],

  concreteSubstrates: [
    {
      id: 'gateway:ollama',
      label: 'Ollama gateway substrate',
      role: 'CONCRETE_SUBSTRATE',
      runtime: 'ollama',
      provider: 'ollama',
      inferenceRequirements: {
        gpuRequired: 'UNKNOWN',
        minimumSystemMemoryBytes: 'UNKNOWN',
        minimumGpuMemoryBytes: 'UNKNOWN',
        minimumCpuCores: 'UNKNOWN',
        supportedArchitectures: ['ARM64', 'X86_64'],
        supportedEnvironments: ['MACOS', 'LINUX', 'WINDOWS'],
        preferredAccelerator: 'UNKNOWN',
      },
      verificationLevel: 'ADAPTER_VERIFIED',
      notes: 'Concrete local substrate via ai-gateway. Model pulled separately.',
    },
    {
      id: 'gateway:deepseek',
      label: 'DeepSeek API substrate',
      role: 'CONCRETE_SUBSTRATE',
      family: 'DEEPSEEK',
      runtime: 'api',
      provider: 'deepseek',
      inferenceRequirements: {
        gpuRequired: false,
        minimumSystemMemoryBytes: 'UNKNOWN',
        minimumGpuMemoryBytes: 'UNKNOWN',
        minimumCpuCores: 'UNKNOWN',
        supportedArchitectures: 'UNKNOWN',
        supportedEnvironments: 'UNKNOWN',
        preferredAccelerator: 'UNKNOWN',
      },
      verificationLevel: 'ADAPTER_VERIFIED',
      notes: 'Remote third-party API substrate — not Tau-owned weights.',
    },
    {
      id: 'gateway:tau-foundation',
      label: 'Tau Foundation Model placeholder',
      role: 'CONCRETE_SUBSTRATE',
      family: 'TAU_FOUNDATION_MODEL',
      provider: 'tau',
      inferenceRequirements: UNKNOWN_REQ,
      verificationLevel: 'METADATA_VERIFIED',
      notes: 'Future Tau-owned/derived checkpoint — same router, no special path.',
    },
  ],
};

export function getCatalogFamily(id: string) {
  return OPEN_MODEL_CATALOG.families.find((f) => f.id === id);
}

export function getCatalogRuntime(id: string) {
  return OPEN_MODEL_CATALOG.runtimes.find((r) => r.id === id);
}
