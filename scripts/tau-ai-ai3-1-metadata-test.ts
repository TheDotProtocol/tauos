/**
 * AI-3.1 — gateway provider metadata tests (METADATA VERIFIED).
 */
import { getSubstrate, listSubstrates, createSubstrateRegistry } from '../src/lib/ai-gateway/substrate-registry';
import { getProviderSubstrateMetadata, PROVIDER_SUBSTRATE_METADATA } from '../src/lib/ai-gateway/substrate-metadata';
import { TAU_CAPABILITIES, supportsCapability } from '@tau/ai';

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

function main() {
  let groups = 0;

  const providerIds = Object.keys(PROVIDER_SUBSTRATE_METADATA).sort();
  assert(providerIds.length === 9, '9 gateway providers have metadata');
  groups++;

  const ollama = getProviderSubstrateMetadata('ollama');
  assert(ollama.privacyClass === 'LOCAL', 'ollama privacy LOCAL');
  assert(
    supportsCapability(ollama, TAU_CAPABILITIES.TEXT_REASONING) === 'SUPPORTED',
    'ollama TEXT_REASONING declared',
  );
  assert(
    supportsCapability(ollama, TAU_CAPABILITIES.IMAGE_GENERATION) === 'UNKNOWN',
    'ollama image gen not guessed',
  );
  groups++;

  const openai = getProviderSubstrateMetadata('openai');
  assert(openai.privacyClass === 'REMOTE', 'openai REMOTE');
  assert(openai.costClass === 'UNKNOWN', 'openai cost not fabricated');
  assert(openai.provenance.license === 'UNKNOWN', 'openai license not fabricated');
  groups++;

  const deepseek = getProviderSubstrateMetadata('deepseek');
  assert(
    supportsCapability(deepseek, TAU_CAPABILITIES.CODE) === 'SUPPORTED',
    'deepseek CODE declared',
  );
  assert(deepseek.provenance.modelFamily === 'DEEPSEEK', 'deepseek family tagged');
  groups++;

  const fallback = getSubstrate('fallback');
  assert(fallback.metadata.privacyClass === 'LOCAL', 'fallback LOCAL');
  assert(fallback.getAvailability?.() === 'AVAILABLE', 'fallback AVAILABLE');
  assert(fallback.metadata.costClass === 'FREE', 'fallback FREE');
  groups++;

  const substrates = listSubstrates();
  for (const s of substrates) {
    assert(s.metadata !== undefined, `${s.id} has metadata`);
    assert(s.metadata.capabilities.length === 9, `${s.id} declares all capabilities`);
    assert(s.getAvailability !== undefined, `${s.id} has getAvailability`);
  }
  groups++;

  const registry = createSubstrateRegistry();
  const all = registry.list();
  assert(all.some((s) => s.id === 'vllm'), 'registry includes vllm');
  assert(all.some((s) => s.id === 'tau-foundation'), 'registry includes tau-foundation');
  groups++;

  console.log(`PASS  AI-3.1 gateway metadata (${groups} assertion groups)`);
}

main();
