/**
 * AI-11 — Ecosystem integration status (Tau Foundation boundary metadata).
 * GET only — no product business logic.
 */

import { NextResponse } from 'next/server';
import {
  getEcosystemBoundaries,
  getEcosystemRegistry,
} from '@/lib/tau-ai/ecosystem-registry';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    success: true,
    principle: 'Product → TauFoundationClient → Tau Foundation',
    boundaries: getEcosystemBoundaries(),
    products: getEcosystemRegistry(),
    canonicalRoutes: {
      foundationChat: '/api/tau-foundation/chat',
      foundationVoice: '/api/tau-foundation/voice',
      legacyChat: '/api/tauai/chat',
      taumailAi: '/api/taumail/ai',
      tauDeveloperArchitect: '/api/tau-ide/architect',
    },
  });
}
