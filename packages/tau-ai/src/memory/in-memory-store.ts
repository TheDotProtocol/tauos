/**
 * In-memory governed MemoryStore (AI-5).
 *
 * Replaceable local implementation for development/testing — not permanent storage architecture.
 */

import type { Constitution } from '../constitution/constitution';
import type { ChatMessage, TauAIAppId, TauAIThreadId, TauAIUserId } from '../types';
import { createMemoryAuditLog, type MemoryAuditLog } from './audit-log';
import {
  preferenceKeyFromTags,
  preferenceKeyTag,
  recordsConflict,
  resolveMemoryConflict,
  scopeMayPromoteTo,
} from './authority';
import {
  evaluateMemoryWriteGovernance,
  isExpired,
} from './governance';
import { createMemoryRecord, TAU_MEMORY_FOUNDATION_VERSION, updateMemoryRecord } from './record';
import { findRelevantDeterministic } from './retrieval';
import type {
  KnowledgeHit,
  KnowledgeQuery,
  MemoryEntry,
  MemoryStore,
  UserPreference,
} from './store';
import type {
  MemoryAuditEntry,
  MemoryContext,
  MemoryDeleteFilter,
  MemoryQueryFilter,
  MemoryRecord,
  MemoryRetrievalContext,
  MemoryUpdateInput,
  MemoryWriteInput,
  MemoryWriteRequest,
  MemoryWriteResult,
} from './types';

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export type TauMemoryFoundationOptions = {
  constitution?: Constitution;
};

/** AI-5 governed memory facade — extends AI-1 MemoryStore contract. */
export interface TauMemoryFoundation extends MemoryStore {
  readonly foundationVersion: string;
  requestMemoryWrite(request: MemoryWriteRequest): Promise<MemoryWriteResult>;
  getRecord(id: string): Promise<MemoryRecord | undefined>;
  listRecords(filter?: MemoryQueryFilter): Promise<MemoryRecord[]>;
  queryRecords(filter: MemoryQueryFilter): Promise<MemoryRecord[]>;
  findRelevant(context: MemoryRetrievalContext): Promise<MemoryContext>;
  updateRecord(id: string, update: MemoryUpdateInput): Promise<MemoryWriteResult>;
  deleteRecord(id: string): Promise<boolean>;
  deleteByCategory(filter: MemoryDeleteFilter): Promise<number>;
  deleteByScope(filter: MemoryDeleteFilter): Promise<number>;
  clearUserMemory(userId: TauAIUserId): Promise<number>;
  getAuditLog(): MemoryAuditEntry[];
  purgeExpired(): number;
}

export class InMemoryGovernedMemoryStore implements TauMemoryFoundation {
  readonly foundationVersion = TAU_MEMORY_FOUNDATION_VERSION;

  private records = new Map<string, MemoryRecord>();
  private threads = new Map<TauAIThreadId, ChatMessage[]>();
  private audit: MemoryAuditLog;
  private constitution?: Constitution;

  readonly conversation: MemoryStore['conversation'];
  readonly shortTerm: MemoryStore['shortTerm'];
  readonly longTerm: MemoryStore['longTerm'];
  readonly preferences: MemoryStore['preferences'];
  readonly knowledge: MemoryStore['knowledge'];

  constructor(options: TauMemoryFoundationOptions = {}) {
    this.constitution = options.constitution;
    this.audit = createMemoryAuditLog();

    this.conversation = {
      append: async (threadId, message) => {
        const list = this.threads.get(threadId) ?? [];
        list.push(message);
        this.threads.set(threadId, list);
      },
      getThread: async (threadId, limit) => {
        const list = this.threads.get(threadId) ?? [];
        return limit ? list.slice(-limit) : [...list];
      },
      clearThread: async (threadId) => {
        this.threads.delete(threadId);
      },
    };

    this.shortTerm = {
      remember: async (userId, appId, entry) => {
        await this.requestMemoryWrite({
          input: {
            category: 'CONVERSATION_MEMORY',
            content: entry.content,
            source: 'USER_CONVERSATION',
            originKind: 'INFERRED',
            scope: 'SESSION',
            retentionPolicy: 'SHORT_TERM',
            consentState: 'NOT_REQUIRED',
            userId,
            productId: appId,
            expiresAt: entry.expiresAt,
            privacyClass: 'LOCAL',
          },
          privacyMode: 'REMOTE_ALLOWED',
        });
      },
      recall: async (userId, appId, query, limit = 10) => {
        const records = await this.queryRecords({
          userId,
          productId: appId,
          category: 'CONVERSATION_MEMORY',
          limit,
        });
        const entries: MemoryEntry[] = records.map(recordToEntry);
        if (!query) return entries;
        const q = query.toLowerCase();
        return entries.filter((e) => e.content.toLowerCase().includes(q));
      },
      purgeExpired: async () => {
        this.purgeExpired();
      },
    };

    this.longTerm = {
      store: async (userId, entry) => {
        await this.requestMemoryWrite({
          input: {
            category: 'KNOWLEDGE_MEMORY',
            content: entry.content,
            source: 'USER_EXPLICIT',
            originKind: 'EXPLICIT',
            scope: 'USER',
            retentionPolicy: 'LONG_TERM',
            consentState: 'GRANTED',
            userId,
            expiresAt: entry.expiresAt,
            privacyClass: 'LOCAL',
          },
        });
      },
      recall: async (userId, query, limit = 10) => {
        const ctx = await this.findRelevant({ userId, query, limit });
        return ctx.memories.map((m) => {
          const record = this.records.get(m.id);
          return recordToEntry(
            record ?? {
              id: m.id,
              category: m.category,
              content: m.content,
              source: m.provenance.source,
              originKind: m.provenance.originKind,
              createdAt: m.provenance.recordedAt,
              updatedAt: m.provenance.recordedAt,
              provenance: m.provenance,
              scope: m.scope,
              privacyClass: m.privacyClass,
              retentionPolicy: 'LONG_TERM',
              consentState: 'GRANTED',
              version: m.provenance.version,
            },
          );
        });
      },
      forget: async (userId, entryId) => {
        const record = await this.getRecord(entryId);
        if (record?.userId === userId) {
          await this.deleteRecord(entryId);
        }
      },
    };

    this.preferences = {
      get: async (userId, key) => {
        const records = await this.queryRecords({
          userId,
          category: 'PREFERENCE_MEMORY',
          tags: [preferenceKeyTag(key)],
          limit: 1,
        });
        const record = records[0];
        if (!record) return undefined;
        return {
          key,
          value: record.content,
          updatedAt: record.updatedAt,
        };
      },
      set: async (userId, key, value) => {
        await this.requestMemoryWrite({
          input: {
            category: 'PREFERENCE_MEMORY',
            content: String(value),
            source: 'USER_EXPLICIT',
            originKind: 'EXPLICIT',
            scope: 'USER',
            retentionPolicy: 'USER_CONTROLLED',
            consentState: 'GRANTED',
            userId,
            tags: [preferenceKeyTag(key)],
            privacyClass: 'LOCAL',
          },
        });
      },
      list: async (userId) => {
        const records = await this.queryRecords({
          userId,
          category: 'PREFERENCE_MEMORY',
        });
        return records.map((r) => ({
          key: preferenceKeyFromTags(r.tags) ?? r.id,
          value: r.content,
          updatedAt: r.updatedAt,
        }));
      },
    };

    this.knowledge = {
      search: async (query: KnowledgeQuery) => {
        const ctx = await this.findRelevant({
          query: query.query,
          limit: query.limit ?? 10,
        });
        return ctx.memories.map(
          (m): KnowledgeHit => ({
            id: m.id,
            content: m.content,
            score: m.relevanceScore,
            source: m.provenance.source,
            metadata: { category: m.category },
          }),
        );
      },
    };
  }

  async requestMemoryWrite(request: MemoryWriteRequest): Promise<MemoryWriteResult> {
    const { input, privacyMode, currentExplicitInstruction } = request;
    const userId = input.userId;
    const appId = input.productId;

    const governance = await evaluateMemoryWriteGovernance(input, {
      constitution: this.constitution,
      privacyMode,
      userId,
      appId,
    });

    if (!governance.allowed) {
      this.audit.append({
        timestamp: new Date().toISOString(),
        operation: 'WRITE',
        category: input.category,
        scope: input.scope,
        outcome: governance.outcome,
        policyResult: governance.policyResult,
        metadata: { userId: userId ?? 'unknown' },
      });
      return {
        outcome: governance.outcome,
        reason: governance.reason,
        policyResult: governance.policyResult,
      };
    }

    const duplicate = this.findDuplicate(input);
    if (duplicate) {
      this.audit.append({
        timestamp: new Date().toISOString(),
        operation: 'WRITE',
        memoryId: duplicate.id,
        category: input.category,
        scope: input.scope,
        outcome: 'DUPLICATE',
        policyResult: 'PASS',
      });
      return {
        outcome: 'DUPLICATE',
        recordId: duplicate.id,
        reason: 'Identical memory already stored.',
        policyResult: 'PASS',
      };
    }

    const conflict = this.findConflict(input);
    if (conflict) {
      const incoming = createMemoryRecord(input, conflict.id);
      incoming.updatedAt = new Date().toISOString();
      const resolution = resolveMemoryConflict(conflict, incoming, currentExplicitInstruction);
      if (resolution === 'SUPERSEDE_WITH_INCOMING') {
        const updated = updateMemoryRecord(conflict, {
          content: input.content,
          reference: input.reference,
          expiresAt: input.expiresAt,
          originKind: input.originKind,
          source: input.source,
          tags: input.tags,
        });
        this.records.set(updated.id, updated);
        this.audit.append({
          timestamp: new Date().toISOString(),
          operation: 'UPDATE',
          memoryId: updated.id,
          category: updated.category,
          scope: updated.scope,
          outcome: 'STORED',
          policyResult: 'PASS',
          metadata: { version: updated.version },
        });
        return {
          outcome: 'STORED',
          recordId: updated.id,
          policyResult: 'PASS',
          version: updated.version,
        };
      }
    }

    const id = input.id ?? generateId('mem');
    const record = createMemoryRecord(input, id);
    if (isExpired(record)) {
      this.audit.append({
        timestamp: new Date().toISOString(),
        operation: 'WRITE',
        category: input.category,
        scope: input.scope,
        outcome: 'EXPIRED',
        policyResult: 'PASS',
      });
      return { outcome: 'EXPIRED', reason: 'Memory already expired at write time.' };
    }

    this.records.set(id, record);
    this.audit.append({
      timestamp: new Date().toISOString(),
      operation: 'WRITE',
      memoryId: id,
      category: record.category,
      scope: record.scope,
      outcome: 'STORED',
      policyResult: governance.policyResult,
      metadata: { version: record.version },
    });

    return {
      outcome: 'STORED',
      recordId: id,
      policyResult: governance.policyResult,
      version: record.version,
    };
  }

  async getRecord(id: string): Promise<MemoryRecord | undefined> {
    const record = this.records.get(id);
    if (!record) {
      this.audit.append({
        timestamp: new Date().toISOString(),
        operation: 'READ',
        memoryId: id,
        outcome: 'NOT_FOUND',
      });
      return undefined;
    }
    if (isExpired(record)) {
      this.audit.append({
        timestamp: new Date().toISOString(),
        operation: 'READ',
        memoryId: id,
        outcome: 'EXPIRED',
      });
      return undefined;
    }
    this.audit.append({
      timestamp: new Date().toISOString(),
      operation: 'READ',
      memoryId: id,
      category: record.category,
      scope: record.scope,
      outcome: 'FOUND',
    });
    return record;
  }

  async listRecords(filter: MemoryQueryFilter = {}): Promise<MemoryRecord[]> {
    return this.queryRecords(filter);
  }

  async queryRecords(filter: MemoryQueryFilter): Promise<MemoryRecord[]> {
    let results = Array.from(this.records.values());

    if (filter.userId) results = results.filter((r) => r.userId === filter.userId);
    if (filter.projectId) results = results.filter((r) => r.projectId === filter.projectId);
    if (filter.productId) results = results.filter((r) => r.productId === filter.productId);
    if (filter.sessionId) results = results.filter((r) => r.sessionId === filter.sessionId);
    if (filter.category) results = results.filter((r) => r.category === filter.category);
    if (filter.scope) results = results.filter((r) => r.scope === filter.scope);
    if (filter.tags?.length) {
      results = results.filter((r) => filter.tags!.every((t) => r.tags?.includes(t)));
    }
    if (!filter.includeExpired) {
      results = results.filter((r) => !isExpired(r));
    }

    results.sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
    if (filter.limit) results = results.slice(0, filter.limit);
    return results;
  }

  async findRelevant(context: MemoryRetrievalContext): Promise<MemoryContext> {
    const filter: MemoryQueryFilter = {
      userId: context.userId,
      projectId: context.projectId,
      productId: context.productId,
      sessionId: context.sessionId,
    };
    const records = await this.queryRecords(filter);
    const ctx = findRelevantDeterministic(records, context);

    this.audit.append({
      timestamp: new Date().toISOString(),
      operation: 'READ',
      outcome: 'FOUND',
      metadata: { count: ctx.memories.length, retrieval: 'DETERMINISTIC_KEYWORD' },
    });

    return ctx;
  }

  async updateRecord(id: string, update: MemoryUpdateInput): Promise<MemoryWriteResult> {
    const existing = await this.getRecord(id);
    if (!existing) {
      return { outcome: 'REJECTED', reason: 'Memory record not found.' };
    }

    const updated = updateMemoryRecord(existing, update);
    this.records.set(id, updated);
    this.audit.append({
      timestamp: new Date().toISOString(),
      operation: 'UPDATE',
      memoryId: id,
      category: updated.category,
      scope: updated.scope,
      outcome: 'STORED',
      metadata: { version: updated.version },
    });
    return { outcome: 'STORED', recordId: id, version: updated.version, policyResult: 'PASS' };
  }

  async deleteRecord(id: string): Promise<boolean> {
    const existed = this.records.delete(id);
    this.audit.append({
      timestamp: new Date().toISOString(),
      operation: 'DELETE',
      memoryId: id,
      outcome: existed ? 'STORED' : 'NOT_FOUND',
    });
    return existed;
  }

  async deleteByCategory(filter: MemoryDeleteFilter): Promise<number> {
    if (!filter.category) return 0;
    return this.deleteMatching(filter, (r) => r.category === filter.category);
  }

  async deleteByScope(filter: MemoryDeleteFilter): Promise<number> {
    if (!filter.scope) return 0;
    return this.deleteMatching(filter, (r) => r.scope === filter.scope);
  }

  async clearUserMemory(userId: TauAIUserId): Promise<number> {
    let count = 0;
    for (const [id, record] of Array.from(this.records.entries())) {
      if (record.userId === userId && record.scope !== 'SYSTEM') {
        this.records.delete(id);
        count++;
      }
    }
    this.audit.append({
      timestamp: new Date().toISOString(),
      operation: 'CLEAR',
      metadata: { userId, count },
    });
    return count;
  }

  getAuditLog(): MemoryAuditEntry[] {
    return this.audit.list();
  }

  purgeExpired(): number {
    let count = 0;
    for (const [id, record] of Array.from(this.records.entries())) {
      if (isExpired(record)) {
        this.records.delete(id);
        count++;
      }
    }
    return count;
  }

  private deleteMatching(
    filter: MemoryDeleteFilter,
    predicate: (r: MemoryRecord) => boolean,
  ): number {
    let count = 0;
    for (const [id, record] of Array.from(this.records.entries())) {
      if (record.userId !== filter.userId) continue;
      if (filter.projectId && record.projectId !== filter.projectId) continue;
      if (!predicate(record)) continue;
      this.records.delete(id);
      count++;
    }
    this.audit.append({
      timestamp: new Date().toISOString(),
      operation: 'DELETE',
      category: filter.category,
      scope: filter.scope,
      metadata: { userId: filter.userId, count },
    });
    return count;
  }

  private findDuplicate(input: MemoryWriteInput): MemoryRecord | undefined {
    return Array.from(this.records.values()).find(
      (r) =>
        r.userId === input.userId &&
        r.category === input.category &&
        r.scope === input.scope &&
        r.content === input.content &&
        r.projectId === input.projectId &&
        !isExpired(r),
    );
  }

  private findConflict(input: MemoryWriteInput): MemoryRecord | undefined {
    const candidate = createMemoryRecord(input, 'candidate');
    return Array.from(this.records.values()).find(
      (r) => r.userId === input.userId && recordsConflict(r, candidate) && !isExpired(r),
    );
  }
}

function recordToEntry(record: MemoryRecord): MemoryEntry {
  return {
    id: record.id,
    content: record.content,
    createdAt: record.createdAt,
    expiresAt: record.expiresAt,
    metadata: {
      category: record.category,
      scope: record.scope,
      source: record.source,
      originKind: record.originKind,
    },
  };
}

export function createInMemoryGovernedMemoryStore(
  options?: TauMemoryFoundationOptions,
): TauMemoryFoundation {
  return new InMemoryGovernedMemoryStore(options);
}
