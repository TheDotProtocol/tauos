/**
 * Tau Memory structured types (AI-5).
 */

import type { PrivacyMode } from '../routing/routing-types';
import type { TauAIAppId, TauAIUserId } from '../types/context';

export const TAU_MEMORY_FOUNDATION_VERSION = 'tau-memory-v0.1';

export type MemoryCategory =
  | 'CONVERSATION_MEMORY'
  | 'PREFERENCE_MEMORY'
  | 'PROFILE_MEMORY'
  | 'KNOWLEDGE_MEMORY'
  | 'TASK_MEMORY'
  | 'SYSTEM_CONTEXT';

export type MemorySource =
  | 'USER_EXPLICIT'
  | 'USER_CONVERSATION'
  | 'USER_DOCUMENT'
  | 'SYSTEM'
  | 'TOOL'
  | 'EXTERNAL';

export type MemoryOriginKind = 'EXPLICIT' | 'INFERRED';

export type RetentionPolicy =
  | 'SESSION'
  | 'SHORT_TERM'
  | 'LONG_TERM'
  | 'UNTIL_EXPIRY'
  | 'USER_CONTROLLED';

export type MemoryScope = 'SESSION' | 'USER' | 'PROJECT' | 'PRODUCT' | 'SYSTEM';

export type MemoryPrivacyClass = 'LOCAL' | 'REMOTE_ALLOWED' | 'UNKNOWN';

export type ConsentState = 'GRANTED' | 'PENDING' | 'DENIED' | 'NOT_REQUIRED';

export type MemoryWriteOutcome =
  | 'STORED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'DUPLICATE'
  | 'REQUIRES_CONFIRMATION';

export type MemoryProvenance = {
  source: MemorySource;
  originKind: MemoryOriginKind;
  creator?: string;
  recordedAt: string;
  license?: string | 'UNKNOWN';
  permissions?: string | 'UNKNOWN';
  version: number;
};

export type MemoryRecord = {
  id: string;
  category: MemoryCategory;
  content: string;
  reference?: string;
  source: MemorySource;
  originKind: MemoryOriginKind;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  importance?: number;
  confidence?: number | 'UNKNOWN';
  provenance: MemoryProvenance;
  scope: MemoryScope;
  privacyClass: MemoryPrivacyClass;
  retentionPolicy: RetentionPolicy;
  consentState: ConsentState;
  tags?: string[];
  version: number;
  userId?: TauAIUserId;
  projectId?: string;
  productId?: TauAIAppId;
  sessionId?: string;
};

export type MemoryWriteInput = {
  category: MemoryCategory;
  content: string;
  reference?: string;
  source: MemorySource;
  originKind: MemoryOriginKind;
  expiresAt?: string;
  importance?: number;
  confidence?: number | 'UNKNOWN';
  scope: MemoryScope;
  privacyClass?: MemoryPrivacyClass;
  retentionPolicy: RetentionPolicy;
  consentState?: ConsentState;
  tags?: string[];
  userId?: TauAIUserId;
  projectId?: string;
  productId?: TauAIAppId;
  sessionId?: string;
  id?: string;
  /** Test/metadata hook for constitution conflict simulation. */
  metadataConflictsWithPrivacy?: boolean;
  metadataConflictsWithSecurity?: boolean;
};

export type MemoryWriteRequest = {
  input: MemoryWriteInput;
  privacyMode?: PrivacyMode;
  /** Current explicit user instruction — outranks stored memory for conflict resolution. */
  currentExplicitInstruction?: string;
};

export type MemoryWriteResult = {
  outcome: MemoryWriteOutcome;
  recordId?: string;
  reason?: string;
  policyResult?: 'PASS' | 'WARN' | 'BLOCK';
  constitutionVersion?: string;
  version?: number;
};

export type MemoryUpdateInput = {
  content?: string;
  reference?: string;
  expiresAt?: string;
  importance?: number;
  consentState?: ConsentState;
  tags?: string[];
  source?: MemorySource;
  originKind?: MemoryOriginKind;
};

export type MemoryQueryFilter = {
  userId?: TauAIUserId;
  projectId?: string;
  productId?: TauAIAppId;
  sessionId?: string;
  category?: MemoryCategory;
  scope?: MemoryScope;
  tags?: string[];
  includeExpired?: boolean;
  limit?: number;
};

export type MemoryRetrievalContext = {
  userId?: TauAIUserId;
  projectId?: string;
  productId?: TauAIAppId;
  sessionId?: string;
  query?: string;
  categories?: MemoryCategory[];
  privacyMode?: PrivacyMode;
  limit?: number;
};

export type MemoryContextItem = {
  id: string;
  category: MemoryCategory;
  content: string;
  scope: MemoryScope;
  privacyClass: MemoryPrivacyClass;
  provenance: MemoryProvenance;
  relevanceScore: number;
};

export type MemoryContext = {
  memories: MemoryContextItem[];
  scope: MemoryScope | 'MIXED';
  privacyClass: MemoryPrivacyClass | 'MIXED';
  provenance: MemoryProvenance[];
  retrievalPolicy: 'DETERMINISTIC_KEYWORD' | 'SEMANTIC_FUTURE';
  foundationVersion: string;
};

export type MemoryAuditEntry = {
  timestamp: string;
  operation: 'WRITE' | 'READ' | 'UPDATE' | 'DELETE' | 'CLEAR';
  memoryId?: string;
  category?: MemoryCategory;
  scope?: MemoryScope;
  outcome?: MemoryWriteOutcome | 'FOUND' | 'NOT_FOUND' | 'EXPIRED';
  policyResult?: 'PASS' | 'WARN' | 'BLOCK';
  /** Never contains memory content. */
  metadata?: Record<string, string | number | boolean>;
};

export type MemoryDeleteFilter = {
  userId: TauAIUserId;
  category?: MemoryCategory;
  scope?: MemoryScope;
  projectId?: string;
};
