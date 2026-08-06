import { NextRequest } from 'next/server';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

export { getClientIp };

/** Auth route rate limit — Redis-backed when REDIS_URL is configured. */
export async function checkAuthRateLimit(
  request: NextRequest,
  endpoint: string,
  maxAttempts = 20,
  windowMs = 15 * 60 * 1000
): Promise<{ allowed: boolean; retryAfterSec?: number }> {
  return checkRateLimit(request, endpoint, maxAttempts, windowMs);
}
