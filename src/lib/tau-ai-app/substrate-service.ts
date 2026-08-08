/**
 * Server-side substrate status for Tau AI product Local AI screen (AI-9 batch 2).
 * Reads from existing ai-gateway substrate registry — no fake Tau-owned weights.
 */

import { createSubstrateRegistry } from '@/lib/ai-gateway/substrate-registry';
import { PROVIDER_CONFIGS } from '@/lib/ai-gateway/registry';

export type ProductSubstrateStatus = {
  id: string;
  label: string;
  kind: string;
  availability: string;
  configured: boolean;
  defaultModel?: string;
  isTauFoundation: boolean;
};

export function listProductSubstrateStatuses(): ProductSubstrateStatus[] {
  const registry = createSubstrateRegistry();

  return registry.list().map((substrate) => {
    const config = PROVIDER_CONFIGS.find((c) => c.id === substrate.id);
    const availability = substrate.getAvailability();
    return {
      id: substrate.id,
      label: substrate.label,
      kind: substrate.kind,
      availability,
      configured: substrate.isConfigured(),
      defaultModel: config?.defaultModel,
      isTauFoundation: substrate.id === 'tau-foundation',
    };
  });
}
