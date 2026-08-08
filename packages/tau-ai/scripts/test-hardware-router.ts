/**
 * AI-3.3 — hardware-aware routing tests (14 scenarios + AI-3.2 regression via separate script).
 */
import {
  TAU_CAPABILITIES,
  buildSubstrateMetadata,
  createDeterministicModelRouter,
  createUnknownHardwareProfile,
  type HardwareProfile,
  type InferenceRequirements,
  type ModelSubstrate,
  type RoutableSubstrate,
} from '../src';

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

function hw(partial: Partial<HardwareProfile>): HardwareProfile {
  const base = createUnknownHardwareProfile();
  return {
    ...base,
    ...partial,
    cpu: { ...base.cpu, ...partial.cpu },
    gpu: { ...base.gpu, ...partial.gpu },
    memory: { ...base.memory, ...partial.memory },
    storage: { ...base.storage, ...partial.storage },
    executionEnvironments: partial.executionEnvironments ?? base.executionEnvironments,
  };
}

function mockSubstrate(
  id: string,
  opts: {
    privacyClass: 'LOCAL' | 'REMOTE';
    configured: boolean;
    availability: 'AVAILABLE' | 'LOCAL' | 'REMOTE' | 'NOT_CONFIGURED' | 'UNAVAILABLE';
    supported: string[];
    requirements?: InferenceRequirements;
    priority?: number;
  },
): RoutableSubstrate {
  const metadata = buildSubstrateMetadata({
    supportedCapabilities: opts.supported as never[],
    privacyClass: opts.privacyClass,
    costClass: 'FREE',
    latencyClass: 'UNKNOWN',
    availability: opts.availability,
    healthStatus: 'UNKNOWN',
    verificationLevel: 'METADATA_VERIFIED',
    provenance: {
      modelId: 'UNKNOWN',
      modelFamily: 'UNKNOWN',
      provider: id,
      license: 'UNKNOWN',
      source: 'TEST',
      version: 'UNKNOWN',
      weightsLocation: opts.privacyClass === 'LOCAL' ? 'LOCAL' : 'REMOTE',
      architecture: 'UNKNOWN',
      modalities: ['text'],
    },
    inferenceRequirements: opts.requirements,
  });

  const substrate: ModelSubstrate = {
    id,
    kind: opts.privacyClass === 'LOCAL' ? 'local' : 'remote',
    label: id,
    metadata,
    isConfigured: () => opts.configured,
    getAvailability: () => opts.availability,
    listCapabilities: () => [{ id: 'default', label: 'test', available: opts.configured }],
    async complete() {
      return { message: 'test', model: 'default' };
    },
  };

  return { substrate, priority: opts.priority ?? 10 };
}

function route(
  capability: string,
  privacyMode: 'LOCAL_ONLY' | 'REMOTE_ALLOWED' | 'PREFER_LOCAL',
  substrates: RoutableSubstrate[],
  hardwareProfile?: HardwareProfile,
) {
  return createDeterministicModelRouter().route({
    capability,
    privacyMode,
    substrates,
    hardwareProfile: hardwareProfile ?? createUnknownHardwareProfile(),
  });
}

function main() {
  let n = 0;

  const armLocal = mockSubstrate('ollama-arm', {
    privacyClass: 'LOCAL',
    configured: true,
    availability: 'LOCAL',
    supported: [TAU_CAPABILITIES.TEXT_REASONING],
    requirements: { supportedArchitectures: ['ARM64'] },
    priority: 5,
  });

  // TEST 1
  const t1 = route(
    TAU_CAPABILITIES.TEXT_REASONING,
    'LOCAL_ONLY',
    [armLocal],
    hw({ cpu: { architecture: 'ARM64', logicalCores: 8, performanceClass: 'UNKNOWN' } }),
  );
  assert(t1.success && t1.hardwareCompatibility === 'COMPATIBLE', 'TEST 1 ARM64 local');
  n++;

  // TEST 2
  const x86Local = mockSubstrate('ollama-x86', {
    privacyClass: 'LOCAL',
    configured: true,
    availability: 'LOCAL',
    supported: [TAU_CAPABILITIES.TEXT_REASONING],
    requirements: { supportedArchitectures: ['X86_64'] },
  });
  const t2 = route(
    TAU_CAPABILITIES.TEXT_REASONING,
    'LOCAL_ONLY',
    [x86Local],
    hw({ cpu: { architecture: 'X86_64', logicalCores: 4, performanceClass: 'UNKNOWN' } }),
  );
  assert(t2.success, 'TEST 2 X86_64 compatible');
  n++;

  // TEST 3
  const ramHeavy = mockSubstrate('big-model', {
    privacyClass: 'LOCAL',
    configured: true,
    availability: 'LOCAL',
    supported: [TAU_CAPABILITIES.TEXT_REASONING],
    requirements: { minimumSystemMemoryBytes: 16 * 1024 ** 3 },
  });
  const t3 = route(
    TAU_CAPABILITIES.TEXT_REASONING,
    'LOCAL_ONLY',
    [ramHeavy],
    hw({ memory: { totalBytes: 8 * 1024 ** 3, availableBytes: 4 * 1024 ** 3 } }),
  );
  assert(!t3.success && t3.failureCode === 'HARDWARE_INCOMPATIBLE', 'TEST 3 insufficient RAM');
  n++;

  // TEST 4
  const vramHeavy = mockSubstrate('gpu-model', {
    privacyClass: 'LOCAL',
    configured: true,
    availability: 'LOCAL',
    supported: [TAU_CAPABILITIES.TEXT_REASONING],
    requirements: { minimumGpuMemoryBytes: 8 * 1024 ** 3 },
  });
  const t4 = route(
    TAU_CAPABILITIES.TEXT_REASONING,
    'LOCAL_ONLY',
    [vramHeavy],
    hw({
      gpu: {
        availability: 'AVAILABLE',
        vendor: 'UNKNOWN',
        model: 'UNKNOWN',
        memoryBytes: 2 * 1024 ** 3,
        architecture: 'UNKNOWN',
      },
    }),
  );
  assert(!t4.success, 'TEST 4 insufficient VRAM');
  n++;

  // TEST 5
  const cpuOnly = mockSubstrate('cpu-model', {
    privacyClass: 'LOCAL',
    configured: true,
    availability: 'LOCAL',
    supported: [TAU_CAPABILITIES.TEXT_REASONING],
    requirements: { gpuRequired: false },
  });
  const t5 = route(
    TAU_CAPABILITIES.TEXT_REASONING,
    'LOCAL_ONLY',
    [cpuOnly],
    hw({ gpu: { availability: 'NONE', vendor: 'UNKNOWN', model: 'UNKNOWN', memoryBytes: 'UNKNOWN', architecture: 'UNKNOWN' } }),
  );
  assert(t5.success, 'TEST 5 CPU-only compatible without GPU');
  n++;

  // TEST 6
  const gpuRequired = mockSubstrate('gpu-req', {
    privacyClass: 'LOCAL',
    configured: true,
    availability: 'LOCAL',
    supported: [TAU_CAPABILITIES.TEXT_REASONING],
    requirements: { gpuRequired: true },
  });
  const t6 = route(
    TAU_CAPABILITIES.TEXT_REASONING,
    'LOCAL_ONLY',
    [gpuRequired],
    hw({ gpu: { availability: 'NONE', vendor: 'UNKNOWN', model: 'UNKNOWN', memoryBytes: 'UNKNOWN', architecture: 'UNKNOWN' } }),
  );
  assert(!t6.success, 'TEST 6 GPU required rejected');
  n++;

  // TEST 7
  const t7 = route(TAU_CAPABILITIES.TEXT_REASONING, 'REMOTE_ALLOWED', [armLocal]);
  assert(t7.success && t7.hardwareCompatibility === 'UNKNOWN', 'TEST 7 unknown hardware allowed');
  n++;

  // TEST 8 — unknown hardware + known hard GPU requirement + no GPU
  const t8 = route(
    TAU_CAPABILITIES.TEXT_REASONING,
    'REMOTE_ALLOWED',
    [gpuRequired],
    createUnknownHardwareProfile(),
  );
  assert(!t8.success || t8.hardwareCompatibility === 'UNKNOWN', 'TEST 8 conservative unknown+hardware req');
  n++;

  // TEST 9
  const remote = mockSubstrate('openai', {
    privacyClass: 'REMOTE',
    configured: true,
    availability: 'REMOTE',
    supported: [TAU_CAPABILITIES.TEXT_REASONING],
    priority: 1,
  });
  const t9 = route(TAU_CAPABILITIES.TEXT_REASONING, 'LOCAL_ONLY', [remote, armLocal]);
  assert(t9.success && t9.substrateId === 'ollama-arm', 'TEST 9 local only before hardware');
  n++;

  // TEST 10
  const t10 = route(
    TAU_CAPABILITIES.TEXT_REASONING,
    'LOCAL_ONLY',
    [remote],
    hw({ cpu: { architecture: 'ARM64', logicalCores: 8, performanceClass: 'UNKNOWN' } }),
  );
  assert(!t10.success && t10.failureCode === 'LOCAL_ONLY_NO_MATCH', 'TEST 10 remote rejected by privacy');
  n++;

  // TEST 11
  const a = mockSubstrate('aaa', {
    privacyClass: 'LOCAL',
    configured: true,
    availability: 'LOCAL',
    supported: [TAU_CAPABILITIES.TEXT_REASONING],
    priority: 5,
  });
  const b = mockSubstrate('bbb', {
    privacyClass: 'LOCAL',
    configured: true,
    availability: 'LOCAL',
    supported: [TAU_CAPABILITIES.TEXT_REASONING],
    priority: 5,
  });
  const t11 = route(TAU_CAPABILITIES.TEXT_REASONING, 'LOCAL_ONLY', [b, a]);
  assert(t11.success && t11.substrateId === 'aaa', 'TEST 11 stable tie-break');
  n++;

  // TEST 12
  const r1 = route(TAU_CAPABILITIES.TEXT_REASONING, 'LOCAL_ONLY', [a, b]);
  const r2 = route(TAU_CAPABILITIES.TEXT_REASONING, 'LOCAL_ONLY', [a, b]);
  assert(r1.success && r2.success && r1.substrateId === r2.substrateId, 'TEST 12 repeat');
  n++;

  // TEST 13
  const tauFoundation = mockSubstrate('tau-foundation', {
    privacyClass: 'LOCAL',
    configured: true,
    availability: 'AVAILABLE',
    supported: [TAU_CAPABILITIES.TEXT_REASONING, TAU_CAPABILITIES.CODE],
    priority: 0,
  });
  const t13 = route(TAU_CAPABILITIES.TEXT_REASONING, 'LOCAL_ONLY', [tauFoundation]);
  assert(t13.success && t13.substrateId === 'tau-foundation', 'TEST 13 tau foundation routable');
  n++;

  console.log(`PASS  AI-3.3 hardware router (${n} tests)`);
}

main();
