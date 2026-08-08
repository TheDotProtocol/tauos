/**
 * Default unknown hardware profile (AI-3.3).
 */

import type { HardwareProfile } from './types';

export function createUnknownHardwareProfile(): HardwareProfile {
  return {
    cpu: {
      architecture: 'UNKNOWN',
      logicalCores: 'UNKNOWN',
      performanceClass: 'UNKNOWN',
    },
    gpu: {
      availability: 'UNKNOWN',
      vendor: 'UNKNOWN',
      model: 'UNKNOWN',
      memoryBytes: 'UNKNOWN',
      architecture: 'UNKNOWN',
    },
    accelerator: {
      type: 'UNKNOWN',
      memoryBytes: 'UNKNOWN',
    },
    memory: {
      totalBytes: 'UNKNOWN',
      availableBytes: 'UNKNOWN',
    },
    storage: {
      availableBytes: 'UNKNOWN',
    },
    operatingSystem: 'UNKNOWN',
    executionEnvironments: ['UNKNOWN'],
  };
}
