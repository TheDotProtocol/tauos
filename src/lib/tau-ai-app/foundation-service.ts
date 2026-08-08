/**
 * Server-side Tau Foundation product service (AI-9).
 * Wires TauFoundationClient → TauFoundationPipeline → gateway substrates.
 * Does NOT replace /api/tauai/chat or runAiChat().
 */

import {
  createDefaultFoundationPipeline,
  createTauFoundationClient,
  type TauFoundationClient,
  type TauFoundationPipeline,
} from '@tau/ai';
import { buildRoutableSubstratesFromGateway } from '@/lib/tau-ai/shadow-routing';
import { createGatewayIntelligenceService } from '@/lib/tau-ai/intelligence-service';

let cachedClient: TauFoundationClient | null = null;
let cachedPipeline: TauFoundationPipeline | null = null;

export function createProductFoundationPipeline(): TauFoundationPipeline {
  if (cachedPipeline) return cachedPipeline;

  cachedPipeline = createDefaultFoundationPipeline({
    substrates: buildRoutableSubstratesFromGateway(),
    intelligence: createGatewayIntelligenceService(),
    includeTestTools: true,
    includeTestExecutionAdapters: true,
  });

  return cachedPipeline;
}

export function createProductFoundationClient(): TauFoundationClient {
  if (cachedClient) return cachedClient;

  cachedClient = createTauFoundationClient(
    {
      appId: 'tau-ai-app',
      intelligence: createGatewayIntelligenceService(),
    },
    createProductFoundationPipeline(),
  );

  return cachedClient;
}

/** Reset singletons — test helper only */
export function resetProductFoundationCache(): void {
  cachedClient = null;
  cachedPipeline = null;
}
