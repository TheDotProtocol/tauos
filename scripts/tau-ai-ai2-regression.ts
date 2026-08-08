/**
 * AI-2 regression — compare gateway path vs Tau AI intelligence path.
 * Uses fallback provider (no credentials required).
 */
import { runAiChat } from '../src/lib/ai-gateway';
import { createGatewayIntelligenceService } from '../src/lib/tau-ai/intelligence-service';
import { createGatewayTauAIClient } from '../src/lib/tau-ai/gateway-client';
import { getSubstrate, listSubstrates } from '../src/lib/ai-gateway/substrate-registry';
import { toModelSubstrate } from '../src/lib/ai-gateway/substrate-bridge';
import { getProviderSubstrateMetadata } from '../src/lib/ai-gateway/substrate-metadata';
import { fallbackAdapter } from '../src/lib/ai-gateway/providers/fallback';
import { vllmSubstrateStub } from '../src/lib/ai-gateway/providers/vllm-stub';

const TEST_CASES = [
  { label: 'default', message: 'help me' },
  { label: 'greeting', message: 'hello' },
  { label: 'architect', message: 'design a system architect' },
  { label: 'clone', message: 'build an airbnb clone' },
];

async function main() {
  let passed = 0;
  let failed = 0;

  // Substrate bridge
  const fallbackSubstrate = toModelSubstrate(fallbackAdapter, {
    kind: 'remote',
    label: 'Offline Fallback',
    metadata: getProviderSubstrateMetadata('fallback'),
  });
  const bridged = await fallbackSubstrate.complete({
    messages: [{ role: 'user', content: 'hello' }],
    model: 'tau-fallback',
    maxTokens: 256,
    temperature: 0.7,
  });
  if (!bridged.message.includes('Tau Architect')) {
    console.error('FAIL  substrate bridge fallback greeting');
    failed++;
  } else {
    console.log('PASS  substrate bridge fallback');
    passed++;
  }

  // Registry substrates
  const substrates = listSubstrates();
  const ids = substrates.map((s) => s.id).sort();
  const expected = [
    'anthropic',
    'azure-openai',
    'deepseek',
    'fallback',
    'gemini',
    'ollama',
    'openai',
    'openrouter',
    'tau-ai',
  ];
  if (JSON.stringify(ids) !== JSON.stringify(expected)) {
    console.error('FAIL  listSubstrates ids', ids);
    failed++;
  } else {
    console.log('PASS  listSubstrates (9 providers)');
    passed++;
  }

  // vLLM stub exists but not configured by default
  if (vllmSubstrateStub.id !== 'vllm') {
    console.error('FAIL  vLLM stub id');
    failed++;
  } else {
    console.log('PASS  vLLM stub present');
    passed++;
  }

  const fallbackSubstrateFromRegistry = getSubstrate('fallback');
  if (fallbackSubstrateFromRegistry.id !== 'fallback') {
    console.error('FAIL  getSubstrate(fallback)');
    failed++;
  } else {
    console.log('PASS  getSubstrate');
    passed++;
  }

  const intelligence = createGatewayIntelligenceService();
  const client = createGatewayTauAIClient({ appId: 'ai2-regression-test' });

  for (const testCase of TEST_CASES) {
    const messages = [{ role: 'user' as const, content: testCase.message }];
    const gateway = await runAiChat({ messages, provider: 'fallback' });
    const intel = await intelligence.chat({
      messages,
      options: { substrate: 'fallback' },
    });
    const viaClient = await client.chat({ messages, options: { substrate: 'fallback' } });

    if (gateway.message !== intel.message) {
      console.error(`FAIL  ${testCase.label}: gateway vs intelligence mismatch`);
      console.error('  gateway:', gateway.message.slice(0, 80));
      console.error('  intel:  ', intel.message.slice(0, 80));
      failed++;
      continue;
    }
    if (viaClient.message !== gateway.message) {
      console.error(`FAIL  ${testCase.label}: client vs gateway mismatch`);
      failed++;
      continue;
    }
    if (intel.substrateId !== 'fallback' || gateway.provider !== 'fallback') {
      console.error(`FAIL  ${testCase.label}: provider/substrate id mismatch`);
      failed++;
      continue;
    }
    console.log(`PASS  behaviour parity (${testCase.label})`);
    passed++;
  }

  console.log('');
  console.log(`=== AI-2 regression: ${passed} passed, ${failed} failed ===`);
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
