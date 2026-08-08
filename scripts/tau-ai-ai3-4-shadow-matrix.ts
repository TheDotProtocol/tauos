/**
 * AI-3.4 — shadow routing comparison matrix (metadata only).
 */
import { TAU_CAPABILITIES } from '@tau/ai';
import { shadowRouteFromGateway } from '../src/lib/tau-ai/shadow-routing';

const SCENARIOS = [
  { capability: TAU_CAPABILITIES.TEXT_REASONING, privacyMode: 'REMOTE_ALLOWED' as const },
  { capability: TAU_CAPABILITIES.CODE, privacyMode: 'REMOTE_ALLOWED' as const },
  { capability: TAU_CAPABILITIES.TEXT_REASONING, privacyMode: 'LOCAL_ONLY' as const },
  { capability: TAU_CAPABILITIES.CODE, privacyMode: 'LOCAL_ONLY' as const },
  { capability: TAU_CAPABILITIES.IMAGE_UNDERSTANDING, privacyMode: 'REMOTE_ALLOWED' as const },
];

let agreements = 0;
let failures = 0;

for (const scenario of SCENARIOS) {
  const entry = shadowRouteFromGateway({
    requestId: `shadow-matrix-${scenario.capability}-${scenario.privacyMode}`,
    ...scenario,
  });

  if (!entry.metrics) throw new Error('missing metrics');

  if (entry.success && entry.metrics.routingAgreement) agreements++;
  if (!entry.success) failures++;

  console.log(
    `  ${scenario.capability} + ${scenario.privacyMode}: ` +
      (entry.success ? `selected=${entry.substrateId}` : `failure=${entry.failureCode}`) +
      ` agreement=${entry.metrics.routingAgreement ?? 'n/a'}`,
  );
}

console.log('PASS  AI-3.4 shadow matrix');
console.log(`  scenarios=${SCENARIOS.length} agreements=${agreements} noEligible=${failures}`);
