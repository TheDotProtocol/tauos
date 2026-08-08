/**
 * AI-3.0 — capability registry tests (deterministic, no model infra required).
 */
import {
  TAU_CAPABILITIES,
  ROUTING_TASK_TO_CAPABILITY,
  createCapabilityRegistry,
  createDefaultCapabilityRegistry,
  DEFAULT_CAPABILITY_DEFINITIONS,
} from '../src/capabilities';

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

function main() {
  let passed = 0;

  const registry = createDefaultCapabilityRegistry();
  assert(registry.list().length === 9, 'default registry should have 9 capabilities');
  passed++;

  for (const def of DEFAULT_CAPABILITY_DEFINITIONS) {
    assert(registry.has(def.id), `missing capability ${def.id}`);
    assert(registry.get(def.id)?.label === def.label, `label mismatch for ${def.id}`);
  }
  passed++;

  assert(
    registry.get(TAU_CAPABILITIES.TEXT_REASONING)?.invocationKind === 'generate',
    'TEXT_REASONING invocation kind',
  );
  assert(
    registry.get(TAU_CAPABILITIES.SPEECH_TO_TEXT)?.invocationKind === 'transcribe',
    'SPEECH_TO_TEXT invocation kind',
  );
  assert(
    registry.get(TAU_CAPABILITIES.EMBEDDING)?.invocationKind === 'embed',
    'EMBEDDING invocation kind',
  );
  passed++;

  const visionCaps = registry.list({ modality: 'image' });
  assert(
    visionCaps.some((c) => c.id === TAU_CAPABILITIES.IMAGE_UNDERSTANDING),
    'image modality filter includes IMAGE_UNDERSTANDING',
  );
  assert(
    visionCaps.some((c) => c.id === TAU_CAPABILITIES.IMAGE_GENERATION),
    'image modality filter includes IMAGE_GENERATION',
  );
  passed++;

  const custom = createCapabilityRegistry();
  custom.register({
    id: 'DOCUMENT_ANALYSIS',
    label: 'Document Analysis',
    description: 'Future capability extension test.',
    modalities: ['text'],
    invocationKind: 'generate',
    builtIn: false,
  });
  assert(custom.has('DOCUMENT_ANALYSIS'), 'custom capability registered');
  assert(custom.list().length === 1, 'custom registry size');
  passed++;

  assert(
    ROUTING_TASK_TO_CAPABILITY.chat === TAU_CAPABILITIES.TEXT_REASONING,
    'legacy chat maps to TEXT_REASONING',
  );
  assert(
    ROUTING_TASK_TO_CAPABILITY.vision === TAU_CAPABILITIES.IMAGE_UNDERSTANDING,
    'legacy vision maps to IMAGE_UNDERSTANDING',
  );
  passed++;

  console.log(`PASS  AI-3.0 capability registry (${passed} assertion groups)`);
}

main();
