/**
 * Execution adapter validation (AI-7).
 */

import type { ExecutionAdapterDefinition, ExecutionValidationResult } from './types';

export function validateExecutionAdapter(
  adapter: ExecutionAdapterDefinition,
): ExecutionValidationResult {
  const errors: string[] = [];

  if (!adapter.id?.trim()) errors.push('Adapter id is required.');
  if (!/^[a-z0-9][a-z0-9._-]*$/i.test(adapter.id)) {
    errors.push('Adapter id must be alphanumeric with . _ - only.');
  }
  if (!adapter.name?.trim()) errors.push('Adapter name is required.');
  if (!adapter.version?.trim()) errors.push('Adapter version is required.');
  if (!adapter.supportedCapabilities?.length) errors.push('supportedCapabilities required.');
  if (!adapter.supportedEnvironments?.length) errors.push('supportedEnvironments required.');
  if (!adapter.provenance?.provider) errors.push('provenance.provider required.');
  if (adapter.executable && typeof adapter.execute !== 'function') {
    errors.push('Executable adapters must provide execute().');
  }
  if (adapter.availability === 'UNKNOWN') {
    errors.push('UNKNOWN availability cannot be registered as executable adapter.');
  }

  return { valid: errors.length === 0, errors };
}

export function validateAdapterInput(
  adapter: ExecutionAdapterDefinition,
  input: unknown,
): ExecutionValidationResult {
  if (adapter.validate) return adapter.validate(input);
  if (input === undefined || input === null) {
    return { valid: false, errors: ['Input is required.'] };
  }
  return { valid: true, errors: [] };
}
