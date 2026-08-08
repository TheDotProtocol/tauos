/**
 * Hardware detection abstraction (AI-3.3/AI-3.4).
 */

import type { HardwareProfile } from './types';
import { createUnknownHardwareProfile } from './profile';
import { MacOSHardwareDetector } from './macos-detector';

export interface HardwareDetector {
  detect(): HardwareProfile | Promise<HardwareProfile>;
}

/** Safe default — no fabricated hardware. */
export class UnknownHardwareDetector implements HardwareDetector {
  detect(): HardwareProfile {
    return createUnknownHardwareProfile();
  }
}

export function createDefaultHardwareDetector(): HardwareDetector {
  if (typeof process !== 'undefined' && process.platform === 'darwin') {
    return new MacOSHardwareDetector();
  }
  return new UnknownHardwareDetector();
}

export function createPlatformHardwareDetector(): HardwareDetector {
  return createDefaultHardwareDetector();
}

export { MacOSHardwareDetector } from './macos-detector';
