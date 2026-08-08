/**
 * Optional substrate inference requirements (AI-3.3 compatibility contract).
 * Future model profiles — not performance prediction.
 */

import type {
  CpuArchitecture,
  ExecutionEnvironment,
  AcceleratorType,
  MemoryBytes,
} from './types';

export type InferenceRequirements = {
  minimumCpuCores?: number | 'UNKNOWN';
  minimumSystemMemoryBytes?: MemoryBytes;
  minimumGpuMemoryBytes?: MemoryBytes;
  gpuRequired?: boolean | 'UNKNOWN';
  preferredAccelerator?: AcceleratorType | 'UNKNOWN';
  supportedArchitectures?: CpuArchitecture[] | 'UNKNOWN';
  supportedEnvironments?: ExecutionEnvironment[] | 'UNKNOWN';
};
