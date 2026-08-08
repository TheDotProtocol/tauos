/**
 * Hardware compatibility evaluation (AI-3.3).
 *
 * Conservative: reject only when requirements are known AND hardware is known
 * AND incompatibility is definite. Unknown + unknown → allow with UNKNOWN state.
 */

import type { InferenceRequirements } from './requirements';
import type {
  HardwareCompatibilityResult,
  HardwareProfile,
  MemoryBytes,
} from './types';

function isKnownBytes(value: MemoryBytes): value is number {
  return typeof value === 'number' && value >= 0;
}

export function evaluateHardwareCompatibility(
  hardware: HardwareProfile,
  requirements?: InferenceRequirements,
): HardwareCompatibilityResult {
  if (!requirements) {
    return { compatibility: 'UNKNOWN', reasons: ['REQUIREMENTS_UNKNOWN'] };
  }

  const reasons: string[] = [];
  let incompatible = false;
  let knownChecks = 0;

  if (requirements.gpuRequired === true) {
    knownChecks++;
    if (hardware.gpu.availability === 'NONE') {
      incompatible = true;
      reasons.push('HARDWARE_GPU_REQUIRED');
    } else if (hardware.gpu.availability === 'AVAILABLE') {
      reasons.push('GPU_AVAILABLE');
    }
  }

  if (typeof requirements.minimumCpuCores === 'number') {
    knownChecks++;
    if (typeof hardware.cpu.logicalCores === 'number') {
      if (hardware.cpu.logicalCores < requirements.minimumCpuCores) {
        incompatible = true;
        reasons.push('INSUFFICIENT_CPU_CORES');
      } else {
        reasons.push('CPU_CORES_SATISFIED');
      }
    }
  }

  if (requirements.minimumSystemMemoryBytes !== undefined && isKnownBytes(requirements.minimumSystemMemoryBytes)) {
    knownChecks++;
    if (isKnownBytes(hardware.memory.availableBytes)) {
      if (hardware.memory.availableBytes < requirements.minimumSystemMemoryBytes) {
        incompatible = true;
        reasons.push('INSUFFICIENT_SYSTEM_MEMORY');
      } else {
        reasons.push('SYSTEM_MEMORY_SATISFIED');
      }
    }
  }

  if (requirements.minimumGpuMemoryBytes !== undefined && isKnownBytes(requirements.minimumGpuMemoryBytes)) {
    knownChecks++;
    if (isKnownBytes(hardware.gpu.memoryBytes)) {
      if (hardware.gpu.memoryBytes < requirements.minimumGpuMemoryBytes) {
        incompatible = true;
        reasons.push('INSUFFICIENT_GPU_MEMORY');
      } else {
        reasons.push('GPU_MEMORY_SATISFIED');
      }
    }
  }

  if (
    Array.isArray(requirements.supportedArchitectures) &&
    requirements.supportedArchitectures.length > 0
  ) {
    knownChecks++;
    if (hardware.cpu.architecture !== 'UNKNOWN') {
      if (!requirements.supportedArchitectures.includes(hardware.cpu.architecture)) {
        incompatible = true;
        reasons.push('HARDWARE_ARCHITECTURE_MISMATCH');
      } else {
        reasons.push('ARCHITECTURE_SUPPORTED');
      }
    }
  }

  if (
    Array.isArray(requirements.supportedEnvironments) &&
    requirements.supportedEnvironments.length > 0
  ) {
    knownChecks++;
    const envs = hardware.executionEnvironments.filter((e) => e !== 'UNKNOWN');
    if (envs.length > 0) {
      const matches = envs.some((e) => requirements.supportedEnvironments!.includes(e));
      if (!matches) {
        incompatible = true;
        reasons.push('HARDWARE_ENVIRONMENT_MISMATCH');
      } else {
        reasons.push('ENVIRONMENT_SUPPORTED');
      }
    }
  }

  if (incompatible) {
    return { compatibility: 'INCOMPATIBLE', reasons };
  }

  if (knownChecks === 0) {
    return { compatibility: 'UNKNOWN', reasons: ['REQUIREMENTS_UNKNOWN'] };
  }

  const allUnknownHardware =
    hardware.cpu.architecture === 'UNKNOWN' &&
    hardware.gpu.availability === 'UNKNOWN' &&
    hardware.memory.availableBytes === 'UNKNOWN';

  if (allUnknownHardware && knownChecks > 0) {
    return {
      compatibility: 'UNKNOWN',
      reasons: [...reasons, 'HARDWARE_UNKNOWN_REQUIREMENTS_PARTIAL'],
    };
  }

  return {
    compatibility: reasons.length > 0 ? 'COMPATIBLE' : 'UNKNOWN',
    reasons: reasons.length > 0 ? reasons : ['HARDWARE_COMPATIBLE'],
  };
}
