/**
 * ModelSubstrate registry — wraps existing ai-gateway provider registry.
 *
 * Migration path (AI-2 → AI-3):
 * - Today: substrates are derived from AiProviderAdapter via substrate-bridge.
 * - Future: ModelRouter selects substrates; registry remains source of truth.
 * - registerProvider() continues to work; substrates refresh from adapters.
 */

import type { ModelSubstrate, ModelSubstrateRegistry, SubstrateKind } from '@tau/ai';
import { createTauFoundationSubstrateStub } from '@tau/ai';
import type { AiProviderId } from './types';
import {
  getProvider,
  getConfiguredProviders,
  registerProvider,
  PROVIDER_CONFIGS,
} from './registry';
import { toModelSubstrate } from './substrate-bridge';
import { getProviderSubstrateMetadata } from './substrate-metadata';
import { vllmSubstrateStub } from './providers/vllm-stub';

const SUBSTRATE_KIND: Record<AiProviderId, SubstrateKind> = {
  'tau-ai': 'foundation',
  openai: 'remote',
  anthropic: 'remote',
  gemini: 'remote',
  deepseek: 'remote',
  openrouter: 'remote',
  'azure-openai': 'remote',
  ollama: 'local',
  fallback: 'remote',
};

function substrateMeta(id: AiProviderId) {
  const config = PROVIDER_CONFIGS.find((c) => c.id === id);
  return {
    kind: SUBSTRATE_KIND[id],
    label: config?.label ?? id,
    metadata: getProviderSubstrateMetadata(id),
  };
}

/** Resolve a provider adapter as a ModelSubstrate (zero inference behaviour change). */
export function getSubstrate(id: AiProviderId): ModelSubstrate {
  return toModelSubstrate(getProvider(id), substrateMeta(id));
}

/** All registered gateway providers as ModelSubstrate instances. */
export function listSubstrates(): ModelSubstrate[] {
  return PROVIDER_CONFIGS.map((c) => getSubstrate(c.id));
}

/** Configured substrates in priority order (mirrors getConfiguredProviders). */
export function listConfiguredSubstrates(): ModelSubstrate[] {
  return getConfiguredProviders().map((adapter) =>
    toModelSubstrate(adapter, substrateMeta(adapter.id)),
  );
}

/** Future Tau AI substrate registry — includes vLLM + Tau Foundation stubs. */
export function createSubstrateRegistry(): ModelSubstrateRegistry {
  const tauFoundation = createTauFoundationSubstrateStub();
  const substrates = new Map<string, ModelSubstrate>(
    listSubstrates().map((s) => [s.id, s]),
  );
  substrates.set(vllmSubstrateStub.id, vllmSubstrateStub);
  substrates.set(tauFoundation.id, tauFoundation);

  return {
    register(substrate: ModelSubstrate) {
      substrates.set(substrate.id, substrate);
      // Keep gateway registry in sync when substrate wraps a known provider id.
      const existing = PROVIDER_CONFIGS.find((c) => c.id === substrate.id);
      if (existing) {
        // Adapter re-registration happens via registerProvider in gateway.
      }
    },
    get(id: string) {
      return substrates.get(id);
    },
    list() {
      return Array.from(substrates.values());
    },
  };
}

export { registerProvider } from './registry';
export { vllmSubstrateStub } from './providers/vllm-stub';
export {
  getProviderSubstrateMetadata,
  PROVIDER_SUBSTRATE_METADATA,
  VLLM_SUBSTRATE_METADATA,
} from './substrate-metadata';
export { createTauFoundationSubstrateStub, TAU_FOUNDATION_SUBSTRATE_ID } from '@tau/ai';
