import { NextResponse } from 'next/server';
import { checkProviderHealth, getProviderMatrix, listAvailableModels, getUsageStats } from '@/lib/ai-gateway';

export async function GET() {
  const [health, providers, models, usage] = await Promise.all([
    checkProviderHealth(),
    Promise.resolve(getProviderMatrix()),
    Promise.resolve(listAvailableModels()),
    Promise.resolve(getUsageStats()),
  ]);

  return NextResponse.json({
    gateway: 'Tau AI Gateway v2',
    health,
    providers,
    models: models.filter((m) => m.available),
    usage,
    futureProviders: ['tau-ai'],
  });
}
