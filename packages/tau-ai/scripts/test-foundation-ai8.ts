/**
 * AI-8 — Tau Foundation v0.1 composition / shadow integration tests.
 */
import {
  TAU_CAPABILITIES,
  buildSubstrateMetadata,
  createDefaultFoundationPipeline,
  createTauFoundationClient,
  createTauFoundationPipeline,
  createTauConstitutionV01,
  createInMemoryGovernedMemoryStore,
  createDeterministicModelRouter,
  createGovernedToolExecutor,
  createGovernedExecutionExecutor,
  createToolRegistry,
  createExecutionAdapterRegistry,
  registerTestTools,
  registerTestExecutionAdapters,
  createTauFoundationSubstrateStub,
  preferenceKeyTag,
  type IntelligenceService,
  type ModelSubstrate,
  type RoutableSubstrate,
} from '../src';

function assert(c: boolean, m: string) {
  if (!c) throw new Error(m);
}

function mockSubstrate(
  id: string,
  opts: {
    privacyClass: 'LOCAL' | 'REMOTE';
    configured: boolean;
    avail: 'AVAILABLE' | 'LOCAL' | 'REMOTE' | 'NOT_CONFIGURED' | 'UNAVAILABLE';
    supported: string[];
    priority?: number;
  },
): RoutableSubstrate {
  const metadata = buildSubstrateMetadata({
    supportedCapabilities: opts.supported as never[],
    unsupportedCapabilities: [],
    privacyClass: opts.privacyClass,
    costClass: opts.privacyClass === 'LOCAL' ? 'FREE' : 'UNKNOWN',
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
      weightsLocation: opts.privacyClass === 'LOCAL' ? 'LOCAL' : 'REMOTE',
      architecture: 'UNKNOWN',
      modalities: ['text'],
    },
  });
  const s: ModelSubstrate = {
    id,
    kind: opts.privacyClass === 'LOCAL' ? 'local' : 'remote',
    label: id,
    metadata,
    isConfigured: () => opts.configured,
    getAvailability: () => opts.avail,
    listCapabilities: () => [{ id: 'm', label: 'm', available: opts.configured }],
    async complete() {
      return { message: 'ok', model: 'm' };
    },
  };
  return { substrate: s, priority: opts.priority ?? 10 };
}

function buildTestSubstrates(): RoutableSubstrate[] {
  return [
    mockSubstrate('local', {
      privacyClass: 'LOCAL',
      configured: true,
      avail: 'LOCAL',
      supported: [TAU_CAPABILITIES.TEXT_REASONING, TAU_CAPABILITIES.CODE, TAU_CAPABILITIES.GENERAL_TOOL_USE],
      priority: 5,
    }),
    mockSubstrate('remote', {
      privacyClass: 'REMOTE',
      configured: true,
      avail: 'REMOTE',
      supported: [TAU_CAPABILITIES.TEXT_REASONING, TAU_CAPABILITIES.CODE],
      priority: 10,
    }),
    { substrate: createTauFoundationSubstrateStub(), priority: 100 },
  ];
}

const mockIntelligence: IntelligenceService = {
  async chat() {
    return { message: 'shadow-ok', substrateId: 'local', model: 'shadow-model' };
  },
};

async function main() {
  const substrates = buildTestSubstrates();
  const pipeline = createDefaultFoundationPipeline({
    substrates,
    intelligence: mockIntelligence,
  });
  let n = 0;

  // 1. Normal text reasoning
  const text = await pipeline.process({
    messages: [{ role: 'user', content: 'Explain recursion.' }],
    userId: 'u1',
  });
  assert(text.capability === TAU_CAPABILITIES.TEXT_REASONING && text.routing.success, 'text reasoning');
  n++;

  // 2. Code request
  const code = await pipeline.process({
    messages: [{ role: 'user', content: '```python\nprint(1)\n```' }],
    userId: 'u1',
  });
  assert(code.capability === TAU_CAPABILITIES.CODE, 'code request');
  n++;

  // 3. Local-only request
  const local = await pipeline.process({
    messages: [{ role: 'user', content: 'keep local' }],
    options: { privacyMode: true },
    userId: 'u1',
  });
  assert(local.privacyMode === 'LOCAL_ONLY' && local.routing.success, 'local only');
  assert(local.routing.success && local.routing.substrateId === 'local', 'local substrate');
  n++;

  // 4. Remote-allowed request
  const remote = await pipeline.process({
    messages: [{ role: 'user', content: 'hello' }],
    userId: 'u1',
  });
  assert(remote.privacyMode === 'REMOTE_ALLOWED' && remote.routing.success, 'remote allowed');
  n++;

  // 5. No eligible substrate
  const emptyPipeline = createDefaultFoundationPipeline({
    substrates: [
      mockSubstrate('vision-only', {
        privacyClass: 'REMOTE',
        configured: true,
        avail: 'REMOTE',
        supported: [TAU_CAPABILITIES.IMAGE_GENERATION],
      }),
    ],
  });
  const noElig = await emptyPipeline.process({
    messages: [{ role: 'user', content: 'hello' }],
    capabilityOverride: TAU_CAPABILITIES.TEXT_REASONING,
  });
  assert(!noElig.routing.success, 'no eligible substrate');
  n++;

  // 6. Constitution BLOCK
  const blocked = await pipeline.process({
    messages: [{ role: 'user', content: 'secret' }],
    options: { privacyMode: true, substrate: 'remote' },
    userId: 'u1',
  });
  assert(!blocked.constitutionAllowed || blocked.shadow.constitutionResult === 'BLOCK', 'constitution block');
  n++;

  // 7. Memory write allowed
  const memOk = await pipeline.process({
    messages: [{ role: 'user', content: 'remember' }],
    userId: 'u1',
    memoryWrite: {
      input: {
        category: 'PREFERENCE_MEMORY',
        content: 'concise',
        source: 'USER_EXPLICIT',
        originKind: 'EXPLICIT',
        scope: 'USER',
        retentionPolicy: 'USER_CONTROLLED',
        consentState: 'GRANTED',
        userId: 'u1',
        tags: [preferenceKeyTag('style')],
        privacyClass: 'LOCAL',
      },
    },
  });
  assert(memOk.memoryWrite?.outcome === 'STORED', 'memory write allowed');
  n++;

  // 8. Memory write rejected
  const memBad = await pipeline.process({
    messages: [{ role: 'user', content: 'bad memory' }],
    userId: 'u1',
    memoryWrite: {
      input: {
        category: 'PREFERENCE_MEMORY',
        content: 'bad',
        source: 'USER_EXPLICIT',
        originKind: 'EXPLICIT',
        scope: 'USER',
        retentionPolicy: 'USER_CONTROLLED',
        userId: 'u1',
        metadataConflictsWithPrivacy: true,
        privacyClass: 'LOCAL',
      },
    },
  });
  assert(memBad.memoryWrite?.outcome === 'REJECTED', 'memory write rejected');
  n++;

  // 9. Tool request authorized
  const toolOk = await pipeline.process({
    messages: [{ role: 'user', content: 'echo' }],
    userId: 'u1',
    toolRequest: {
      requestId: 't1',
      toolId: 'test.echo',
      requestedBy: 'USER',
      capability: TAU_CAPABILITIES.GENERAL_TOOL_USE,
      scope: 'USER',
      input: { message: 'hi' },
      authorization: { granted: true, authorizedScopes: ['USER'] },
      confirmation: { required: false },
      provenance: { source: 'TEST', timestamp: new Date().toISOString() },
    },
  });
  assert(toolOk.toolResult?.status === 'SUCCESS' && toolOk.toolResult.executed, 'tool authorized');
  n++;

  // 10. Tool confirmation required
  const toolConfirm = await pipeline.process({
    messages: [{ role: 'user', content: 'send' }],
    userId: 'u1',
    toolRequest: {
      requestId: 't2',
      toolId: 'test.confirmation',
      requestedBy: 'MODEL',
      capability: TAU_CAPABILITIES.GENERAL_TOOL_USE,
      scope: 'USER',
      input: { action: 'send' },
      authorization: { granted: true, authorizedScopes: ['USER'] },
      confirmation: { required: true },
      provenance: { source: 'TEST', timestamp: new Date().toISOString() },
    },
  });
  assert(toolConfirm.toolResult?.status === 'REQUIRES_CONFIRMATION', 'tool confirmation required');
  n++;

  // 11. Tool blocked
  const toolBlock = await pipeline.process({
    messages: [{ role: 'user', content: 'tool' }],
    userId: 'u1',
    toolRequest: {
      requestId: 't3',
      toolId: 'test.echo',
      requestedBy: 'USER',
      capability: TAU_CAPABILITIES.GENERAL_TOOL_USE,
      scope: 'USER',
      input: { message: 'x' },
      authorization: { granted: false, authorizedScopes: [] },
      confirmation: { required: false },
      provenance: { source: 'TEST', timestamp: new Date().toISOString() },
    },
  });
  assert(toolBlock.toolResult?.status === 'BLOCKED', 'tool blocked');
  n++;

  // 12. Execution allowed
  const execOk = await pipeline.process({
    messages: [{ role: 'user', content: 'run' }],
    userId: 'u1',
    executionRequest: {
      requestId: 'e1',
      toolId: 'test.tool',
      executionAdapterId: 'exec.noop',
      requestedBy: 'USER',
      capability: TAU_CAPABILITIES.GENERAL_TOOL_USE,
      scope: 'USER',
      sideEffectClass: 'NO_SIDE_EFFECT',
      authorization: { toolAuthorized: true, executionAuthorized: true, authorizedScopes: ['USER'] },
      confirmation: { required: false },
      input: { value: 1 },
      provenance: { source: 'TEST', timestamp: new Date().toISOString() },
    },
  });
  assert(execOk.executionResult?.status === 'SUCCESS' && execOk.executionResult.executed, 'execution allowed');
  n++;

  // 13. Execution blocked
  const execBlock = await pipeline.process({
    messages: [{ role: 'user', content: 'run' }],
    userId: 'u1',
    executionRequest: {
      requestId: 'e2',
      toolId: 'test.tool',
      executionAdapterId: 'exec.noop',
      requestedBy: 'USER',
      capability: TAU_CAPABILITIES.GENERAL_TOOL_USE,
      scope: 'USER',
      sideEffectClass: 'NO_SIDE_EFFECT',
      authorization: { toolAuthorized: true, executionAuthorized: false, authorizedScopes: ['USER'] },
      confirmation: { required: false },
      input: {},
      provenance: { source: 'TEST', timestamp: new Date().toISOString() },
    },
  });
  assert(execBlock.executionResult?.status === 'BLOCKED', 'execution blocked');
  n++;

  // 14. LOCAL_ONLY prevents remote execution
  const execLocal = await pipeline.process({
    messages: [{ role: 'user', content: 'remote exec' }],
    userId: 'u1',
    privacyModeOverride: 'LOCAL_ONLY',
    executionRequest: {
      requestId: 'e3',
      toolId: 'test.tool',
      executionAdapterId: 'exec.remote',
      requestedBy: 'USER',
      capability: TAU_CAPABILITIES.GENERAL_TOOL_USE,
      scope: 'USER',
      sideEffectClass: 'LOCAL_SIDE_EFFECT',
      authorization: { toolAuthorized: true, executionAuthorized: true, authorizedScopes: ['USER'] },
      confirmation: { required: false },
      input: {},
      provenance: { source: 'TEST', timestamp: new Date().toISOString() },
    },
  });
  assert(
    execLocal.executionResult?.status === 'BLOCKED' || execLocal.executionResult?.status === 'UNAVAILABLE',
    'LOCAL_ONLY execution block',
  );
  n++;

  // 15. Deterministic routing repeatability
  const r1 = await pipeline.process({ messages: [{ role: 'user', content: 'hi' }], userId: 'u1' });
  const r2 = await pipeline.process({ messages: [{ role: 'user', content: 'hi' }], userId: 'u1' });
  assert(
    r1.routing.success &&
      r2.routing.success &&
      r1.routing.substrateId === r2.routing.substrateId,
    'routing repeatability',
  );
  n++;

  // 16. Tau Foundation placeholder not configured
  assert(!pipeline.isTauFoundationConfigured(), 'tau-foundation not configured');
  n++;

  // 17. Shadow comparison metadata
  assert(text.shadow.shadow === true && text.shadow.productionPath === 'unchanged', 'shadow flag');
  n++;

  // 18. No private content in audit logs
  const logs = JSON.stringify([
    text.shadow,
    toolOk.shadow,
    execOk.shadow,
    ...(pipeline['deps'] ? [] : []),
  ]);
  assert(!logs.includes('shadow-ok') && !logs.includes('concise'), 'no private content in shadow logs');
  n++;

  // TauFoundationClient integration
  const client = createTauFoundationClient(
    { appId: 'test-app', userId: 'u1', intelligence: mockIntelligence },
    pipeline,
  );
  const chat = await client.chat({ messages: [{ role: 'user', content: 'hello' }] });
  assert(chat.shadowLog?.shadow === true && chat.message === 'shadow-ok', 'foundation client');
  n++;

  console.log(`PASS  AI-8 foundation matrix (${n} scenarios)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
