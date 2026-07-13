import { NextResponse } from 'next/server';
import { checkMailServerHealth } from '@/lib/mail-transport';
import { checkStorageHealth } from '@/lib/supabase-storage';
import { listAvailableModels } from '@/lib/ai-gateway';
import { getPool } from '@/lib/db-pool';

export async function GET() {
  let database: { ok: boolean; error?: string } = { ok: false };
  try {
    await getPool().query('SELECT 1');
    database = { ok: true };
  } catch (err) {
    database = { ok: false, error: err instanceof Error ? err.message : 'DB failed' };
  }

  const mail = await checkMailServerHealth();
  const storage = await checkStorageHealth();
  const aiModels = listAvailableModels().filter((m) => m.available);

  const checks = {
    database,
    sso: { ok: true, endpoint: '/api/auth/session' },
    mail,
    storage,
    ai: {
      ok: aiModels.length > 0,
      models: aiModels.length,
      gateway: '/api/tauai/chat',
    },
    developer: {
      ok: true,
      portal: '/developers',
      ide: '/developers/ide',
      subdomain: 'developer.tauos.org',
    },
  };

  const ok = database.ok && mail.ok;

  return NextResponse.json({
    phase: 0,
    ok,
    checks,
    timestamp: new Date().toISOString(),
  });
}
