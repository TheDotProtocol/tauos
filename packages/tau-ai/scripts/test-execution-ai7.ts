/**
 * AI-7 — Tau Execution Foundation test matrix.
 */
import { TAU_CAPABILITIES } from '../src/capabilities/types';
import type { Constitution } from '../src/constitution/constitution';
import { TAU_CONSTITUTION_VERSION } from '../src/constitution/types';
import { createTauConstitutionV01 } from '../src/constitution/tau-constitution-v01';
import {
  CONFIRMATION_EXECUTION_ADAPTER,
  FAILING_EXECUTION_ADAPTER,
  NOOP_EXECUTION_ADAPTER,
  READONLY_EXECUTION_ADAPTER,
  REMOTE_EXECUTION_ADAPTER,
  UNAVAILABLE_EXECUTION_ADAPTER,
  assertNoDirectAdapterInvocation,
  createExecutionAdapterRegistry,
  createGovernedExecutionExecutor,
  registerTestExecutionAdapters,
  type GovernedExecutionRequest,
} from '../src';

function assert(c: boolean, m: string) {
  if (!c) throw new Error(m);
}

function baseRequest(
  overrides: Partial<GovernedExecutionRequest> & Pick<GovernedExecutionRequest, 'executionAdapterId'>,
): GovernedExecutionRequest {
  return {
    requestId: `req-${Math.random().toString(36).slice(2, 9)}`,
    toolId: 'test.tool',
    requestedBy: 'USER',
    capability: TAU_CAPABILITIES.GENERAL_TOOL_USE,
    scope: 'USER',
    privacyMode: 'REMOTE_ALLOWED',
    sideEffectClass: 'NO_SIDE_EFFECT',
    authorization: {
      toolAuthorized: true,
      executionAuthorized: true,
      authorizedScopes: ['USER'],
    },
    confirmation: { required: false },
    input: { value: 1 },
    provenance: { source: 'TEST', timestamp: new Date().toISOString() },
    constitutionVersion: TAU_CONSTITUTION_VERSION,
    userId: 'user-1',
    ...overrides,
  };
}

async function main() {
  const constitution = createTauConstitutionV01();
  const registry = createExecutionAdapterRegistry();
  const executor = createGovernedExecutionExecutor({ registry, constitution });
  let n = 0;

  // 1. valid adapter registration
  const reg = registry.register(NOOP_EXECUTION_ADAPTER);
  assert(reg.success === true && reg.adapterId === 'exec.noop', 'valid registration');
  n++;

  // 2. duplicate adapter rejection
  const dup = registry.register(NOOP_EXECUTION_ADAPTER);
  assert(dup.success === false && (dup.error?.includes('Duplicate') ?? false), 'duplicate rejection');
  n++;

  // 3. malformed adapter rejection
  const bad = registry.register({ ...NOOP_EXECUTION_ADAPTER, id: 'bad id!', supportedCapabilities: [] });
  assert(bad.success === false, 'malformed rejection');
  n++;

  registerTestExecutionAdapters(registry);

  // 4. adapter discovery
  assert(executor.listAdapters().length >= 10, 'adapter discovery');
  n++;

  // 5. capability filtering
  assert(registry.findByCapability(TAU_CAPABILITIES.GENERAL_TOOL_USE).length >= 1, 'capability filter');
  n++;

  // 6. environment filtering
  assert(registry.findByEnvironment('CONTAINER').some((a) => a.id === 'exec.container'), 'environment filter');
  n++;

  // 7. unavailable adapter
  const unavail = await executor.execute(baseRequest({ executionAdapterId: 'exec.unavailable' }));
  assert(unavail.status === 'UNAVAILABLE' && unavail.executed === false, 'unavailable adapter');
  n++;

  // 8. disabled adapter
  const disabled = await executor.execute(baseRequest({ executionAdapterId: 'exec.disabled' }));
  assert(disabled.status === 'BLOCKED' && disabled.executed === false, 'disabled adapter');
  n++;

  // 9. authorization failure
  const unauth = await executor.execute(
    baseRequest({
      executionAdapterId: 'exec.noop',
      authorization: { toolAuthorized: true, executionAuthorized: false, authorizedScopes: ['USER'] },
    }),
  );
  assert(unauth.status === 'BLOCKED' && unauth.executed === false, 'authorization failure');
  n++;

  // 10. valid authorized execution
  const ok = await executor.execute(baseRequest({ executionAdapterId: 'exec.noop' }));
  assert(ok.status === 'SUCCESS' && ok.executed === true, 'valid authorized execution');
  n++;

  // 11. scope violation
  const scopeFail = await executor.execute(
    baseRequest({
      executionAdapterId: 'exec.system',
      scope: 'SYSTEM',
      sideEffectClass: 'HIGH_IMPACT_SIDE_EFFECT',
      authorization: { toolAuthorized: true, executionAuthorized: true, authorizedScopes: ['USER'] },
      confirmation: { required: true, granted: true },
    }),
  );
  assert(scopeFail.status === 'BLOCKED', 'scope violation');
  n++;

  // 12. scope escalation
  const escalation = await executor.execute(
    baseRequest({
      executionAdapterId: 'exec.system',
      scope: 'SYSTEM',
      sideEffectClass: 'HIGH_IMPACT_SIDE_EFFECT',
      authorization: { toolAuthorized: true, executionAuthorized: true, authorizedScopes: ['USER'] },
    }),
  );
  assert(escalation.status === 'BLOCKED', 'scope escalation');
  n++;

  // 13. LOCAL_ONLY violation
  const localBlock = await executor.execute(
    baseRequest({
      executionAdapterId: 'exec.remote',
      privacyMode: 'LOCAL_ONLY',
      requiredEnvironment: 'REMOTE',
      sideEffectClass: 'LOCAL_SIDE_EFFECT',
    }),
  );
  assert(localBlock.status === 'BLOCKED' || localBlock.status === 'UNAVAILABLE', 'LOCAL_ONLY violation');
  n++;

  // 14. constitution BLOCK
  const blockingConstitution: Constitution = {
    evaluateRequest: async () => ({ allowed: true }),
    evaluateToolUse: async () => ({ allowed: true }),
    evaluateExecution: async () => ({ allowed: false, reason: 'Constitution blocked execution' }),
    evaluateMemoryWrite: async () => ({ allowed: true }),
    evaluateModelAccess: async () => ({ allowed: true }),
  };
  const blockExec = createGovernedExecutionExecutor({ registry, constitution: blockingConstitution });
  const blocked = await blockExec.execute(baseRequest({ executionAdapterId: 'exec.noop' }));
  assert(blocked.status === 'BLOCKED' && blocked.executed === false, 'constitution block');
  n++;

  // 15. confirmation required
  const confirmReq = await executor.execute(
    baseRequest({
      executionAdapterId: 'exec.confirmation',
      sideEffectClass: 'EXTERNAL_SIDE_EFFECT',
      requestedBy: 'MODEL',
      confirmation: { required: true },
    }),
  );
  assert(confirmReq.status === 'REQUIRES_CONFIRMATION' && confirmReq.executed === false, 'confirmation required');
  n++;

  // 16. confirmation granted
  const confirmOk = await executor.execute(
    baseRequest({
      executionAdapterId: 'exec.confirmation',
      sideEffectClass: 'EXTERNAL_SIDE_EFFECT',
      confirmation: { required: true, granted: true },
    }),
  );
  assert(confirmOk.status === 'SUCCESS' && confirmOk.executed === true, 'confirmation granted');
  n++;

  // 17. confirmation denied
  const confirmDeny = await executor.execute(
    baseRequest({
      executionAdapterId: 'exec.confirmation',
      sideEffectClass: 'EXTERNAL_SIDE_EFFECT',
      confirmation: { required: true, denied: true },
    }),
  );
  assert(confirmDeny.status === 'BLOCKED' && confirmDeny.executed === false, 'confirmation denied');
  n++;

  // 18. external side-effect protection
  const ext = await executor.execute(
    baseRequest({
      executionAdapterId: 'exec.confirmation',
      sideEffectClass: 'EXTERNAL_SIDE_EFFECT',
      requestedBy: 'MODEL',
      confirmation: { required: false },
    }),
  );
  assert(ext.status === 'REQUIRES_CONFIRMATION' && ext.executed === false, 'external protection');
  n++;

  // 19. high-impact protection
  const hi = await executor.execute(
    baseRequest({
      executionAdapterId: 'exec.high-impact',
      sideEffectClass: 'HIGH_IMPACT_SIDE_EFFECT',
      requestedBy: 'MODEL',
      confirmation: { required: false },
    }),
  );
  assert(hi.status === 'REQUIRES_CONFIRMATION' && hi.executed === false, 'high-impact protection');
  n++;

  // 20. model cannot bypass execution policy
  const modelBypass = await executor.execute(
    baseRequest({
      executionAdapterId: 'exec.high-impact',
      sideEffectClass: 'HIGH_IMPACT_SIDE_EFFECT',
      requestedBy: 'MODEL',
      confirmation: { required: false, granted: false },
    }),
  );
  assert(!modelBypass.executed, 'model cannot bypass');
  n++;

  // 21. tool cannot bypass execution policy
  const toolBypass = await executor.execute(
    baseRequest({
      executionAdapterId: 'exec.noop',
      authorization: { toolAuthorized: false, executionAuthorized: true, authorizedScopes: ['USER'] },
    }),
  );
  assert(toolBypass.status === 'BLOCKED' && toolBypass.executed === false, 'tool cannot bypass');
  n++;

  // 22. memory cannot grant execution authority
  const memAuth = await executor.execute(
    baseRequest({
      executionAdapterId: 'exec.high-impact',
      sideEffectClass: 'HIGH_IMPACT_SIDE_EFFECT',
      authorization: {
        toolAuthorized: true,
        executionAuthorized: true,
        authorizedScopes: ['USER'],
        fromMemory: true,
      },
      confirmation: { required: true, granted: true },
    }),
  );
  assert(memAuth.status === 'BLOCKED' && memAuth.executed === false, 'memory cannot grant authority');
  n++;

  // 23. adapter failure
  const fail = await executor.execute(baseRequest({ executionAdapterId: 'exec.failing' }));
  assert(fail.status === 'FAILED' && fail.executed === false, 'adapter failure');
  n++;

  // 24. unavailable environment
  const envFail = await executor.execute(
    baseRequest({
      executionAdapterId: 'exec.noop',
      requiredEnvironment: 'REMOTE',
    }),
  );
  assert(envFail.status === 'UNAVAILABLE' && envFail.executed === false, 'unavailable environment');
  n++;

  // 25. executed=false when not executed
  assert(unavail.executed === false, 'executed false accurate');
  n++;

  // 26. provenance preserved
  const described = executor.describeAdapter('exec.readonly');
  assert(described?.provenance.provider === 'tau-test', 'provenance preserved');
  n++;

  // 27. audit metadata only
  const logs = executor.getAuditLog();
  const serialized = JSON.stringify(logs);
  assert(!serialized.includes('secret') && logs.length > 0, 'audit metadata only');
  n++;

  // 28. deterministic repeated decision
  const r1 = await executor.execute(baseRequest({ executionAdapterId: 'exec.readonly', input: { query: 'x' } }));
  const r2 = await executor.execute(baseRequest({ executionAdapterId: 'exec.readonly', input: { query: 'x' } }));
  assert(r1.status === r2.status && r1.executed === r2.executed, 'deterministic repeat');
  n++;

  // 29. adapter version retained
  assert(ok.adapterVersion === '0.1.0', 'adapter version retained');
  n++;

  // 30. constitution version retained
  assert(ok.constitutionVersion === TAU_CONSTITUTION_VERSION, 'constitution version retained');
  n++;

  // direct adapter bypass blocked
  let bypassBlocked = false;
  try {
    assertNoDirectAdapterInvocation();
  } catch {
    bypassBlocked = true;
  }
  assert(bypassBlocked, 'direct adapter invocation blocked');
  n++;

  console.log(`PASS  AI-7 execution matrix (${n} scenarios)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
