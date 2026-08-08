/**
 * Tool scope model (AI-6).
 *
 * No automatic scope escalation — requested scope must be explicitly authorized.
 */

import type { ToolScope } from './types';

const SCOPE_RANK: Record<ToolScope, number> = {
  USER: 1,
  PROJECT: 2,
  PRODUCT: 3,
  SYSTEM: 4,
};

export function scopeRank(scope: ToolScope): number {
  return SCOPE_RANK[scope];
}

/** Returns true if requested scope is within authorized scopes (no escalation). */
export function isScopeAuthorized(
  requested: ToolScope,
  authorizedScopes: ToolScope[],
): boolean {
  return authorizedScopes.includes(requested);
}

/** Returns true if tool supports the requested scope. */
export function toolSupportsScope(
  requested: ToolScope,
  toolRequiredScopes: ToolScope[],
): boolean {
  return toolRequiredScopes.includes(requested);
}

/** Block silent escalation to SYSTEM scope. */
export function isScopeEscalationAttempt(
  requested: ToolScope,
  authorizedScopes: ToolScope[],
): boolean {
  if (requested !== 'SYSTEM') return false;
  return !authorizedScopes.includes('SYSTEM');
}

export const TOOL_SCOPE_HIERARCHY: ToolScope[] = ['USER', 'PROJECT', 'PRODUCT', 'SYSTEM'];
