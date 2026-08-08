/**
 * Tool registry and tool contract — AI-1 scaffold, AI-6 foundation.
 */

import type { JSONSchema } from '../types/json-schema';
import type { TauAIAppId, TauAIUserId } from '../types/context';

export type ToolPermissionScope = 'read' | 'write' | 'execute' | 'network';

export type ToolPermission = {
  scope: ToolPermissionScope;
  /** e.g. 'taumail:inbox', 'filesystem:workspace' */
  resource: string;
};

export type ToolExecutionPolicy = {
  requiresConfirmation?: boolean;
  timeoutMs?: number;
  offlineCapable?: boolean;
  retryPolicy?: 'none' | 'once' | 'bounded';
};

/** Legacy execution context alias — prefer ToolExecutionContext from ./types */
export type LegacyToolExecutionContext = {
  userId?: TauAIUserId;
  appId?: TauAIAppId;
  threadId?: string;
  signal?: AbortSignal;
};

/** Legacy result shape — see ToolExecutionResult in ./types for AI-6 */
export type LegacyToolResult = {
  success: boolean;
  output?: unknown;
  error?: string;
  metadata?: Record<string, unknown>;
};

/**
 * AI-1 tool interface — superseded by TauToolDefinition (AI-6).
 * Retained for backward-compatible contract checks.
 */
export interface TauTool {
  readonly name: string;
  readonly description: string;
  readonly inputSchema: JSONSchema;
  readonly outputSchema: JSONSchema;
  readonly permissions: ToolPermission[];
  readonly executionPolicy: ToolExecutionPolicy;
  execute(input: unknown, context: LegacyToolExecutionContext): Promise<LegacyToolResult>;
}

export type ToolFilter = {
  appId?: TauAIAppId;
  permissionScope?: ToolPermissionScope;
  resourcePrefix?: string;
};

/** AI-1 registry interface — see TauToolRegistry in ./registry-impl for AI-6 */
export interface ToolRegistry {
  register(tool: TauTool): void;
  unregister(name: string): void;
  get(name: string): TauTool | undefined;
  list(filter?: ToolFilter): TauTool[];
}

/** Re-export legacy result as ToolResult for AI-1 exports */
export type ToolResult = LegacyToolResult;
