import { NextRequest, NextResponse } from 'next/server';
import { requireAuthUser, authErrorResponse, getAuthUser, userIdString } from './auth';
import { checkRateLimit, rateLimitKey, RATE_LIMITS } from './rate-limit';
import { recordMetric } from './metrics';
import { auditLog } from './security';

export type GuardOptions = {
  requireAuth?: boolean;
  rateLimit?: keyof typeof RATE_LIMITS | { limit: number; windowMs: number };
  metricKey?: string;
  projectIdParam?: string;
};

export type GuardResult =
  | { ok: true; userId?: string; start: number }
  | { ok: false; response: NextResponse };

function rateLimitResponse(resetAt: number) {
  return NextResponse.json(
    { error: 'Rate limit exceeded. Please try again later.' },
    { status: 429, headers: { 'Retry-After': String(Math.ceil((resetAt - Date.now()) / 1000)) } }
  );
}

export function guardRequest(request: NextRequest, options: GuardOptions = {}): GuardResult {
  const start = Date.now();
  const { requireAuth = false, rateLimit = 'api', metricKey } = options;

  const rlConfig = typeof rateLimit === 'string' ? RATE_LIMITS[rateLimit] : rateLimit;
  const rlKey = rateLimitKey(request, metricKey ?? 'api');
  const rl = checkRateLimit(rlKey, rlConfig.limit, rlConfig.windowMs);
  if (!rl.allowed) {
    auditLog('rate_limit.exceeded', { key: rlKey });
    return { ok: false, response: rateLimitResponse(rl.resetAt) };
  }

  if (requireAuth) {
    try {
      const user = requireAuthUser(request);
      return { ok: true, userId: userIdString(user), start };
    } catch (e) {
      const resp = authErrorResponse(e);
      if (resp) return { ok: false, response: resp };
      return { ok: false, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
    }
  }

  const user = getAuthUser(request);
  return { ok: true, userId: user?.userId ? userIdString(user) : undefined, start };
}

export function finishGuard(metricKey: string, start: number, error?: string, userId?: string) {
  const durationMs = Date.now() - start;
  recordMetric(metricKey, durationMs, error);
  import('@/lib/tau-developer/server/platform-db')
    .then(({ recordDailyMetric }) => recordDailyMetric(userId, metricKey, durationMs, Boolean(error)))
    .catch(() => {});
}

export function safeErrorMessage(error: unknown, production = process.env.NODE_ENV === 'production'): string {
  if (!production && error instanceof Error) return error.message;
  if (error instanceof Error && error.message.includes('Authentication')) return error.message;
  if (error instanceof Error && error.message.includes('Rate limit')) return error.message;
  if (error instanceof Error && error.message.includes('Not found')) return error.message;
  return 'An internal error occurred';
}
