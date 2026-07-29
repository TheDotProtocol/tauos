/** In-process metrics — Redis-compatible export shape for future Tau Cloud */

export type MetricEntry = {
  count: number;
  errors: number;
  totalMs: number;
  lastAt: string | null;
  lastError: string | null;
};

const metrics = new Map<string, MetricEntry>();

function entry(key: string): MetricEntry {
  let e = metrics.get(key);
  if (!e) {
    e = { count: 0, errors: 0, totalMs: 0, lastAt: null, lastError: null };
    metrics.set(key, e);
  }
  return e;
}

export function recordMetric(key: string, durationMs: number, error?: string) {
  const e = entry(key);
  e.count++;
  e.totalMs += durationMs;
  e.lastAt = new Date().toISOString();
  if (error) {
    e.errors++;
    e.lastError = error;
  }
}

export function getMetrics(): Record<string, MetricEntry & { avgMs: number }> {
  const out: Record<string, MetricEntry & { avgMs: number }> = {};
  metrics.forEach((v, k) => {
    out[k] = { ...v, avgMs: v.count ? Math.round(v.totalMs / v.count) : 0 };
  });
  return out;
}

export function getMetricSummary() {
  const all = getMetrics();
  const totalRequests = Object.values(all).reduce((s, m) => s + m.count, 0);
  const totalErrors = Object.values(all).reduce((s, m) => s + m.errors, 0);
  return { totalRequests, totalErrors, endpoints: Object.keys(all).length, metrics: all };
}
