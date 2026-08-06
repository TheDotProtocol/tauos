import { NextRequest, NextResponse } from 'next/server';
import { createApiKey, listApiKeys, revokeApiKey } from '@/lib/tau-developer/server/platform-db';
import { withDeveloperHandler } from '@/lib/tau-developer/server/route-auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  return withDeveloperHandler(request, 'developers.api-keys.list', async (userId) => {
    const keys = await listApiKeys(userId);
    return NextResponse.json({ keys });
  });
}

export async function POST(request: NextRequest) {
  return withDeveloperHandler(request, 'developers.api-keys.create', async (userId) => {
    const body = await request.json();
    const name = String(body.name ?? 'Default Key').trim();
    if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 });
    const key = await createApiKey(userId, name);
    return NextResponse.json({ key }, { status: 201 });
  });
}

export async function DELETE(request: NextRequest) {
  return withDeveloperHandler(request, 'developers.api-keys.revoke', async (userId) => {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
    await revokeApiKey(userId, id);
    return NextResponse.json({ success: true });
  });
}
