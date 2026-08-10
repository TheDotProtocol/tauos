import { withTauMailAuth } from '@/lib/taumail/api-route';
import {
  isRemotePushConfigured,
  registerPushDevice,
  unregisterPushDevice,
  type PushPlatform,
} from '@/lib/taumail/push';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function normalizePlatform(raw: unknown): PushPlatform {
  const value = String(raw || '').toLowerCase();
  if (value === 'ios') return 'ios';
  if (value === 'android') return 'android';
  return 'unknown';
}

export async function POST(request: NextRequest) {
  return withTauMailAuth(request, async (userId) => {
    const body = await request.json();
    const deviceId = String(body.deviceId || '').trim();
    if (!deviceId) {
      return NextResponse.json({ error: 'deviceId is required' }, { status: 400 });
    }

    await registerPushDevice(userId, {
      deviceId,
      platform: normalizePlatform(body.platform),
      pushToken: body.pushToken ? String(body.pushToken) : null,
    });

    return NextResponse.json({
      success: true,
      remotePushConfigured: isRemotePushConfigured(),
    });
  });
}

export async function DELETE(request: NextRequest) {
  return withTauMailAuth(request, async (userId) => {
    const body = await request.json().catch(() => ({}));
    const deviceId = String(body.deviceId || request.nextUrl.searchParams.get('deviceId') || '').trim();
    if (!deviceId) {
      return NextResponse.json({ error: 'deviceId is required' }, { status: 400 });
    }

    await unregisterPushDevice(userId, deviceId);
    return NextResponse.json({ success: true });
  });
}
