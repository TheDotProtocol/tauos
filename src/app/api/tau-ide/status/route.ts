import { NextResponse } from 'next/server';
import { ensureSchema, dbAvailable } from '@/lib/tau-ide/server/db';
import { checkProviderHealth, getProviderMatrix, getUsageStats } from '@/lib/ai-gateway';

export async function GET() {
  const db = await dbAvailable();
  if (db) await ensureSchema();
  const [health, providers, usage] = await Promise.all([
    checkProviderHealth(),
    Promise.resolve(getProviderMatrix()),
    Promise.resolve(getUsageStats()),
  ]);
  return NextResponse.json({
    tauIde: { version: '3.0', database: db ? 'connected' : 'file-fallback' },
    aiGateway: { health, providers, usage },
  });
}
