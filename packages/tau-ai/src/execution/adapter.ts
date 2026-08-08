/**
 * Execution adapter contract — AI-1 scaffold, AI-7 foundation.
 *
 * Approved actions execute through pluggable adapters.
 * OpenClaw may become one optional adapter; it must NOT be a Tau AI dependency.
 */

import type { TauAIAppId, TauAIUserId } from '../types/context';

/** Legacy AI-1 execution request — see GovernedExecutionRequest in ./types */
export type LegacyExecutionRequest = {
  action: string;
  payload: unknown;
  metadata?: Record<string, unknown>;
};

/** Legacy AI-1 execution result — see GovernedExecutionResult in ./types */
export type LegacyExecutionResult = {
  success: boolean;
  output?: unknown;
  error?: string;
  metadata?: Record<string, unknown>;
};

export type LegacyExecutionContext = {
  userId?: TauAIUserId;
  appId?: TauAIAppId;
  threadId?: string;
  signal?: AbortSignal;
};

/** AI-1 aliases for backward compatibility */
export type ExecutionRequest = LegacyExecutionRequest;
export type ExecutionResult = LegacyExecutionResult;
export type ExecutionContext = LegacyExecutionContext;

/**
 * AI-1 execution adapter — superseded by ExecutionAdapterDefinition (AI-7).
 */
export interface ExecutionAdapter {
  readonly id: string;
  readonly label: string;
  canExecute(request: LegacyExecutionRequest): boolean;
  execute(
    request: LegacyExecutionRequest,
    context: LegacyExecutionContext,
  ): Promise<LegacyExecutionResult>;
}

/** AI-1 registry — see TauExecutionAdapterRegistry in ./registry-impl */
export interface ExecutionAdapterRegistry {
  register(adapter: ExecutionAdapter): void;
  get(id: string): ExecutionAdapter | undefined;
  list(): ExecutionAdapter[];
  findCapable(request: LegacyExecutionRequest): ExecutionAdapter | undefined;
}
