/**
 * AI-11 — Ecosystem integration contract tests.
 * Run: npx tsx scripts/test-ecosystem-ai11.ts
 */

import fs from 'node:fs';
import path from 'node:path';
import type { EcosystemProductRegistration } from '@tau/ai';
import {
  ECOSYSTEM_PRODUCTS,
  getEcosystemBoundaries,
  getProductRegistration,
} from '../src/lib/tau-ai/ecosystem-registry';
import {
  TAUMAIL_APP_ID,
  TAUMAIL_SYSTEM_PREAMBLE,
  runTauMailFoundationChat,
} from '../src/lib/taumail/foundation-bridge';
import {
  createEcosystemFoundationClient,
  resetEcosystemFoundationCache,
} from '../src/lib/tau-ai/ecosystem-foundation-service';

const ROOT = path.resolve(__dirname, '..');

function assert(condition: boolean, label: string) {
  if (!condition) throw new Error(`FAIL: ${label}`);
}

function read(rel: string): string {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

console.log('=== AI-11 Tau Ecosystem Integration Tests ===');

// Contract types exported from @tau/ai
const contractSource = read('packages/tau-ai/src/ecosystem/types.ts');
assert(contractSource.includes('EcosystemIntegrationLevel'), 'integration level type');
assert(contractSource.includes('EcosystemProductContext'), 'product context type');
assert(contractSource.includes('EcosystemChatResult'), 'chat result type');

// packages/tau-ai must NOT import product logic
const pkgIndex = read('packages/tau-ai/src/index.ts');
assert(!pkgIndex.includes('taumail'), 'no taumail in package index');
const foundationPkg = read('packages/tau-ai/src/foundation/pipeline.ts');
assert(!/taumail|tautalk|grayscale|athena/i.test(foundationPkg), 'foundation has no product imports');

// Ecosystem foundation service
assert(read('src/lib/tau-ai/ecosystem-foundation-service.ts').includes('createEcosystemFoundationClient'), 'ecosystem service');
assert(read('src/lib/tau-ai/ecosystem-foundation-service.ts').includes('createTauFoundationClient'), 'uses TauFoundationClient');

// TauMail bridge — product layer outside packages/tau-ai
assert(read('src/lib/taumail/foundation-bridge.ts').includes('createEcosystemFoundationClient'), 'taumail bridge');
assert(read('src/lib/taumail/foundation-bridge.ts').includes(TAUMAIL_APP_ID), 'taumail app id');
assert(TAUMAIL_SYSTEM_PREAMBLE.includes('cannot send'), 'mail execution boundary in preamble');
assert(read('src/app/api/taumail/ai/route.ts').includes('runTauMailFoundationChat'), 'taumail API uses foundation bridge');
assert(read('src/app/api/taumail/ai/route.ts').includes('runAiChat'), 'legacy fallback preserved');

// Status route
assert(read('src/app/api/tau-foundation/ecosystem/route.ts').includes('getEcosystemRegistry'), 'ecosystem status route');

// Registry readiness
const taumail = getProductRegistration('taumail') as EcosystemProductRegistration;
assert(taumail.readiness === 'READY', 'taumail READY');
const tautalk = getProductRegistration('tautalk') as EcosystemProductRegistration;
assert(tautalk.readiness === 'NOT_READY', 'tautalk NOT_READY');
const developer = getProductRegistration('tau-developer') as EcosystemProductRegistration;
assert(developer.readiness === 'PARTIALLY_READY', 'tau developer PARTIALLY_READY');

const boundaries = getEcosystemBoundaries();
assert(boundaries.memoryRule.includes('appId'), 'memory boundary documented');
assert(boundaries.executionRule.includes('confirmation'), 'execution boundary documented');

// Adapter verification — foundation client per appId
resetEcosystemFoundationCache();
const mailClient = createEcosystemFoundationClient('taumail');
const appClient = createEcosystemFoundationClient('tau-ai-app');
assert(mailClient.appId === 'taumail', 'mail client appId');
assert(appClient.appId === 'tau-ai-app', 'app client appId');
assert(mailClient !== appClient, 'separate clients per product');

// Integration verification — TauMail foundation chat (may use stub substrate)
async function runIntegrationChecks() {
  const chatResult = await runTauMailFoundationChat({
    userId: 'test-user-ai11',
    messages: [{ role: 'user', content: 'Summarize my unread emails briefly.' }],
    privacyMode: true,
  });
  assert(chatResult.appId === TAUMAIL_APP_ID, 'chat result appId');
  assert(chatResult.integrationPath === 'foundation', 'foundation path');
  assert(typeof chatResult.message === 'string', 'chat message string');
  assert(
    ['ADAPTER_VERIFIED', 'INTEGRATION_VERIFIED', 'LIVE_MODEL_VERIFIED'].includes(chatResult.integrationLevel),
    'honest integration level',
  );

  // Tau Developer unchanged — still runAiChat
  assert(read('src/app/api/tau-ide/architect/route.ts').includes('runAiChat'), 'developer architect legacy path preserved');

  // Production boundary
  assert(read('src/app/api/tauai/chat/route.ts').includes('runAiChat'), 'production chat unchanged');

  console.log(`PASS  AI-11 ecosystem tests (${ECOSYSTEM_PRODUCTS.length} products registered)`);
  console.log(`      TauMail integration: ${chatResult.integrationLevel} via ${chatResult.integrationPath}`);
}

runIntegrationChecks().catch((error) => {
  console.error(error);
  process.exit(1);
});
