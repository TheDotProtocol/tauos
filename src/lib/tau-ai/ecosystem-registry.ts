/**
 * AI-11 — Ecosystem integration registry (server metadata).
 * No product business logic — readiness and route documentation only.
 */

import type {
  EcosystemIntegrationLevel,
  EcosystemProductReadiness,
  EcosystemProductRegistration,
} from '@tau/ai';

export const ECOSYSTEM_PRODUCTS: EcosystemProductRegistration[] = [
  {
    appId: 'tau-ai-app',
    displayName: 'Tau AI',
    readiness: 'READY',
    integrationLevel: 'END_TO_END_VERIFIED',
    foundationRoute: '/api/tau-foundation/chat',
    note: 'Primary product shell — AI-9',
  },
  {
    appId: 'taumail',
    displayName: 'TauMail',
    readiness: 'READY',
    integrationLevel: 'INTEGRATION_VERIFIED',
    foundationRoute: '/api/taumail/ai',
    legacyRoute: 'runAiChat fallback',
    note: 'AI-11 — Foundation primary, legacy gateway fallback',
  },
  {
    appId: 'tau-developer',
    displayName: 'Tau Developer',
    readiness: 'PARTIALLY_READY',
    integrationLevel: 'ADAPTER_VERIFIED',
    legacyRoute: '/api/tau-ide/architect → runAiChat',
    note: 'Architect uses gateway path; can adopt ecosystem client without rebuild',
  },
  {
    appId: 'tautalk',
    displayName: 'TauTalk',
    readiness: 'NOT_READY',
    integrationLevel: 'CONTRACT_VERIFIED',
    note: 'Messaging product — no AI chat integration yet; contract ready for future',
  },
  {
    appId: 'taucloud',
    displayName: 'TauCloud',
    readiness: 'NOT_READY',
    integrationLevel: 'CONTRACT_VERIFIED',
    note: 'Future consumer — boundary defined only',
  },
  {
    appId: 'tau-browser',
    displayName: 'Tau Browser',
    readiness: 'NOT_READY',
    integrationLevel: 'CONTRACT_VERIFIED',
    note: 'Future consumer — boundary defined only',
  },
];

export function getEcosystemRegistry(): EcosystemProductRegistration[] {
  return ECOSYSTEM_PRODUCTS;
}

export function getProductRegistration(appId: string): EcosystemProductRegistration | undefined {
  return ECOSYSTEM_PRODUCTS.find((p) => p.appId === appId);
}

export type EcosystemBoundarySummary = {
  principle: string;
  memoryRule: string;
  toolRule: string;
  executionRule: string;
  authRule: string;
};

export function getEcosystemBoundaries(): EcosystemBoundarySummary {
  return {
    principle: 'Product → TauFoundationClient → Tau Foundation (never reverse)',
    memoryRule: 'Product-scoped memory by appId; promotion requires governed memory authority (AI-5)',
    toolRule: 'Tools require registry + constitution; draft ≠ send (AI-6)',
    executionRule: 'External side effects require confirmation (AI-7)',
    authRule: 'Reuse Tau ID session — no second auth system; no provider keys to clients',
  };
}
