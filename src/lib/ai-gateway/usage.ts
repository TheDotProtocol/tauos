import type { TokenUsage } from './types';

type UsageRecord = TokenUsage & {
  provider: string;
  model: string;
  timestamp: string;
  agent?: string;
};

const usageLog: UsageRecord[] = [];
const MAX_LOG = 1000;

export function trackUsage(provider: string, model: string, usage: TokenUsage, agent?: string) {
  usageLog.push({ ...usage, provider, model, timestamp: new Date().toISOString(), agent });
  if (usageLog.length > MAX_LOG) usageLog.splice(0, usageLog.length - MAX_LOG);
}

export function getUsageStats() {
  const total = usageLog.reduce(
    (acc, r) => ({
      promptTokens: acc.promptTokens + r.promptTokens,
      completionTokens: acc.completionTokens + r.completionTokens,
      totalTokens: acc.totalTokens + r.totalTokens,
      estimatedCostUsd: (acc.estimatedCostUsd ?? 0) + (r.estimatedCostUsd ?? 0),
    }),
    { promptTokens: 0, completionTokens: 0, totalTokens: 0, estimatedCostUsd: 0 }
  );
  const byProvider: Record<string, { requests: number; tokens: number }> = {};
  for (const r of usageLog) {
    if (!byProvider[r.provider]) byProvider[r.provider] = { requests: 0, tokens: 0 };
    byProvider[r.provider].requests++;
    byProvider[r.provider].tokens += r.totalTokens;
  }
  return { total, byProvider, recentCount: usageLog.length };
}

export function getRecentUsage(limit = 20) {
  return usageLog.slice(-limit).reverse();
}
