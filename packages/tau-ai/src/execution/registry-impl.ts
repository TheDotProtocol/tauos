/**
 * Deterministic ExecutionAdapterRegistry (AI-7).
 */

import { validateExecutionAdapter } from './validation';
import type {
  ExecutionAdapterDefinition,
  ExecutionRegistrationResult,
  ExecutionRegistryFilter,
  ExecutionValidationResult,
  AdapterRuntimeEnvironment,
} from './types';
import type { CapabilityId } from '../capabilities/types';

export interface TauExecutionAdapterRegistry {
  register(adapter: ExecutionAdapterDefinition): ExecutionRegistrationResult;
  unregister(adapterId: string): boolean;
  get(adapterId: string): ExecutionAdapterDefinition | undefined;
  list(filter?: ExecutionRegistryFilter): ExecutionAdapterDefinition[];
  findByCapability(capability: CapabilityId): ExecutionAdapterDefinition[];
  findByEnvironment(environment: AdapterRuntimeEnvironment): ExecutionAdapterDefinition[];
  findAvailable(): ExecutionAdapterDefinition[];
  validate(adapter: ExecutionAdapterDefinition): ExecutionValidationResult;
}

export class DeterministicExecutionAdapterRegistry implements TauExecutionAdapterRegistry {
  private adapters = new Map<string, ExecutionAdapterDefinition>();

  register(adapter: ExecutionAdapterDefinition): ExecutionRegistrationResult {
    const validation = this.validate(adapter);
    if (!validation.valid) {
      return { success: false, error: validation.errors.join('; ') };
    }
    if (this.adapters.has(adapter.id)) {
      return { success: false, error: `Duplicate adapter id: ${adapter.id}` };
    }
    this.adapters.set(adapter.id, adapter);
    return { success: true, adapterId: adapter.id };
  }

  unregister(adapterId: string): boolean {
    return this.adapters.delete(adapterId);
  }

  get(adapterId: string): ExecutionAdapterDefinition | undefined {
    return this.adapters.get(adapterId);
  }

  list(filter?: ExecutionRegistryFilter): ExecutionAdapterDefinition[] {
    let results = Array.from(this.adapters.values());
    if (filter?.capability) {
      results = results.filter((a) => a.supportedCapabilities.includes(filter.capability!));
    }
    if (filter?.environment) {
      results = results.filter((a) => a.supportedEnvironments.includes(filter.environment!));
    }
    if (filter?.availability) {
      results = results.filter((a) => a.availability === filter.availability);
    }
    return results.sort((a, b) => a.id.localeCompare(b.id));
  }

  findByCapability(capability: CapabilityId): ExecutionAdapterDefinition[] {
    return this.list({ capability });
  }

  findByEnvironment(environment: AdapterRuntimeEnvironment): ExecutionAdapterDefinition[] {
    return this.list({ environment });
  }

  findAvailable(): ExecutionAdapterDefinition[] {
    return this.list({ availability: 'AVAILABLE' });
  }

  validate(adapter: ExecutionAdapterDefinition): ExecutionValidationResult {
    return validateExecutionAdapter(adapter);
  }
}

export function createExecutionAdapterRegistry(): TauExecutionAdapterRegistry {
  return new DeterministicExecutionAdapterRegistry();
}
