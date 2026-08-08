/**
 * AI-6 — Tau Tool Registry Foundation test matrix.
 */
import { TAU_CAPABILITIES } from '../src/capabilities/types';
import type { Constitution } from '../src/constitution/constitution';
import { createTauConstitutionV01 } from '../src/constitution/tau-constitution-v01';
import {
  CALCULATOR_TEST_TOOL,
  CONFIRMATION_TEST_TOOL,
  ECHO_TEST_TOOL,
  HIGH_IMPACT_TEST_TOOL,
  REMOTE_TEST_TOOL,
  SYSTEM_SCOPE_TEST_TOOL,
  UNAVAILABLE_TEST_TOOL,
  createGovernedToolExecutor,
  createToolRegistry,
  registerTestTools,
  type ToolRequest,
} from '../src';

function assert(c: boolean, m: string) {
  if (!c) throw new Error(m);
}

function baseRequest(overrides: Partial<ToolRequest> & Pick<ToolRequest, 'toolId'>): ToolRequest {
  return {
    requestId: `req-${Math.random().toString(36).slice(2, 9)}`,
    requestedBy: 'USER',
    capability: TAU_CAPABILITIES.GENERAL_TOOL_USE,
    scope: 'USER',
    input: {},
    privacyMode: 'REMOTE_ALLOWED',
    authorization: { granted: true, authorizedScopes: ['USER'] },
    confirmation: { required: false },
    provenance: { source: 'TEST', timestamp: new Date().toISOString() },
    userId: 'user-1',
    ...overrides,
  };
}

async function main() {
  const constitution = createTauConstitutionV01();
  const registry = createToolRegistry();
  const executor = createGovernedToolExecutor({ registry, constitution });
  let n = 0;

  // 1. valid tool registration
  const reg = registry.register(ECHO_TEST_TOOL);
  assert(reg.success && reg.toolId === 'test.echo', 'valid registration');
  n++;

  // 2. duplicate tool rejection
  const dup = registry.register(ECHO_TEST_TOOL);
  assert(dup.success === false && (dup.error?.includes('Duplicate') ?? false), 'duplicate rejection');
  n++;

  // 3. malformed schema rejection
  const bad = registry.register({
    ...ECHO_TEST_TOOL,
    id: 'bad.tool',
    inputSchema: {},
  });
  assert(bad.success === false, 'malformed schema rejection');
  n++;

  registerTestTools(registry);

  // 4. tool discovery
  assert(executor.discover().length >= 8, 'tool discovery');
  n++;

  // 5. capability filtering
  const codeTools = registry.findByCapability(TAU_CAPABILITIES.CODE);
  assert(codeTools.some((t) => t.id === 'test.calculator'), 'capability filtering');
  n++;

  // 6. unavailable tool
  const unavail = await executor.request(
    baseRequest({ toolId: 'test.unavailable', capability: TAU_CAPABILITIES.GENERAL_TOOL_USE }),
  );
  assert(unavail.status === 'UNAVAILABLE' && !unavail.executed, 'unavailable tool');
  n++;

  // 7. disabled tool
  const disabled = await executor.request(baseRequest({ toolId: 'test.disabled' }));
  assert(disabled.status === 'BLOCKED' && !disabled.executed, 'disabled tool');
  n++;

  // 8. unauthorized request
  const unauth = await executor.request(
    baseRequest({
      toolId: 'test.echo',
      authorization: { granted: false, authorizedScopes: [] },
      input: { message: 'hi' },
    }),
  );
  assert(unauth.status === 'BLOCKED' && !unauth.executed, 'unauthorized');
  n++;

  // 9. valid authorized request
  const ok = await executor.request(
    baseRequest({
      toolId: 'test.echo',
      input: { message: 'hello' },
    }),
  );
  assert(ok.status === 'SUCCESS' && ok.executed, 'valid authorized');
  n++;

  // 10. insufficient scope
  const scopeFail = await executor.request(
    baseRequest({
      toolId: 'test.system-scope',
      scope: 'SYSTEM',
      authorization: { granted: true, authorizedScopes: ['USER'] },
      confirmation: { required: true, granted: true },
    }),
  );
  assert(scopeFail.status === 'BLOCKED' && !scopeFail.executed, 'insufficient scope');
  n++;

  // 11. scope escalation attempt
  const escalation = await executor.request(
    baseRequest({
      toolId: 'test.system-scope',
      scope: 'SYSTEM',
      authorization: { granted: true, authorizedScopes: ['USER'] },
    }),
  );
  assert(escalation.status === 'BLOCKED', 'scope escalation blocked');
  n++;

  // 12. LOCAL_ONLY privacy violation
  const localBlock = await executor.request(
    baseRequest({
      toolId: 'test.remote',
      privacyMode: 'LOCAL_ONLY',
      authorization: { granted: true, authorizedScopes: ['USER'] },
    }),
  );
  assert(localBlock.status === 'BLOCKED', 'LOCAL_ONLY violation');
  n++;

  // 13. constitution BLOCK
  const blockingConstitution: Constitution = {
    evaluateRequest: async () => ({ allowed: true }),
    evaluateToolUse: async () => ({ allowed: false, reason: 'Constitution blocked' }),
    evaluateExecution: async () => ({ allowed: true }),
    evaluateMemoryWrite: async () => ({ allowed: true }),
    evaluateModelAccess: async () => ({ allowed: true }),
  };
  const blockExec = createGovernedToolExecutor({ registry, constitution: blockingConstitution });
  const blocked = await blockExec.request(
    baseRequest({ toolId: 'test.echo', input: { message: 'x' } }),
  );
  assert(blocked.status === 'BLOCKED' && !blocked.executed, 'constitution block');
  n++;

  // 14. confirmation required
  const confirmReq = await executor.request(
    baseRequest({
      toolId: 'test.confirmation',
      input: { action: 'send' },
      requestedBy: 'MODEL',
      confirmation: { required: true },
    }),
  );
  assert(confirmReq.status === 'REQUIRES_CONFIRMATION' && !confirmReq.executed, 'confirmation required');
  n++;

  // 15. confirmation granted
  const confirmOk = await executor.request(
    baseRequest({
      toolId: 'test.confirmation',
      input: { action: 'send' },
      confirmation: { required: true, granted: true },
    }),
  );
  assert(confirmOk.status === 'SUCCESS' && confirmOk.executed, 'confirmation granted');
  n++;

  // 16. confirmation denied
  const confirmDeny = await executor.request(
    baseRequest({
      toolId: 'test.confirmation',
      input: { action: 'send' },
      confirmation: { required: true, denied: true },
    }),
  );
  assert(confirmDeny.status === 'BLOCKED' && !confirmDeny.executed, 'confirmation denied');
  n++;

  // 17. external side-effect protection
  const ext = await executor.request(
    baseRequest({
      toolId: 'test.confirmation',
      input: { action: 'post' },
      requestedBy: 'MODEL',
      confirmation: { required: false },
    }),
  );
  assert(ext.status === 'REQUIRES_CONFIRMATION' && !ext.executed, 'external side-effect protection');
  n++;

  // 18. high-impact action protection
  const hi = await executor.request(
    baseRequest({
      toolId: 'test.high-impact',
      input: { target: 'prod' },
      requestedBy: 'MODEL',
      confirmation: { required: false },
    }),
  );
  assert(hi.status === 'REQUIRES_CONFIRMATION' && !hi.executed, 'high-impact protection');
  n++;

  // 19. provenance preservation
  const described = executor.describe('test.echo');
  assert(described?.provenance.provider === 'tau-test', 'provenance preserved');
  n++;

  // 20. audit metadata only
  const logs = executor.getAuditLog();
  const serialized = JSON.stringify(logs);
  assert(!serialized.includes('hello') && !serialized.includes('secret'), 'no sensitive audit content');
  assert(logs.every((l) => l.toolId && l.requestId), 'audit metadata present');
  n++;

  // 21. deterministic repeated decision
  const r1 = await executor.request(
    baseRequest({ toolId: 'test.calculator', capability: TAU_CAPABILITIES.CODE, input: { a: 2, b: 3, op: '+' } }),
  );
  const r2 = await executor.request(
    baseRequest({ toolId: 'test.calculator', capability: TAU_CAPABILITIES.CODE, input: { a: 2, b: 3, op: '+' } }),
  );
  assert(r1.status === r2.status && r1.executed === r2.executed, 'deterministic repeat');
  n++;

  // 22. model cannot bypass confirmation
  const modelBypass = await executor.request(
    baseRequest({
      toolId: 'test.high-impact',
      input: { target: 'x' },
      requestedBy: 'MODEL',
      confirmation: { required: false, granted: false },
    }),
  );
  assert(!modelBypass.executed && modelBypass.status === 'REQUIRES_CONFIRMATION', 'model cannot bypass');
  n++;

  // 23. memory cannot grant authority
  const memAuth = await executor.request(
    baseRequest({
      toolId: 'test.high-impact',
      input: { target: 'x' },
      authorization: { granted: true, authorizedScopes: ['USER'], fromMemory: true },
      confirmation: { required: true, granted: true },
    }),
  );
  assert(memAuth.status === 'BLOCKED' && !memAuth.executed, 'memory cannot grant authority');
  n++;

  // 24. non-execution accurately reported
  assert(unavail.executed === false && unavail.status === 'UNAVAILABLE', 'non-execution reported');
  n++;

  // 25. tool version/provenance retained
  assert(ok.toolVersion === '0.1.0' && described?.version === '0.1.0', 'version retained');
  n++;

  console.log(`PASS  AI-6 tool matrix (${n} scenarios)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
