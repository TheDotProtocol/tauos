import { NextRequest, NextResponse } from 'next/server';
import { requireAuthUser, authErrorResponse, userIdString } from '@/lib/tau-ide/server/auth';
import { capturePlatformError } from '@/lib/monitoring/error-reporting';

export function requireDeveloperUser(request: NextRequest) {
  return userIdString(requireAuthUser(request));
}

export function developerAuthError(e: unknown) {
  return authErrorResponse(e) ?? NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export async function withDeveloperHandler(
  request: NextRequest,
  source: string,
  fn: (userId: string) => Promise<NextResponse>,
) {
  let userId: string;
  try {
    userId = requireDeveloperUser(request);
  } catch (e) {
    return developerAuthError(e) ?? NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    return await fn(userId);
  } catch (e) {
    await capturePlatformError(source, e, { userId });
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Failed' }, { status: 500 });
  }
}
