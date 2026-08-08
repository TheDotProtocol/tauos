/**
 * AI-3.2 — shadow routing smoke test (gateway substrates, log only).
 */
import { TAU_CAPABILITIES } from '@tau/ai';
import { shadowRouteFromGateway } from '../src/lib/tau-ai/shadow-routing';

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const entry = shadowRouteFromGateway({
  requestId: 'shadow-smoke-1',
  capability: TAU_CAPABILITIES.TEXT_REASONING,
  privacyMode: 'REMOTE_ALLOWED',
});

assert(entry.shadow === true, 'shadow flag');
assert(entry.productionPath === 'unchanged', 'production unchanged');
assert(entry.routingPolicyVersion === 'ai-3.3-v1', 'policy version');
assert(entry.metrics !== undefined, 'shadow metrics present');
assert(Array.isArray(entry.rejectedSubstrates), 'rejections logged');

console.log('PASS  AI-3.2 shadow routing smoke');
console.log(
  entry.success
    ? `  selected: ${entry.substrateId} — ${entry.selectionSummary}`
    : `  failure: ${entry.failureSummary}`,
);
