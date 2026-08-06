import { NextRequest, NextResponse } from 'next/server';
import {
  installExtension,
  listInstalledExtensions,
  uninstallExtension,
  updateExtensionConfig,
} from '@/lib/tau-developer/server/platform-db';
import { withDeveloperHandler } from '@/lib/tau-developer/server/route-auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  return withDeveloperHandler(request, 'developers.extensions.list', async (userId) => {
    const extensions = await listInstalledExtensions(userId);
    return NextResponse.json({ extensions });
  });
}

export async function POST(request: NextRequest) {
  return withDeveloperHandler(request, 'developers.extensions.install', async (userId) => {
    const body = await request.json();
    if (body.action === 'install') {
      const extensions = await installExtension(userId, String(body.slug));
      return NextResponse.json({ extensions }, { status: 201 });
    }
    if (body.action === 'configure') {
      await updateExtensionConfig(userId, body.installId, body.config ?? {}, body.autoUpdate);
      const extensions = await listInstalledExtensions(userId);
      return NextResponse.json({ extensions });
    }
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  });
}

export async function DELETE(request: NextRequest) {
  return withDeveloperHandler(request, 'developers.extensions.uninstall', async (userId) => {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
    await uninstallExtension(userId, id);
    const extensions = await listInstalledExtensions(userId);
    return NextResponse.json({ extensions });
  });
}
