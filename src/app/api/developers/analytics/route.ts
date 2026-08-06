import { NextRequest, NextResponse } from 'next/server';
import { getAnalytics } from '@/lib/tau-developer/server/platform-db';
import { withDeveloperHandler } from '@/lib/tau-developer/server/route-auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  return withDeveloperHandler(request, 'developers.analytics.get', async (userId) => {
    const range = request.nextUrl.searchParams.get('range') ?? '30d';
    const analytics = await getAnalytics(userId, range);
    return NextResponse.json(analytics);
  });
}
