/**
 * AI-3.2 — deterministic router test matrix (ROUTING VERIFIED, no live models).
 */
import {
  TAU_CAPABILITIES,
  buildSubstrateMetadata,
  createDeterministicModelRouter,
  type ModelSubstrate,
  type RoutableSubstrate,
  type RoutingRequest,
} from '../src';

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

function mockSubstrate(
  id: string,
  opts: {
    privacyClass: 'LOCAL' | 'REMOTE';
    configured: boolean;
    availability: 'AVAILABLE' | 'LOCAL' | 'REMOTE' | 'NOT_CONFIGURED' | 'UNAVAILABLE' | 'UNKNOWN';
    supported: string[];
    unsupported?: string[];
    priority?: number;
    defaultModel?: string;
  },
): RoutableSubstrate {
  const metadata = buildSubstrateMetadata({
    supportedCapabilities: opts.supported as never[],
    unsupportedCapabilities: (opts.unsupported ?? []) as never[],
    privacyClass: opts.privacyClass,
    costClass: opts.privacyClass === 'LOCAL' ? 'FREE' : 'UNKNOWN',
    latencyClass: 'UNKNOWN',
    availability: opts.availability === 'NOT_CONFIGURED' ? 'NOT_CONFIGURED' : opts.availability,
    healthStatus: opts.availability === 'UNAVAILABLE' ? 'UNAVAILABLE' : 'UNKNOWN',
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
  });

  const substrate: ModelSubstrate = {
    id,
    kind: opts.privacyClass === 'LOCAL' ? 'local' : 'remote',
    label: id,
    metadata,
    isConfigured: () => opts.configured,
    getAvailability: () => opts.availability,
    listCapabilities: () => [
      { id: opts.defaultModel ?? 'default', label: 'test', available: opts.configured },
    ],
    async complete() {
      return { message: 'test', model: 'default' };
    },
  };

  return {
    substrate,
    priority: opts.priority ?? 10,
    defaultModelId: opts.defaultModel,
  };
}

function route(overrides: Partial<RoutingRequest> & Pick<RoutingRequest, 'capability' | 'privacyMode' | 'substrates'>) {
  const router = createDeterministicModelRouter();
  return router.route({
    requestId: 'test',
    ...overrides,
  } as RoutingRequest);
}

function main() {
  let n = 0;

  const remoteOpenai = mockSubstrate('openai', {
    privacyClass: 'REMOTE',
    configured: true,
    availability: 'REMOTE',
    supported: [TAU_CAPABILITIES.TEXT_REASONING, TAU_CAPABILITIES.CODE],
    priority: 1,
    defaultModel: 'gpt-4o-mini',
  });
  const remoteDeepseek = mockSubstrate('deepseek', {
    privacyClass: 'REMOTE',
    configured: true,
    availability: 'REMOTE',
    supported: [TAU_CAPABILITIES.TEXT_REASONING, TAU_CAPABILITIES.CODE],
    priority: 4,
    defaultModel: 'deepseek-chat',
  });
  const localOllama = mockSubstrate('ollama', {
    privacyClass: 'LOCAL',
    configured: true,
    availability: 'LOCAL',
    supported: [TAU_CAPABILITIES.TEXT_REASONING],
    priority: 7,
    defaultModel: 'llama3.2',
  });
  const localFallback = mockSubstrate('fallback', {
    privacyClass: 'LOCAL',
    configured: true,
    availability: 'AVAILABLE',
    supported: [TAU_CAPABILITIES.TEXT_REASONING],
    priority: 99,
    defaultModel: 'tau-fallback',
  });
  const notConfigured = mockSubstrate('tau-foundation', {
    privacyClass: 'LOCAL',
    configured: false,
    availability: 'NOT_CONFIGURED',
    supported: [TAU_CAPABILITIES.TEXT_REASONING, TAU_CAPABILITIES.CODE],
    priority: 0,
  });
  const unavailable = mockSubstrate('broken', {
    privacyClass: 'REMOTE',
    configured: true,
    availability: 'UNAVAILABLE',
    supported: [TAU_CAPABILITIES.TEXT_REASONING],
    priority: 2,
  });

  // TEST 1
  const t1 = route({
    capability: TAU_CAPABILITIES.TEXT_REASONING,
    privacyMode: 'REMOTE_ALLOWED',
    substrates: [remoteOpenai, localOllama],
  });
  assert(t1.success && t1.substrateId === 'openai', 'TEST 1 remote reasoning');
  n++;

  // TEST 2
  const t2 = route({
    capability: TAU_CAPABILITIES.TEXT_REASONING,
    privacyMode: 'LOCAL_ONLY',
    substrates: [remoteOpenai, localOllama, localFallback],
  });
  assert(t2.success && t2.substrateId === 'ollama', 'TEST 2 local only');
  n++;

  // TEST 3
  const t3 = route({
    capability: TAU_CAPABILITIES.CODE,
    privacyMode: 'LOCAL_ONLY',
    substrates: [remoteDeepseek, localOllama],
  });
  assert(!t3.success && t3.failureCode === 'LOCAL_ONLY_NO_MATCH', 'TEST 3 code local fail closed');
  n++;

  // TEST 4
  const t4 = route({
    capability: TAU_CAPABILITIES.CODE,
    privacyMode: 'REMOTE_ALLOWED',
    substrates: [remoteDeepseek, remoteOpenai],
  });
  assert(t4.success && t4.substrateId === 'openai', 'TEST 4 code remote deterministic');
  n++;

  // TEST 5
  const noCode = mockSubstrate('nocode', {
    privacyClass: 'REMOTE',
    configured: true,
    availability: 'REMOTE',
    supported: [TAU_CAPABILITIES.TEXT_REASONING],
    unsupported: [TAU_CAPABILITIES.CODE],
    priority: 1,
  });
  const t5 = route({
    capability: TAU_CAPABILITIES.CODE,
    privacyMode: 'REMOTE_ALLOWED',
    substrates: [noCode],
  });
  assert(!t5.success, 'TEST 5 unsupported capability');
  n++;

  // TEST 6 — unknown capability declaration
  const t6 = route({
    capability: TAU_CAPABILITIES.CODE,
    privacyMode: 'REMOTE_ALLOWED',
    substrates: [localOllama],
  });
  assert(!t6.success, 'TEST 6 unknown code on ollama');
  n++;

  // TEST 7
  const t7 = route({
    capability: TAU_CAPABILITIES.TEXT_REASONING,
    privacyMode: 'REMOTE_ALLOWED',
    substrates: [notConfigured],
  });
  assert(!t7.success, 'TEST 7 not configured rejected');
  n++;

  // TEST 8
  const t8 = route({
    capability: TAU_CAPABILITIES.TEXT_REASONING,
    privacyMode: 'REMOTE_ALLOWED',
    substrates: [unavailable],
  });
  assert(!t8.success, 'TEST 8 unavailable rejected');
  n++;

  // TEST 9
  const t9 = route({
    capability: TAU_CAPABILITIES.TEXT_REASONING,
    privacyMode: 'PREFER_LOCAL',
    substrates: [remoteOpenai, localFallback],
    userPreferences: { preferLocal: true },
  });
  assert(t9.success && t9.substrateId === 'fallback', 'TEST 9 prefer local');
  n++;

  // TEST 10
  const t10 = route({
    capability: TAU_CAPABILITIES.TEXT_REASONING,
    privacyMode: 'REMOTE_ALLOWED',
    substrates: [remoteOpenai, localOllama],
    userPreferences: { preferredSubstrateId: 'openai' },
    systemPolicy: { privacyMode: 'LOCAL_ONLY' },
  });
  assert(t10.success && t10.substrateId === 'ollama', 'TEST 10 system policy wins');
  n++;

  // TEST 11 — equal priority tie-break by stable id
  const a = mockSubstrate('aaa', {
    privacyClass: 'REMOTE',
    configured: true,
    availability: 'REMOTE',
    supported: [TAU_CAPABILITIES.TEXT_REASONING],
    priority: 5,
  });
  const b = mockSubstrate('bbb', {
    privacyClass: 'REMOTE',
    configured: true,
    availability: 'REMOTE',
    supported: [TAU_CAPABILITIES.TEXT_REASONING],
    priority: 5,
  });
  const t11 = route({
    capability: TAU_CAPABILITIES.TEXT_REASONING,
    privacyMode: 'REMOTE_ALLOWED',
    substrates: [b, a],
  });
  assert(t11.success && t11.substrateId === 'aaa', 'TEST 11 stable id tie-break');
  n++;

  // TEST 12
  const t12 = route({
    capability: TAU_CAPABILITIES.TEXT_REASONING,
    privacyMode: 'LOCAL_ONLY',
    substrates: [notConfigured, localOllama],
  });
  assert(t12.success && t12.substrateId !== 'tau-foundation', 'TEST 12 tau-foundation not routable');
  n++;

  // TEST 13 — future tau foundation available
  const tauReady = mockSubstrate('tau-foundation', {
    privacyClass: 'LOCAL',
    configured: true,
    availability: 'AVAILABLE',
    supported: [TAU_CAPABILITIES.TEXT_REASONING, TAU_CAPABILITIES.CODE],
    priority: 0,
    defaultModel: 'tau-foundation-v1',
  });
  const t13 = route({
    capability: TAU_CAPABILITIES.TEXT_REASONING,
    privacyMode: 'LOCAL_ONLY',
    substrates: [tauReady, localOllama],
  });
  assert(t13.success && t13.substrateId === 'tau-foundation', 'TEST 13 tau foundation routable when available');
  n++;

  // TEST 14 — deterministic repeat
  const req = {
    capability: TAU_CAPABILITIES.CODE,
    privacyMode: 'REMOTE_ALLOWED' as const,
    substrates: [remoteDeepseek, remoteOpenai],
  };
  const r1 = route(req);
  const r2 = route(req);
  assert(
    r1.success && r2.success && r1.substrateId === r2.substrateId && r1.modelId === r2.modelId,
    'TEST 14 identical decisions',
  );
  n++;

  // TEST 15
  const t15 = route({
    capability: TAU_CAPABILITIES.IMAGE_GENERATION,
    privacyMode: 'REMOTE_ALLOWED',
    substrates: [remoteOpenai, remoteDeepseek],
  });
  assert(!t15.success && t15.failureCode === 'CAPABILITY_UNSUPPORTED', 'TEST 15 typed failure');
  n++;

  console.log(`PASS  AI-3.2 deterministic router (${n} tests)`);
}

main();
