/**
 * Future semantic retrieval boundary (AI-5).
 *
 * No vector database in this milestone — interface only for future adapters.
 */

import type { MemoryContext, MemoryContextItem, MemoryRecord, MemoryRetrievalContext } from './types';
import { TAU_MEMORY_FOUNDATION_VERSION } from './types';

export type SemanticRetrievalAdapter = {
  readonly id: string;
  readonly kind: 'SEMANTIC';
  /** Future: embedding-based retrieval. Not implemented in AI-5. */
  findRelevant(
    records: MemoryRecord[],
    context: MemoryRetrievalContext,
  ): Promise<MemoryContextItem[]>;
};

/** Deterministic keyword relevance — no embeddings. */
export function findRelevantDeterministic(
  records: MemoryRecord[],
  context: MemoryRetrievalContext,
): MemoryContext {
  const query = (context.query ?? '').trim().toLowerCase();
  const limit = context.limit ?? 10;

  const eligible = records.filter((r) => {
    if (context.categories && !context.categories.includes(r.category)) return false;
    if (context.privacyMode === 'LOCAL_ONLY' && r.privacyClass === 'REMOTE_ALLOWED') return false;
    return true;
  });

  const scored: MemoryContextItem[] = eligible.map((record) => {
    let score = record.importance ?? 0;
    if (record.originKind === 'EXPLICIT') score += 10;
    if (query) {
      const hay = `${record.content} ${record.reference ?? ''}`.toLowerCase();
      if (hay.includes(query)) score += 20;
      const tokens = query.split(/\s+/).filter(Boolean);
      for (const token of tokens) {
        if (hay.includes(token)) score += 2;
      }
    }
    return {
      id: record.id,
      category: record.category,
      content: record.content,
      scope: record.scope,
      privacyClass: record.privacyClass,
      provenance: record.provenance,
      relevanceScore: score,
    };
  });

  scored.sort((a, b) => b.relevanceScore - a.relevanceScore);

  const top = scored.slice(0, limit);
  const scopes = new Set(top.map((m) => m.scope));
  const privacy = new Set(top.map((m) => m.privacyClass));

  return {
    memories: top,
    scope: scopes.size === 1 ? top[0]!.scope : 'MIXED',
    privacyClass: privacy.size === 1 ? top[0]!.privacyClass : 'MIXED',
    provenance: top.map((m) => m.provenance),
    retrievalPolicy: 'DETERMINISTIC_KEYWORD',
    foundationVersion: TAU_MEMORY_FOUNDATION_VERSION,
  };
}
