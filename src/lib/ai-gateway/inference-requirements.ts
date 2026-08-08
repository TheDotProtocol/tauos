/**
 * Verified inference requirement presets (AI-3.4).
 *
 * Only values with architectural/runtime verification — never guessed from parameter counts.
 */

import type { InferenceRequirements } from '@tau/ai';

/** Remote API substrates — inference runs on provider infrastructure. */
export const REMOTE_CLIENT_INFERENCE_REQUIREMENTS: InferenceRequirements = {
  gpuRequired: false,
  minimumSystemMemoryBytes: 'UNKNOWN',
  minimumGpuMemoryBytes: 'UNKNOWN',
  minimumCpuCores: 'UNKNOWN',
  supportedArchitectures: 'UNKNOWN',
  supportedEnvironments: 'UNKNOWN',
  preferredAccelerator: 'UNKNOWN',
};

/** Ollama runtime — model-specific requirements vary; runtime OS support verified from Ollama project docs. */
export const OLLAMA_RUNTIME_INFERENCE_REQUIREMENTS: InferenceRequirements = {
  gpuRequired: 'UNKNOWN',
  minimumSystemMemoryBytes: 'UNKNOWN',
  minimumGpuMemoryBytes: 'UNKNOWN',
  minimumCpuCores: 'UNKNOWN',
  supportedArchitectures: ['ARM64', 'X86_64'],
  supportedEnvironments: ['MACOS', 'LINUX', 'WINDOWS'],
  preferredAccelerator: 'UNKNOWN',
};

/** Offline keyword fallback — no GPU, minimal local compute. */
export const FALLBACK_INFERENCE_REQUIREMENTS: InferenceRequirements = {
  gpuRequired: false,
  minimumSystemMemoryBytes: 'UNKNOWN',
  minimumGpuMemoryBytes: 'UNKNOWN',
  minimumCpuCores: 1,
  supportedArchitectures: 'UNKNOWN',
  supportedEnvironments: 'UNKNOWN',
  preferredAccelerator: 'CPU',
};

/** vLLM runtime stub — requirements depend on deployed model; not verified in AI-3.4. */
export const VLLM_RUNTIME_INFERENCE_REQUIREMENTS: InferenceRequirements = {
  gpuRequired: 'UNKNOWN',
  minimumSystemMemoryBytes: 'UNKNOWN',
  minimumGpuMemoryBytes: 'UNKNOWN',
  minimumCpuCores: 'UNKNOWN',
  supportedArchitectures: 'UNKNOWN',
  supportedEnvironments: 'UNKNOWN',
  preferredAccelerator: 'UNKNOWN',
};

/** Tau Foundation placeholder — not configured. */
export const TAU_FOUNDATION_INFERENCE_REQUIREMENTS: InferenceRequirements = {
  gpuRequired: 'UNKNOWN',
  minimumSystemMemoryBytes: 'UNKNOWN',
  minimumGpuMemoryBytes: 'UNKNOWN',
  minimumCpuCores: 'UNKNOWN',
  supportedArchitectures: 'UNKNOWN',
  supportedEnvironments: 'UNKNOWN',
  preferredAccelerator: 'UNKNOWN',
};
