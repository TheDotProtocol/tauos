/**
 * macOS hardware detector (AI-3.4).
 *
 * Uses Node.js os module only — values that are actually available.
 * GPU details remain UNKNOWN (no fabricated VRAM or vendor).
 */

import { arch, cpus, freemem, totalmem } from 'os';
import type { HardwareProfile, CpuArchitecture } from './types';
import { createUnknownHardwareProfile } from './profile';
import type { HardwareDetector } from './detector';

function mapArch(arch: string): CpuArchitecture {
  if (arch === 'arm64') return 'ARM64';
  if (arch === 'x64') return 'X86_64';
  return 'UNKNOWN';
}

export class MacOSHardwareDetector implements HardwareDetector {
  detect(): HardwareProfile {
    if (typeof process === 'undefined' || process.platform !== 'darwin') {
      return createUnknownHardwareProfile();
    }

    const base = createUnknownHardwareProfile();
    const logicalCores = cpus()?.length ?? 0;

    return {
      ...base,
      cpu: {
        architecture: mapArch(arch()),
        logicalCores: logicalCores > 0 ? logicalCores : 'UNKNOWN',
        performanceClass: 'UNKNOWN',
      },
      memory: {
        totalBytes: totalmem(),
        availableBytes: freemem(),
      },
      gpu: {
        availability: 'UNKNOWN',
        vendor: 'UNKNOWN',
        model: 'UNKNOWN',
        memoryBytes: 'UNKNOWN',
        architecture: 'UNKNOWN',
      },
      operatingSystem: 'MACOS',
      executionEnvironments: ['MACOS', 'BARE_METAL'],
    };
  }
}
