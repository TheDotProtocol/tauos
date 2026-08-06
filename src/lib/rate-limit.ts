import { NextRequest } from 'next/server';
import { getRedisBackend } from '@/lib/redis-backend';

type Bucket = { count: number; resetAt: number };

const memoryStore = new Map<string, Bucket>();

export function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

function checkMemoryRateLimit(
  key: string,
  maxAttempts: number,
  windowMs: number
): { allowed: boolean; retryAfterSec?: number } {
  const now = Date.now();
  const bucket = memoryStore.get(key);

  if (!bucket || now > bucket.resetAt) {
    memoryStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (bucket.count >= maxAttempts) {
    return { allowed: false, retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.count += 1;
  return { allowed: true };
}

/**
 * Distributed rate limit.
 * Priority: Upstash REST (UPSTASH_REDIS_REST_*) → Redis URL (REDIS_URL) → in-memory.
 */
export async function checkRateLimit(
  request: NextRequest,
  endpoint: string,
  maxAttempts = 20,
  windowMs = 15 * 60 * 1000
): Promise<{ allowed: boolean; retryAfterSec?: number }> {
  const key = `tau:rl:${getClientIp(request)}:${endpoint}`;
  const redis = await getRedisBackend();

  if (!redis) {
    return checkMemoryRateLimit(key, maxAttempts, windowMs);
  }

  try {
    const count = await redis.incr(key);
    if (count === 1) {
      await redis.pExpire(key, windowMs);
    }
    if (count > maxAttempts) {
      const ttl = await redis.pTTL(key);
      return {
        allowed: false,
        retryAfterSec: ttl > 0 ? Math.ceil(ttl / 1000) : Math.ceil(windowMs / 1000),
      };
    }
    return { allowed: true };
  } catch {
    return checkMemoryRateLimit(key, maxAttempts, windowMs);
  }
}
