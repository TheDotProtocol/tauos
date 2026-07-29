import { NextRequest, NextResponse } from 'next/server';
import { requireAuthUser, authErrorResponse, userIdString } from '@/lib/tau-ide/server/auth';
import { globalSearch } from '@/lib/tau-ide/server/knowledge';

export async function GET(request: NextRequest) {
  try {
    const user = requireAuthUser(request);
    const q = request.nextUrl.searchParams.get('q') ?? '';
    if (!q.trim()) return NextResponse.json({ results: [] });
    const results = await globalSearch(userIdString(user), q.trim());
    return NextResponse.json({ results, query: q });
  } catch (e) {
    return authErrorResponse(e) ?? NextResponse.json({ results: [] });
  }
}
