/**
 * AI-3.4 — expanded routing validation matrix.
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

function assert(c: boolean, m: string) {
  if (!c) throw new Error(m);
}

function substrate(
  id: string,
  opts: {
    privacy: 'LOCAL' | 'REMOTE';
    configured: boolean;
    avail: 'AVAILABLE' | 'LOCAL' | 'REMOTE' | 'NOT_CONFIGURED' | 'UNAVAILABLE';
    supported: string[];
    unsupported?: string[];
    reqs?: InferenceRequirements;
    priority?: number;
  },
): RoutableSubstrate {
  const metadata = buildSubstrateMetadata({
    supportedCapabilities: opts.supported as never[],
    unsupportedCapabilities: (opts.unsupported ?? []) as never[],
    privacyClass: opts.privacy,
    costClass: opts.privacy === 'LOCAL' ? 'FREE' : 'UNKNOWN',
    latencyClass: 'UNKNOWN',
    availability: opts.avail,
    healthStatus: 'UNKNOWN',
    verificationLevel: 'METADATA_VERIFIED',
    provenance: {
      modelId: 'UNKNOWN',
      modelFamily: 'UNKNOWN',
      provider: id,
      license: 'UNKNOWN',
      source: 'TEST',
      version: 'UNKNOWN',
      weightsLocation: opts.privacy === 'LOCAL' ? 'LOCAL' : 'REMOTE',
      architecture: 'UNKNOWN',
      modalities: ['text'],
    },
    inferenceRequirements: opts.reqs,
  });
  const s: ModelSubstrate = {
    id,
    kind: opts.privacy === 'LOCAL' ? 'local' : 'remote',
    label: id,
    metadata,
    isConfigured: () => opts.configured,
    getAvailability: () => opts.avail,
    listCapabilities: () => [{ id: 'm', label: 'm', available: opts.configured }],
    async complete() {
      return { message: 'x', model: 'm' };
    },
  };
  return { substrate: s, priority: opts.priority ?? 10 };
}

function route(
  cap: string,
  privacy: 'LOCAL_ONLY' | 'REMOTE_ALLOWED' | 'PREFER_LOCAL' | 'ANY',
  subs: RoutableSubstrate[],
  hw?: HardwareProfile,
  prefs?: { preferredSubstrateId?: string; preferLocal?: boolean; costPreference?: 'PREFER_FREE' },
  policy?: { privacyMode?: 'LOCAL_ONLY' },
) {
  return createDeterministicModelRouter().route({
    capability: cap,
    privacyMode: privacy,
    substrates: subs,
    hardwareProfile: hw,
    userPreferences: prefs,
    systemPolicy: policy,
  });
}

function main() {
  let n = 0;
  const local = substrate('local', {
    privacy: 'LOCAL',
    configured: true,
    avail: 'LOCAL',
    supported: [TAU_CAPABILITIES.TEXT_REASONING, TAU_CAPABILITIES.CODE],
    priority: 5,
  });
  const remote = substrate('remote', {
    privacy: 'REMOTE',
    configured: true,
    avail: 'REMOTE',
    supported: [TAU_CAPABILITIES.TEXT_REASONING, TAU_CAPABILITIES.CODE, TAU_CAPABILITIES.IMAGE_UNDERSTANDING],
    priority: 1,
  });
  const visionRemote = substrate('vision-remote', {
    privacy: 'REMOTE',
    configured: true,
    avail: 'REMOTE',
    supported: [TAU_CAPABILITIES.IMAGE_UNDERSTANDING],
    priority: 2,
  });
  const imageGen = substrate('imagegen', {
    privacy: 'REMOTE',
    configured: true,
    avail: 'REMOTE',
    supported: [TAU_CAPABILITIES.IMAGE_GENERATION],
    priority: 3,
  });
  const notCfg = substrate('notcfg', {
    privacy: 'LOCAL',
    configured: false,
    avail: 'NOT_CONFIGURED',
    supported: [TAU_CAPABILITIES.TEXT_REASONING],
  });
  const tauFdn = substrate('tau-foundation', {
    privacy: 'LOCAL',
    configured: true,
    avail: 'AVAILABLE',
    supported: [TAU_CAPABILITIES.TEXT_REASONING, TAU_CAPABILITIES.CODE],
    priority: 0,
  });

  assert(route(TAU_CAPABILITIES.TEXT_REASONING, 'LOCAL_ONLY', [local, remote]).success, 'TEXT+LOCAL');
  n++;
  assert(!route(TAU_CAPABILITIES.CODE, 'LOCAL_ONLY', [remote]).success, 'CODE+LOCAL fail remote');
  n++;
  assert(route(TAU_CAPABILITIES.CODE, 'REMOTE_ALLOWED', [remote, local]).success, 'CODE+REMOTE');
  n++;
  assert(!route(TAU_CAPABILITIES.IMAGE_UNDERSTANDING, 'LOCAL_ONLY', [visionRemote]).success, 'VISION+LOCAL fail');
  n++;
  assert(route(TAU_CAPABILITIES.IMAGE_GENERATION, 'REMOTE_ALLOWED', [imageGen]).success, 'IMAGE_GEN+REMOTE');
  n++;
  assert(!route('UNKNOWN_CAP' as never, 'REMOTE_ALLOWED', [remote]).success, 'unknown cap');
  n++;
  assert(route(TAU_CAPABILITIES.TEXT_REASONING, 'REMOTE_ALLOWED', [local], createUnknownHardwareProfile()).success, 'unknown hw');
  n++;
  assert(!route(TAU_CAPABILITIES.TEXT_REASONING, 'REMOTE_ALLOWED', [notCfg]).success, 'not configured');
  n++;
  const policyResult = route(
    TAU_CAPABILITIES.TEXT_REASONING,
    'LOCAL_ONLY',
    [remote, local],
    undefined,
    undefined,
    { privacyMode: 'LOCAL_ONLY' },
  );
  assert(policyResult.success && policyResult.substrateId === 'local', 'system policy');
  n++;
  const preferLocalResult = route(
    TAU_CAPABILITIES.TEXT_REASONING,
    'PREFER_LOCAL',
    [remote, local],
    undefined,
    { preferLocal: true },
  );
  assert(preferLocalResult.success && preferLocalResult.substrateId === 'local', 'prefer local');
  n++;
  assert(
    route(TAU_CAPABILITIES.TEXT_REASONING, 'REMOTE_ALLOWED', [remote, local], undefined, { costPreference: 'PREFER_FREE' }).success,
    'cost pref',
  );
  n++;
  const tauFdnResult = route(TAU_CAPABILITIES.TEXT_REASONING, 'LOCAL_ONLY', [tauFdn]);
  assert(tauFdnResult.success && tauFdnResult.substrateId === 'tau-foundation', 'tau foundation');
  n++;

  const r1 = route(TAU_CAPABILITIES.CODE, 'REMOTE_ALLOWED', [remote, local]);
  const r2 = route(TAU_CAPABILITIES.CODE, 'REMOTE_ALLOWED', [remote, local]);
  assert(r1.success && r2.success && r1.substrateId === r2.substrateId, 'repeat');
  n++;

  console.log(`PASS  AI-3.4 routing matrix (${n} scenarios)`);
}

main();
