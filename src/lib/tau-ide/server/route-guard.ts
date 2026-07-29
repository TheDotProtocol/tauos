import { NextRequest, NextResponse } from 'next/server';
import { guardRequest, finishGuard, safeErrorMessage } from '@/lib/tau-ide/server/api-guard';

type Handler = (request: NextRequest, body: Record<string, unknown>) => Promise<NextResponse>;

export function withTauScriptGuard(handler: Handler, metricKey: string) {
  return async (request: NextRequest) => {
    const guard = guardRequest(request, { requireAuth: false, rateLimit: 'compute', metricKey });
    if (guard.ok === false) return guard.response;
    const start = guard.start;
    try {
      const body = await request.json();
      const res = await handler(request, body);
      finishGuard(metricKey, start);
      return res;
    } catch (e) {
      finishGuard(metricKey, start, safeErrorMessage(e));
      return NextResponse.json({ error: safeErrorMessage(e) }, { status: 500 });
    }
  };
}

export function withArchitectGuard(
  handler: (request: NextRequest, body: Record<string, unknown>, userId: string) => Promise<Response | NextResponse>
) {
  return async (request: NextRequest) => {
    const guard = guardRequest(request, { requireAuth: true, rateLimit: 'ai', metricKey: 'architect' });
    if (guard.ok === false) return guard.response;
    const start = guard.start;
    const userId = guard.userId!;
    try {
      const body = await request.json();
      const res = await handler(request, body, userId);
      finishGuard('architect', start);
      return res;
    } catch (e) {
      finishGuard('architect', start, safeErrorMessage(e));
      return NextResponse.json({ error: safeErrorMessage(e) }, { status: 500 });
    }
  };
}
