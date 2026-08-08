/**
 * Deterministic Tool Registry (AI-6).
 */

import { validateToolDefinition } from './validation';
import type {
  TauToolDefinition,
  ToolRegistrationResult,
  ToolRegistryFilter,
  ToolValidationResult,
} from './types';

export interface TauToolRegistry {
  register(tool: TauToolDefinition): ToolRegistrationResult;
  unregister(toolId: string): boolean;
  get(toolId: string): TauToolDefinition | undefined;
  list(filter?: ToolRegistryFilter): TauToolDefinition[];
  findByCapability(capability: string): TauToolDefinition[];
  findByScope(scope: TauToolDefinition['requiredScopes'][number]): TauToolDefinition[];
  findAvailable(): TauToolDefinition[];
  validate(tool: TauToolDefinition): ToolValidationResult;
}

export class DeterministicToolRegistry implements TauToolRegistry {
  private tools = new Map<string, TauToolDefinition>();

  register(tool: TauToolDefinition): ToolRegistrationResult {
    const validation = this.validate(tool);
    if (!validation.valid) {
      return { success: false, error: validation.errors.join('; ') };
    }
    if (this.tools.has(tool.id)) {
      return { success: false, error: `Duplicate tool id: ${tool.id}` };
    }
    this.tools.set(tool.id, tool);
    return { success: true, toolId: tool.id };
  }

  unregister(toolId: string): boolean {
    return this.tools.delete(toolId);
  }

  get(toolId: string): TauToolDefinition | undefined {
    return this.tools.get(toolId);
  }

  list(filter?: ToolRegistryFilter): TauToolDefinition[] {
    let results = Array.from(this.tools.values());
    if (filter?.capability) {
      results = results.filter((t) => t.capability === filter.capability);
    }
    if (filter?.scope) {
      results = results.filter((t) => t.requiredScopes.includes(filter.scope!));
    }
    if (filter?.availability) {
      results = results.filter((t) => t.availability === filter.availability);
    }
    return results.sort((a, b) => a.id.localeCompare(b.id));
  }

  findByCapability(capability: string): TauToolDefinition[] {
    return this.list({ capability });
  }

  findByScope(scope: TauToolDefinition['requiredScopes'][number]): TauToolDefinition[] {
    return this.list({ scope });
  }

  findAvailable(): TauToolDefinition[] {
    return this.list({ availability: 'AVAILABLE' });
  }

  validate(tool: TauToolDefinition): ToolValidationResult {
    return validateToolDefinition(tool);
  }
}

export function createToolRegistry(): TauToolRegistry {
  return new DeterministicToolRegistry();
}
