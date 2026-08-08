/**
 * Passthrough ModelRouter — mirrors existing gateway auto-selection (AI-2).
 * Advanced routing deferred to AI-3.
 */

import type { ModelRouter, RoutingContext, RoutingDecision } from '@tau/ai';
import type { AiProviderId } from '@/lib/ai-gateway/types';
import { getProvider, pickAutoProvider, PROVIDER_CONFIGS } from '@/lib/ai-gateway/registry';

export class PassthroughModelRouter implements ModelRouter {
  async select(context: RoutingContext): Promise<RoutingDecision> {
    const preferred = context.preferredSubstrate;
    const adapter =
      preferred && preferred !== 'auto'
        ? getProvider(preferred as AiProviderId)
        : pickAutoProvider();

    const model =
      context.preferredModel ??
      PROVIDER_CONFIGS.find((c) => c.id === adapter.id)?.defaultModel ??
      'default';

    return {
      substrateId: adapter.id,
      modelId: model,
      reason: 'passthrough-ai2',
      fallback: adapter.id === 'fallback',
    };
  }
}

export function createPassthroughModelRouter(): ModelRouter {
  return new PassthroughModelRouter();
}
