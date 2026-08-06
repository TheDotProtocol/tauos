import { NextRequest, NextResponse } from 'next/server';
import {
  createWebhook,
  deleteWebhook,
  listWebhooks,
  updateWebhook,
} from '@/lib/tau-developer/server/platform-db';
import { withDeveloperHandler } from '@/lib/tau-developer/server/route-auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  return withDeveloperHandler(request, 'developers.webhooks.list', async (userId) => {
    const webhooks = await listWebhooks(userId);
    return NextResponse.json({ webhooks });
  });
}

export async function POST(request: NextRequest) {
  return withDeveloperHandler(request, 'developers.webhooks.create', async (userId) => {
    const body = await request.json();
    const webhook = await createWebhook(
      userId,
      String(body.url ?? '').trim(),
      Array.isArray(body.events) ? body.events : ['deploy', 'build'],
    );
    return NextResponse.json({ webhook }, { status: 201 });
  });
}

export async function PATCH(request: NextRequest) {
  return withDeveloperHandler(request, 'developers.webhooks.update', async (userId) => {
    const body = await request.json();
    await updateWebhook(userId, body.id, {
      url: body.url,
      events: body.events,
      active: body.active,
    });
    const webhooks = await listWebhooks(userId);
    return NextResponse.json({ webhooks });
  });
}

export async function DELETE(request: NextRequest) {
  return withDeveloperHandler(request, 'developers.webhooks.delete', async (userId) => {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
    await deleteWebhook(userId, id);
    return NextResponse.json({ success: true });
  });
}
