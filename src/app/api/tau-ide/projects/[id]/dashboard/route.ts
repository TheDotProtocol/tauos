import { NextRequest, NextResponse } from 'next/server';
import { requireAuthUser, authErrorResponse, userIdString } from '@/lib/tau-ide/server/auth';
import { getProjectDashboard } from '@/lib/tau-ide/server/knowledge';

type Ctx = { params: { id: string } };

export async function GET(request: NextRequest, { params }: Ctx) {
  try {
    const user = requireAuthUser(request);
    const dashboard = await getProjectDashboard(userIdString(user), params.id);
    if (!dashboard) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(dashboard);
  } catch (e) {
    return authErrorResponse(e) ?? NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
