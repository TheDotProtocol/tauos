import { NextRequest, NextResponse } from 'next/server';
import { requireAuthUser, authErrorResponse, userIdString } from '@/lib/tau-ide/server/auth';
import { listNotifications, markNotificationRead } from '@/lib/tau-ide/server/teams';

export async function GET(request: NextRequest) {
  try {
    const user = requireAuthUser(request);
    const notifications = await listNotifications(userIdString(user));
    return NextResponse.json({ notifications });
  } catch (e) {
    return authErrorResponse(e) ?? NextResponse.json({ notifications: [] });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = requireAuthUser(request);
    const { id } = await request.json();
    await markNotificationRead(id, userIdString(user));
    return NextResponse.json({ success: true });
  } catch (e) {
    return authErrorResponse(e) ?? NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
