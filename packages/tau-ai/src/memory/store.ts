/**
 * Memory store contracts — AI-1 scaffold, AI-5 foundation implementation.
 *
 * Constitution governs what may be stored; memory implementations govern how.
 */

import type { ChatMessage, TauAIAppId, TauAIThreadId, TauAIUserId } from '../types';

export type MemoryEntry = {
  id: string;
  content: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  expiresAt?: string;
};

export type UserPreference = {
  key: string;
  value: unknown;
  updatedAt: string;
};

export type KnowledgeQuery = {
  query: string;
  limit?: number;
  filters?: Record<string, unknown>;
};

export type KnowledgeHit = {
  id: string;
  content: string;
  score?: number;
  source?: string;
  metadata?: Record<string, unknown>;
};

/** Single-thread conversation context (session scope). */
export interface ConversationStore {
  append(threadId: TauAIThreadId, message: ChatMessage): Promise<void>;
  getThread(threadId: TauAIThreadId, limit?: number): Promise<ChatMessage[]>;
  clearThread?(threadId: TauAIThreadId): Promise<void>;
}

/** Recent, ephemeral user/app context (hours–days). */
export interface ShortTermMemory {
  remember(
    userId: TauAIUserId,
    appId: TauAIAppId,
    entry: MemoryEntry,
  ): Promise<void>;
  recall(
    userId: TauAIUserId,
    appId: TauAIAppId,
    query?: string,
    limit?: number,
  ): Promise<MemoryEntry[]>;
  purgeExpired?(userId: TauAIUserId, appId?: TauAIAppId): Promise<void>;
}

/** Durable user memory (preferences, learned facts). */
export interface LongTermMemory {
  store(userId: TauAIUserId, entry: MemoryEntry): Promise<void>;
  recall(userId: TauAIUserId, query: string, limit?: number): Promise<MemoryEntry[]>;
  forget?(userId: TauAIUserId, entryId: string): Promise<void>;
}

/** Persistent user settings relevant to Tau AI behaviour. */
export interface UserPreferencesStore {
  get(userId: TauAIUserId, key: string): Promise<UserPreference | undefined>;
  set(userId: TauAIUserId, key: string, value: unknown): Promise<void>;
  list?(userId: TauAIUserId): Promise<UserPreference[]>;
}

/** Indexed knowledge / RAG retrieval (future semantic adapter). */
export interface KnowledgeRetrieval {
  search(query: KnowledgeQuery): Promise<KnowledgeHit[]>;
  index?(content: KnowledgeHit): Promise<void>;
}

/**
 * Composite memory facade consumed by IntelligenceService.
 * Implementations may compose adapters (e.g. TauMail Postgres adapter in AI-11).
 */
export interface MemoryStore {
  conversation: ConversationStore;
  shortTerm: ShortTermMemory;
  longTerm: LongTermMemory;
  preferences: UserPreferencesStore;
  knowledge: KnowledgeRetrieval;
}

export type MemoryRetentionContext = {
  userId: TauAIUserId;
  appId?: TauAIAppId;
  entry: MemoryEntry;
};

/** Hooks for constitution-aligned retention rules (AI-5). */
export interface MemoryPolicy {
  mayRetain(context: MemoryRetentionContext): boolean | Promise<boolean>;
  mayExport(userId: TauAIUserId): boolean | Promise<boolean>;
}
