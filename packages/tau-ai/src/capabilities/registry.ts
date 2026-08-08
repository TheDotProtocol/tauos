/**
 * Capability registry — registers and resolves Tau intelligence capabilities (AI-3.0).
 */

import type { CapabilityDefinition, CapabilityId } from './types';

export type CapabilityFilter = {
  modality?: CapabilityDefinition['modalities'][number];
  invocationKind?: CapabilityDefinition['invocationKind'];
  builtInOnly?: boolean;
};

export interface CapabilityRegistry {
  register(definition: CapabilityDefinition): void;
  unregister(id: CapabilityId): void;
  get(id: CapabilityId): CapabilityDefinition | undefined;
  has(id: CapabilityId): boolean;
  list(filter?: CapabilityFilter): CapabilityDefinition[];
}

export function createCapabilityRegistry(
  initial: CapabilityDefinition[] = [],
): CapabilityRegistry {
  const capabilities = new Map<CapabilityId, CapabilityDefinition>();

  for (const definition of initial) {
    capabilities.set(definition.id, definition);
  }

  return {
    register(definition: CapabilityDefinition) {
      capabilities.set(definition.id, definition);
    },
    unregister(id: CapabilityId) {
      capabilities.delete(id);
    },
    get(id: CapabilityId) {
      return capabilities.get(id);
    },
    has(id: CapabilityId) {
      return capabilities.has(id);
    },
    list(filter?: CapabilityFilter) {
      let items = Array.from(capabilities.values());
      if (filter?.modality) {
        items = items.filter((c) => c.modalities.includes(filter.modality!));
      }
      if (filter?.invocationKind) {
        items = items.filter((c) => c.invocationKind === filter.invocationKind);
      }
      if (filter?.builtInOnly) {
        items = items.filter((c) => c.builtIn);
      }
      return items.sort((a, b) => a.id.localeCompare(b.id));
    },
  };
}
