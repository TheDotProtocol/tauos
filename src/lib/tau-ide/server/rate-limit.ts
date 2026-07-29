/**
 * Rate limiting with in-memory buckets.
 * Set REDIS_URL for future distributed limiting (architecture ready — falls back to memory).
 */

type Bucket = { count: number; resetAt: number };

const memoryBuckets = new Map<string, Bucket>();

export type RateLimitResult = { allowed: boolean; remaining: number; resetAt: number };

export function checkRateLimit(key: string, limit = 60, windowMs = 60_000): RateLimitResult {
  // Future: if (process.env.REDIS_URL) return redisRateLimit(...)
  const now = Date.now();
  const bucket = memoryBuckets.get(key);
  if (!bucket || now > bucket.resetAt) {
    memoryBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }
  if (bucket.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: bucket.resetAt };
  }
  bucket.count++;
  return { allowed: true, remaining: limit - bucket.count, resetAt: bucket.resetAt };
}

export function rateLimitKey(request: Request, prefix: string): string {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const ip = forwarded || request.headers.get('x-real-ip') || 'anonymous';
  return `${prefix}:${ip}`;
}

/** Presets for RC1 */
export const RATE_LIMITS = {
  ai: { limit: 20, windowMs: 60_000 },
  compute: { limit: 120, windowMs: 60_000 },
  api: { limit: 300, windowMs: 60_000 },
  auth: { limit: 30, windowMs: 60_000 },
} as const;
