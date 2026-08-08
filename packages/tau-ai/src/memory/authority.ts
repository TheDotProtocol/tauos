/**
 * Memory authority hierarchy (AI-5).
 *
 * Memory is context — not authority above constitutional rules or current explicit instructions.
 */

import type { MemoryOriginKind, MemoryRecord, MemoryScope } from './types';

export type MemoryAuthorityLevel =
  | 'CONSTITUTION'
  | 'SYSTEM_POLICY'
  | 'CURRENT_EXPLICIT_USER_INSTRUCTION'
  | 'USER_EXPLICIT_MEMORY'
  | 'PROJECT_MEMORY'
  | 'INFERRED_CONTEXT'
  | 'EXTERNAL_CONTENT';

export const MEMORY_AUTHORITY_HIERARCHY: Array<{
  level: MemoryAuthorityLevel;
  rank: number;
  description: string;
}> = [
  { level: 'CONSTITUTION', rank: 1, description: 'Constitutional rules — highest authority.' },
  { level: 'SYSTEM_POLICY', rank: 2, description: 'Platform privacy, security, routing policies.' },
  {
    level: 'CURRENT_EXPLICIT_USER_INSTRUCTION',
    rank: 3,
    description: 'Current explicit user request within constitutional bounds.',
  },
  { level: 'USER_EXPLICIT_MEMORY', rank: 4, description: 'User explicitly stored preferences and profile.' },
  { level: 'PROJECT_MEMORY', rank: 5, description: 'Project-scoped durable context.' },
  { level: 'INFERRED_CONTEXT', rank: 6, description: 'Inferred conversation context — lowest durable authority.' },
  { level: 'EXTERNAL_CONTENT', rank: 7, description: 'External/retrieved content — never governing.' },
];

export function authorityLevelForRecord(record: MemoryRecord): MemoryAuthorityLevel {
  if (record.originKind === 'INFERRED') return 'INFERRED_CONTEXT';
  if (record.scope === 'PROJECT') return 'PROJECT_MEMORY';
  if (record.originKind === 'EXPLICIT') return 'USER_EXPLICIT_MEMORY';
  return 'INFERRED_CONTEXT';
}

export function scopeMayPromoteTo(from: MemoryScope, to: MemoryScope): boolean {
  if (from === to) return true;
  const order: MemoryScope[] = ['SESSION', 'USER', 'PROJECT', 'PRODUCT', 'SYSTEM'];
  const fromIdx = order.indexOf(from);
  const toIdx = order.indexOf(to);
  return toIdx >= fromIdx;
}

/** Deterministic conflict winner — newer explicit beats older; explicit beats inferred. */
export function resolveMemoryConflict(
  existing: MemoryRecord,
  incoming: MemoryRecord,
  currentExplicitInstruction?: string,
): 'KEEP_EXISTING' | 'SUPERSEDE_WITH_INCOMING' {
  if (currentExplicitInstruction && incoming.originKind === 'EXPLICIT') {
    return 'SUPERSEDE_WITH_INCOMING';
  }
  if (incoming.originKind === 'EXPLICIT' && existing.originKind === 'INFERRED') {
    return 'SUPERSEDE_WITH_INCOMING';
  }
  if (existing.originKind === 'EXPLICIT' && incoming.originKind === 'INFERRED') {
    return 'KEEP_EXISTING';
  }
  const existingTime = Date.parse(existing.updatedAt);
  const incomingTime = Date.parse(incoming.updatedAt);
  return incomingTime >= existingTime ? 'SUPERSEDE_WITH_INCOMING' : 'KEEP_EXISTING';
}

export function recordsConflict(a: MemoryRecord, b: MemoryRecord): boolean {
  if (a.scope !== b.scope) return false;
  if (a.category !== b.category) return false;
  if (a.userId !== b.userId) return false;
  if (a.projectId !== b.projectId) return false;

  const aKey = preferenceKeyFromTags(a.tags);
  const bKey = preferenceKeyFromTags(b.tags);
  if (aKey && bKey && aKey === bKey) return true;

  return false;
}

export function preferenceKeyFromTags(tags?: string[]): string | undefined {
  return tags?.find((t) => t.startsWith('preferenceKey:'))?.slice('preferenceKey:'.length);
}

export function preferenceKeyTag(key: string): string {
  return `preferenceKey:${key}`;
}

/** Returns false when scope promotion would be silent/forbidden (e.g. PROJECT → SYSTEM). */
export function assertScopePromotion(from: MemoryScope, to: MemoryScope): boolean {
  if (from === to) return true;
  if (to === 'SYSTEM' && from !== 'SYSTEM') return false;
  return scopeMayPromoteTo(from, to);
}
