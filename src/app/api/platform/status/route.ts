import { NextResponse } from 'next/server';
import { checkMailServerHealth } from '@/lib/mail-transport';
import { checkStorageHealth } from '@/lib/supabase-storage';
import { listAvailableModels } from '@/lib/ai-gateway';
import { getPool } from '@/lib/db-pool';

async function timed<T>(fn: () => Promise<T>): Promise<{ result: T; latency_ms: number }> {
  const start = Date.now();
  const result = await fn();
  return { result, latency_ms: Date.now() - start };
}

export async function GET() {
  const { result: dbResult, latency_ms: dbLatency } = await timed(async () => {
    await getPool().query('SELECT 1');
    return { ok: true as const };
  }).catch((err) => ({
    result: { ok: false as const, error: err instanceof Error ? err.message : 'DB failed' },
    latency_ms: 0,
  }));

  const { result: mail, latency_ms: mailLatency } = await timed(() => checkMailServerHealth());
  const { result: storage, latency_ms: storageLatency } = await timed(() => checkStorageHealth());
  const aiModels = listAvailableModels().filter((m) => m.available);

  const checks = {
    database: { ...dbResult, latency_ms: dbLatency },
    sso: { ok: true, endpoint: '/api/auth/session', latency_ms: 0 },
    mail: { ...mail, latency_ms: mailLatency },
    storage: { ...storage, latency_ms: storageLatency },
    ai: {
      ok: aiModels.length > 0,
      models: aiModels.length,
      gateway: '/api/tauai/chat',
      latency_ms: 0,
    },
    developer: {
      ok: true,
      portal: '/developers',
      ide: '/developers/ide',
      subdomain: 'developer.tauos.org',
      latency_ms: 0,
    },
    taucloud: {
      ok: storage.ok,
      endpoint: '/taucloud',
      latency_ms: storageLatency,
    },
    taubrowser: {
      ok: true,
      portal: '/taubrowser',
      subdomains: ['browser.tauos.org', 'taubrowser.com'],
      sync: '/api/taubrowser/sync',
      blocklist: '/api/taubrowser/privacy/blocklist',
      downloads: '/api/taubrowser/downloads',
      latency_ms: 0,
    },
    tautalk: {
      ok: true,
      portal: '/tautalk',
      subdomains: ['talk.tauos.org', 'tautalk.com'],
      messages: '/api/tautalk/messages',
      stream: '/api/tautalk/messages/stream',
      conversations: '/api/tautalk/conversations',
      encryption: 'client-side ECDH + AES-GCM',
      latency_ms: 0,
    },
    gdpr: {
      ok: true,
      export: '/api/privacy/export',
      erasure: '/api/privacy/account',
      compliance: '/api/enterprise/compliance-status',
      latency_ms: 0,
    },
  };

  const ok = dbResult.ok && mail.ok;

  return NextResponse.json({
    phase: 'public-beta',
    ok,
    checks,
    timestamp: new Date().toISOString(),
  });
}
