/**
 * AI-11 — Shared Tau Foundation clients for ecosystem products (server-side).
 * Product-specific context lives in each product bridge (e.g. taumail/foundation-bridge).
 */

import {
  createDefaultFoundationPipeline,
  createTauFoundationClient,
  type TauFoundationClient,
  type TauFoundationPipeline,
} from '@tau/ai';
import { buildRoutableSubstratesFromGateway } from '@/lib/tau-ai/shadow-routing';
import { createGatewayIntelligenceService } from '@/lib/tau-ai/intelligence-service';

let sharedPipeline: TauFoundationPipeline | null = null;
const clientByAppId = new Map<string, TauFoundationClient>();

function getSharedPipeline(): TauFoundationPipeline {
  if (!sharedPipeline) {
    sharedPipeline = createDefaultFoundationPipeline({
      substrates: buildRoutableSubstratesFromGateway(),
      intelligence: createGatewayIntelligenceService(),
      includeTestTools: true,
      includeTestExecutionAdapters: true,
    });
  }
  return sharedPipeline;
}

/** Foundation client scoped by appId — shared pipeline, isolated app/memory scope */
export function createEcosystemFoundationClient(appId: string): TauFoundationClient {
  const cached = clientByAppId.get(appId);
  if (cached) return cached;

  const client = createTauFoundationClient(
    {
      appId,
      intelligence: createGatewayIntelligenceService(),
    },
    getSharedPipeline(),
  );
  clientByAppId.set(appId, client);
  return client;
}

/** Test helper */
export function resetEcosystemFoundationCache(): void {
  sharedPipeline = null;
  clientByAppId.clear();
}
