/**
 * AI-3.1 — substrate metadata tests (METADATA VERIFIED, no live models required).
 */
import {
  createTauFoundationSubstrateStub,
  createVLLMSubstrateStub,
  supportsCapability,
  resolveAvailability,
  declareCapabilities,
} from '../src/models';
import { TAU_CAPABILITIES, createDefaultCapabilityRegistry } from '../src/capabilities';

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

function main() {
  let groups = 0;

  const caps = declareCapabilities([TAU_CAPABILITIES.CODE], [TAU_CAPABILITIES.VIDEO_GENERATION]);
  assert(caps.length === 9, 'all 9 capabilities declared');
  assert(
    caps.find((c) => c.capability === TAU_CAPABILITIES.CODE)?.support === 'SUPPORTED',
    'CODE supported',
  );
  assert(
    caps.find((c) => c.capability === TAU_CAPABILITIES.VIDEO_GENERATION)?.support === 'UNSUPPORTED',
    'VIDEO unsupported',
  );
  assert(
    caps.find((c) => c.capability === TAU_CAPABILITIES.EMBEDDING)?.support === 'UNKNOWN',
    'unspecified caps are UNKNOWN',
  );
  groups++;

  const tauFoundation = createTauFoundationSubstrateStub();
  assert(tauFoundation.id === 'tau-foundation', 'tau-foundation id');
  assert(tauFoundation.metadata.provenance.provider === 'tau', 'tau foundation provider');
  assert(
    supportsCapability(tauFoundation.metadata, TAU_CAPABILITIES.TEXT_REASONING) === 'SUPPORTED',
    'tau foundation TEXT_REASONING',
  );
  assert(!tauFoundation.isConfigured(), 'tau foundation not configured');
  assert(
    resolveAvailability(tauFoundation.metadata, false) === 'NOT_CONFIGURED',
    'tau foundation NOT_CONFIGURED',
  );
  groups++;

  const vllm = createVLLMSubstrateStub();
  assert(vllm.metadata.privacyClass === 'LOCAL', 'vllm LOCAL privacy');
  assert(vllm.metadata.verificationLevel === 'METADATA_VERIFIED', 'vllm METADATA_VERIFIED');
  groups++;

  const registry = createDefaultCapabilityRegistry();
  assert(registry.has(TAU_CAPABILITIES.IMAGE_UNDERSTANDING), 'cap registry intact');
  groups++;

  console.log(`PASS  AI-3.1 substrate metadata (${groups} assertion groups)`);
}

main();
