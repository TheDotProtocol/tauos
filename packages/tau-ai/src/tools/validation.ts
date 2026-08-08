/**
 * Tool definition validation (AI-6).
 */

import type { TauToolDefinition, ToolValidationResult } from './types';

export function validateToolDefinition(tool: TauToolDefinition): ToolValidationResult {
  const errors: string[] = [];

  if (!tool.id || typeof tool.id !== 'string' || tool.id.trim().length === 0) {
    errors.push('Tool id is required.');
  }
  if (!/^[a-z0-9][a-z0-9._-]*$/i.test(tool.id)) {
    errors.push('Tool id must be alphanumeric with . _ - only.');
  }
  if (!tool.name?.trim()) errors.push('Tool name is required.');
  if (!tool.description?.trim()) errors.push('Tool description is required.');
  if (!tool.version?.trim()) errors.push('Tool version is required.');
  if (!tool.capability) errors.push('Tool capability is required.');
  if (!tool.inputSchema?.type) errors.push('Tool inputSchema.type is required.');
  if (!tool.outputSchema?.type) errors.push('Tool outputSchema.type is required.');
  if (!tool.requiredScopes?.length) errors.push('Tool requiredScopes must not be empty.');
  if (!tool.provenance?.provider) errors.push('Tool provenance.provider is required.');
  if (tool.executable && typeof tool.execute !== 'function') {
    errors.push('Executable tools must provide execute().');
  }
  if (!tool.executable && tool.execute) {
    errors.push('Non-executable tools must not provide execute().');
  }

  return { valid: errors.length === 0, errors };
}

export function validateToolInput(
  tool: TauToolDefinition,
  input: unknown,
): ToolValidationResult {
  const errors: string[] = [];
  const schema = tool.inputSchema;

  if (schema.type === 'object' && input !== null && typeof input === 'object') {
    const obj = input as Record<string, unknown>;
    for (const req of schema.required ?? []) {
      if (!(req in obj)) errors.push(`Missing required input field: ${req}`);
    }
  } else if (schema.type === 'object' && (input === null || typeof input !== 'object')) {
    errors.push('Input must be an object.');
  }

  return { valid: errors.length === 0, errors };
}
