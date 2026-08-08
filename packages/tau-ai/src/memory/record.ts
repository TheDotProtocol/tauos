/**
 * Record helpers (AI-5).
 */

import type { MemoryRecord, MemoryWriteInput } from './types';
import { TAU_MEMORY_FOUNDATION_VERSION } from './types';

export function createMemoryRecord(input: MemoryWriteInput, id: string): MemoryRecord {
  const now = new Date().toISOString();
  return {
    id,
    category: input.category,
    content: input.content,
    reference: input.reference,
    source: input.source,
    originKind: input.originKind,
    createdAt: now,
    updatedAt: now,
    expiresAt: input.expiresAt,
    importance: input.importance,
    confidence: input.confidence ?? 'UNKNOWN',
    provenance: {
      source: input.source,
      originKind: input.originKind,
      recordedAt: now,
      license: 'UNKNOWN',
      permissions: 'UNKNOWN',
      version: 1,
    },
    scope: input.scope,
    privacyClass: input.privacyClass ?? 'LOCAL',
    retentionPolicy: input.retentionPolicy,
    consentState: input.consentState ?? 'NOT_REQUIRED',
    tags: input.tags,
    version: 1,
    userId: input.userId,
    projectId: input.projectId,
    productId: input.productId,
    sessionId: input.sessionId,
  };
}

export function updateMemoryRecord(
  existing: MemoryRecord,
  patch: {
    content?: string;
    reference?: string;
    expiresAt?: string;
    importance?: number;
    consentState?: MemoryRecord['consentState'];
    tags?: string[];
    source?: MemoryRecord['source'];
    originKind?: MemoryRecord['originKind'];
  },
): MemoryRecord {
  const now = new Date().toISOString();
  return {
    ...existing,
    content: patch.content ?? existing.content,
    reference: patch.reference ?? existing.reference,
    expiresAt: patch.expiresAt ?? existing.expiresAt,
    importance: patch.importance ?? existing.importance,
    consentState: patch.consentState ?? existing.consentState,
    tags: patch.tags ?? existing.tags,
    source: patch.source ?? existing.source,
    originKind: patch.originKind ?? existing.originKind,
    updatedAt: now,
    version: existing.version + 1,
    provenance: {
      ...existing.provenance,
      source: patch.source ?? existing.provenance.source,
      originKind: patch.originKind ?? existing.provenance.originKind,
      version: existing.provenance.version + 1,
      recordedAt: now,
    },
  };
}

export { TAU_MEMORY_FOUNDATION_VERSION };
