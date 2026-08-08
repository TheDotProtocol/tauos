/**
 * Hardware / environment types (AI-3.3 — Tau Foundation v0.1).
 * Vendor-neutral — unknown values explicit, no fabricated capabilities.
 */

export type CpuArchitecture = 'ARM64' | 'X86_64' | 'UNKNOWN';

export type CpuPerformanceClass = 'LOW' | 'MEDIUM' | 'HIGH' | 'UNKNOWN';

export type GpuAvailability = 'NONE' | 'AVAILABLE' | 'UNKNOWN';

export type GpuVendor =
  | 'NVIDIA'
  | 'AMD'
  | 'INTEL'
  | 'APPLE'
  | 'QUALCOMM'
  | 'MEDIATEK'
  | 'OTHER'
  | 'UNKNOWN';

export type AcceleratorType =
  | 'CPU'
  | 'GPU'
  | 'NPU'
  | 'TPU'
  | 'APPLE_SILICON'
  | 'OTHER'
  | 'UNKNOWN';

export type ExecutionEnvironment =
  | 'MACOS'
  | 'LINUX'
  | 'WINDOWS'
  | 'ANDROID'
  | 'IOS'
  | 'DOCKER'
  | 'BARE_METAL'
  | 'VM'
  | 'CLOUD'
  | 'EMULATOR'
  | 'UNKNOWN';

/** Bytes or UNKNOWN — do not fabricate memory values. */
export type MemoryBytes = number | 'UNKNOWN';

export type CpuProfile = {
  architecture: CpuArchitecture;
  logicalCores: number | 'UNKNOWN';
  performanceClass: CpuPerformanceClass;
};

export type GpuProfile = {
  availability: GpuAvailability;
  vendor: GpuVendor;
  model: string | 'UNKNOWN';
  memoryBytes: MemoryBytes;
  architecture: string | 'UNKNOWN';
};

export type AcceleratorProfile = {
  type: AcceleratorType;
  memoryBytes: MemoryBytes;
};

export type MemoryProfile = {
  totalBytes: MemoryBytes;
  availableBytes: MemoryBytes;
};

export type StorageProfile = {
  availableBytes: MemoryBytes;
};

/**
 * Normalized hardware/environment snapshot for routing.
 * Multiple execution environment layers allowed (e.g. MACOS + DOCKER).
 */
export type HardwareProfile = {
  cpu: CpuProfile;
  gpu: GpuProfile;
  accelerator: AcceleratorProfile;
  memory: MemoryProfile;
  storage: StorageProfile;
  operatingSystem: ExecutionEnvironment;
  executionEnvironments: ExecutionEnvironment[];
};

export type HardwareCompatibility = 'COMPATIBLE' | 'INCOMPATIBLE' | 'UNKNOWN';

export type HardwareCompatibilityResult = {
  compatibility: HardwareCompatibility;
  reasons: string[];
};
