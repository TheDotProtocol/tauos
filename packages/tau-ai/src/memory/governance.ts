/**
 * Constitution-governed memory write evaluation (AI-5).
 */

import type { Constitution } from '../constitution/constitution';
import type { PrivacyMode } from '../routing/routing-types';
import type { MemoryEntry } from './store';
import type { MemoryWriteInput, MemoryWriteOutcome } from './types';
import { preferenceKeyFromTags } from './authority';

export type MemoryGovernanceDecision = {
  allowed: boolean;
  outcome: MemoryWriteOutcome;
  policyResult: 'PASS' | 'WARN' | 'BLOCK';
  reason?: string;
  constitutionVersion?: string;
};

const DURABLE_RETENTION = new Set(['LONG_TERM', 'USER_CONTROLLED', 'UNTIL_EXPIRY']);

export function isDurableRetention(policy: MemoryWriteInput['retentionPolicy']): boolean {
  return DURABLE_RETENTION.has(policy);
}

export function memoryInputToEntry(input: MemoryWriteInput, id: string): MemoryEntry {
  return {
    id,
    content: input.content,
    createdAt: new Date().toISOString(),
    expiresAt: input.expiresAt,
    metadata: {
      category: input.category,
      source: input.source,
      originKind: input.originKind,
      scope: input.scope,
      retentionPolicy: input.retentionPolicy,
      consentState: input.consentState ?? 'NOT_REQUIRED',
      conflictsWithPrivacy: input.metadataConflictsWithPrivacy === true,
      conflictsWithSecurity: input.metadataConflictsWithSecurity === true,
      preferenceKey: preferenceKeyFromTags(input.tags),
    },
  };
}

export async function evaluateMemoryWriteGovernance(
  input: MemoryWriteInput,
  options: {
    constitution?: Constitution;
    privacyMode?: PrivacyMode;
    userId?: string;
    appId?: string;
  },
): Promise<MemoryGovernanceDecision> {
  const id = input.id ?? `mem-${Date.now()}`;
  const entry = memoryInputToEntry(input, id);

  if (options.privacyMode === 'LOCAL_ONLY' && input.privacyClass === 'REMOTE_ALLOWED') {
    return {
      allowed: false,
      outcome: 'REJECTED',
      policyResult: 'BLOCK',
      reason: 'LOCAL_ONLY: memory with remote privacy class rejected.',
    };
  }

  if (input.source === 'EXTERNAL' && input.retentionPolicy !== 'SESSION') {
    return {
      allowed: false,
      outcome: 'REQUIRES_CONFIRMATION',
      policyResult: 'BLOCK',
      reason: 'External content cannot become durable memory without explicit consent.',
    };
  }

  if (
    input.originKind === 'INFERRED' &&
    isDurableRetention(input.retentionPolicy) &&
    input.consentState !== 'GRANTED'
  ) {
    return {
      allowed: false,
      outcome: 'REQUIRES_CONFIRMATION',
      policyResult: 'WARN',
      reason: 'Inferred memory requires explicit consent before durable persistence.',
    };
  }

  if (input.scope === 'SYSTEM' && input.source !== 'SYSTEM') {
    return {
      allowed: false,
      outcome: 'REJECTED',
      policyResult: 'BLOCK',
      reason: 'Non-system source cannot write SYSTEM scope memory.',
    };
  }

  if (options.constitution) {
    const decision = await options.constitution.evaluateMemoryWrite({
      userId: options.userId,
      appId: options.appId,
      entry,
    });
    if (!decision.allowed) {
      return {
        allowed: false,
        outcome: 'REJECTED',
        policyResult: 'BLOCK',
        reason: decision.reason ?? 'Constitution blocked memory write.',
      };
    }
  }

  return {
    allowed: true,
    outcome: 'STORED',
    policyResult: 'PASS',
  };
}

export function isExpired(record: { expiresAt?: string }, now = Date.now()): boolean {
  if (!record.expiresAt) return false;
  return Date.parse(record.expiresAt) <= now;
}
