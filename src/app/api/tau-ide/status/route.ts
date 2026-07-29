import { NextResponse } from 'next/server';
import { ensureSchema, dbAvailable } from '@/lib/tau-ide/server/db';
import { validateTauIdeEnv } from '@/lib/tau-ide/server/env';
import { getMetricSummary } from '@/lib/tau-ide/server/metrics';
import { checkProviderHealth, getProviderMatrix, getUsageStats } from '@/lib/ai-gateway';

export async function GET() {
  const env = validateTauIdeEnv();
  const db = await dbAvailable();
  if (db) await ensureSchema();
  const [health, providers, usage, metrics] = await Promise.all([
    checkProviderHealth(),
    Promise.resolve(getProviderMatrix()),
    Promise.resolve(getUsageStats()),
    Promise.resolve(getMetricSummary()),
  ]);
  return NextResponse.json({
    tauIde: {
      version: '1.0.0-rc1',
      release: 'public-beta-candidate',
      database: db ? 'connected' : 'unavailable',
      envValid: env.valid,
      envErrors: env.errors,
      envWarnings: env.warnings,
      storageMode: db ? 'postgresql' : 'file-fallback',
    },
    metrics,
    aiGateway: { health, providers, usage },
    alerts: [
      ...(env.errors.length ? [{ level: 'error', message: env.errors[0] }] : []),
      ...(!db ? [{ level: 'warning', message: 'Database unavailable' }] : []),
      ...(metrics.totalErrors > 0 ? [{ level: 'warning', message: `${metrics.totalErrors} API errors recorded` }] : []),
    ],
  });
}
