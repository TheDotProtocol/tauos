/**
 * Hardware compatibility routing filter (AI-3.3).
 */

import { evaluateHardwareCompatibility } from '../hardware/compatibility';
import type { HardwareProfile } from '../hardware/types';
import type { RejectionReason, RoutableSubstrate, SubstrateRejection } from './routing-types';

function mapHardwareReason(reason: string): RejectionReason {
  switch (reason) {
    case 'INSUFFICIENT_SYSTEM_MEMORY':
      return 'HARDWARE_INSUFFICIENT_RAM';
    case 'INSUFFICIENT_GPU_MEMORY':
      return 'HARDWARE_INSUFFICIENT_VRAM';
    case 'HARDWARE_GPU_REQUIRED':
      return 'HARDWARE_GPU_REQUIRED';
    case 'HARDWARE_ARCHITECTURE_MISMATCH':
      return 'HARDWARE_ARCHITECTURE_MISMATCH';
    case 'HARDWARE_ENVIRONMENT_MISMATCH':
      return 'HARDWARE_ENVIRONMENT_MISMATCH';
    default:
      return 'HARDWARE_INCOMPATIBLE';
  }
}

export function passesHardwareFilter(
  entry: RoutableSubstrate,
  hardware: HardwareProfile,
): {
  pass: boolean;
  compatibility: 'COMPATIBLE' | 'UNKNOWN';
  rejection?: SubstrateRejection;
} {
  const result = evaluateHardwareCompatibility(
    hardware,
    entry.substrate.metadata.inferenceRequirements,
  );

  if (result.compatibility === 'INCOMPATIBLE') {
    const primary = result.reasons.find((r) =>
      [
        'INSUFFICIENT_SYSTEM_MEMORY',
        'INSUFFICIENT_GPU_MEMORY',
        'HARDWARE_GPU_REQUIRED',
        'HARDWARE_ARCHITECTURE_MISMATCH',
        'HARDWARE_ENVIRONMENT_MISMATCH',
      ].includes(r),
    );
    return {
      pass: false,
      compatibility: 'UNKNOWN',
      rejection: {
        substrateId: entry.substrate.id,
        reason: mapHardwareReason(primary ?? 'HARDWARE_INCOMPATIBLE'),
        detail: result.reasons.join(','),
      },
    };
  }

  return {
    pass: true,
    compatibility: result.compatibility === 'COMPATIBLE' ? 'COMPATIBLE' : 'UNKNOWN',
  };
}

export function countRejectionsByReason(
  rejected: SubstrateRejection[],
  reasons: RejectionReason[],
): number {
  return rejected.filter((r) => reasons.includes(r.reason)).length;
}
