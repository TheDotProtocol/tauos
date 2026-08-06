import { NextRequest, NextResponse } from 'next/server';
import {
  connectIntegration,
  disconnectIntegration,
  listIntegrations,
} from '@/lib/tau-developer/server/platform-db';
import { withDeveloperHandler } from '@/lib/tau-developer/server/route-auth';

export const dynamic = 'force-dynamic';

const PROVIDERS = [
  { id: 'github', name: 'GitHub', desc: 'Sync repos and trigger CI on push' },
  { id: 'slack', name: 'Slack', desc: 'Deploy and alert notifications' },
  { id: 'datadog', name: 'Datadog', desc: 'Export metrics and traces' },
  { id: 'vercel', name: 'Vercel', desc: 'Edge deployment targets' },
];

export async function GET(request: NextRequest) {
  return withDeveloperHandler(request, 'developers.integrations.list', async (userId) => {
    const connected = await listIntegrations(userId);
    const providers = PROVIDERS.map((p) => ({
      ...p,
      connected: connected.some((c) => c.provider === p.id),
      config: connected.find((c) => c.provider === p.id)?.config ?? {},
    }));
    return NextResponse.json({ providers, connected });
  });
}

export async function POST(request: NextRequest) {
  return withDeveloperHandler(request, 'developers.integrations.connect', async (userId) => {
    const body = await request.json();
    await connectIntegration(userId, String(body.provider), body.config ?? {});
    const connected = await listIntegrations(userId);
    return NextResponse.json({ connected });
  });
}

export async function DELETE(request: NextRequest) {
  return withDeveloperHandler(request, 'developers.integrations.disconnect', async (userId) => {
    const provider = request.nextUrl.searchParams.get('provider');
    if (!provider) return NextResponse.json({ error: 'provider required' }, { status: 400 });
    await disconnectIntegration(userId, provider);
    return NextResponse.json({ success: true });
  });
}
