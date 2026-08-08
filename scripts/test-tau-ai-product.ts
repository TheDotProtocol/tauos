/**
 * AI-9 — Tau AI product assembly tests (Figma UI + Tau ID SSO + routing).
 * Run: npx tsx scripts/test-tau-ai-product.ts
 */

import fs from 'node:fs';
import path from 'node:path';
import { TAU_AI_SCREENS } from '../src/lib/tau-ai-app/screens';
import { websiteRoutes } from '../src/lib/website/routes';

const ROOT = path.resolve(__dirname, '..');

function assert(condition: boolean, label: string) {
  if (!condition) throw new Error(`FAIL: ${label}`);
}

function read(rel: string): string {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

function exists(rel: string): boolean {
  return fs.existsSync(path.join(ROOT, rel));
}

console.log('=== AI-9 Tau AI Product Tests ===');

// Screen registry — all desktop Figma screens imported
assert(TAU_AI_SCREENS.length >= 20, 'screen registry has 20+ entries');
assert(
  TAU_AI_SCREENS.every((s) => s.route.startsWith('/tau-ai-app/')),
  'all screen routes under /tau-ai-app',
);
const implemented = TAU_AI_SCREENS.filter((s) => s.status === 'implemented');
assert(implemented.length >= 17, '17+ screens marked implemented');

// Tau ID SSO wiring
assert(exists('src/lib/tau-ai-app/session-context.tsx'), 'session context');
assert(read('src/lib/tau-ai-app/session-context.tsx').includes('useTauSession'), 'uses useTauSession');
assert(read('src/lib/tau-ai-app/session-context.tsx').includes('/tau-ai-app/auth'), 'auth login path');
assert(read('src/components/tau-ai-app/auth/TauAiAuthPage.tsx').includes('loginTauId'), 'auth uses loginTauId');
assert(read('src/components/tau-ai-app/auth/TauAiAuthPage.tsx').includes('TauIdOAuthButtons'), 'OAuth buttons');
assert(!read('src/lib/tau-ai-app/demo-data.ts').includes('tauAiDemoUser'), 'no static demo user');

// Authenticated API clients
assert(read('src/lib/tau-ai-app/api-client.ts').includes('tauFetch'), 'chat client uses tauFetch');
assert(read('src/lib/tau-ai-app/substrate-client.ts').includes('tauFetch'), 'substrate client uses tauFetch');
assert(
  read('src/app/api/tau-foundation/chat/route.ts').includes('Authentication required'),
  'foundation chat requires auth',
);

// Logo assets (Figma — not page screenshot)
assert(exists('public/tau-ai-app/brand/logo-lockup.png'), 'logo lockup asset');
assert(exists('public/tau-ai-app/brand/logo-emblem.png'), 'logo emblem asset');
assert(read('src/lib/tau-ai-app/assets.ts').includes('logo-lockup.png'), 'assets point to lockup');
assert(read('src/components/tau-ai-app/welcome/TauAiWelcomePage.tsx').includes('TauAiLogo'), 'welcome uses TauAiLogo');

// Marketing → product entry
assert(websiteRoutes.tauAiApp === '/tau-ai-app/welcome', 'marketing app route');
assert(websiteRoutes.tauAiLogin === '/tau-ai-app/auth', 'marketing login route');
assert(
  read('src/components/website/product/TauAiProductPage.tsx').includes('websiteRoutes.tauAiApp'),
  'Try Tau AI links to product app',
);

// Production path unchanged
assert(read('src/app/api/tauai/chat/route.ts').includes('runAiChat'), 'production chat unchanged');

// Boundaries
assert(!read('src/lib/tau-ai-app/foundation-service.ts').match(/athena|openclaw/i), 'no ATHENA in foundation service');

console.log(`PASS  product tests (${TAU_AI_SCREENS.length} screens, SSO, routes, assets)`);
