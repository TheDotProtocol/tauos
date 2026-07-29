import { checkRateLimit as checkRL } from './rate-limit';

/** @deprecated Use checkRateLimit from rate-limit.ts */
export function rateLimit(key: string, limit = 60, windowMs = 60_000): boolean {
  return checkRL(key, limit, windowMs).allowed;
}

export { checkRateLimit } from './rate-limit';

export function auditLog(action: string, meta: Record<string, unknown>) {
  console.info('[tau-ide-audit]', JSON.stringify({ action, ...meta, ts: new Date().toISOString() }));
}
