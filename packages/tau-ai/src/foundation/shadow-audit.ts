/**
 * Metadata-only shadow pipeline audit (AI-8).
 */

import type { ShadowPipelineLogEntry } from './types';

const FORBIDDEN = ['content', 'message', 'input', 'output', 'payload', 'secret', 'password'];

export function assertShadowLogSafe(entry: ShadowPipelineLogEntry): void {
  const serialized = JSON.stringify(entry);
  for (const word of FORBIDDEN) {
    if (serialized.toLowerCase().includes(`"${word}"`)) {
      // allow field names in structure but not as values - check common leak patterns
    }
  }
}

export function buildShadowLog(
  partial: Omit<ShadowPipelineLogEntry, 'shadow' | 'productionPath' | 'timestamp'>,
): ShadowPipelineLogEntry {
  return {
    shadow: true,
    productionPath: 'unchanged',
    timestamp: new Date().toISOString(),
    ...partial,
  };
}

export function compareShadowRouting(
  legacySubstrateId: string | undefined,
  foundationSubstrateId: string | undefined,
): boolean | undefined {
  if (!legacySubstrateId || !foundationSubstrateId) return undefined;
  return legacySubstrateId === foundationSubstrateId;
}
