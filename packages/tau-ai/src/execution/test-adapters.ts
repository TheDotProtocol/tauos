/**
 * Safe deterministic execution test adapters (AI-7).
 */

import { TAU_CAPABILITIES } from '../capabilities/types';
import type {
  ExecutionAdapterDefinition,
  GovernedExecutionRequest,
  GovernedExecutionResult,
} from './types';

const NOW = new Date().toISOString();

function prov(id: string) {
  return { provider: 'tau-test', version: '0.1.0', source: 'AI-7_TEST', registeredAt: NOW };
}

function ok(request: GovernedExecutionRequest, output: unknown): GovernedExecutionResult {
  return {
    status: 'SUCCESS',
    executed: true,
    requestId: request.requestId,
    executionId: `exec-${request.requestId}`,
    toolId: request.toolId,
    adapterId: request.executionAdapterId,
    output,
    timestamp: new Date().toISOString(),
  };
}

export const NOOP_EXECUTION_ADAPTER: ExecutionAdapterDefinition = {
  id: 'exec.noop',
  name: 'No-op Adapter',
  version: '0.1.0',
  supportedCapabilities: [TAU_CAPABILITIES.GENERAL_TOOL_USE],
  supportedEnvironments: ['LOCAL'],
  privacyClass: 'LOCAL',
  availability: 'AVAILABLE',
  sideEffectClass: 'NO_SIDE_EFFECT',
  provenance: prov('exec.noop'),
  healthStatus: 'HEALTHY',
  executable: true,
  async execute(request) {
    return ok(request, { noop: true });
  },
};

export const READONLY_EXECUTION_ADAPTER: ExecutionAdapterDefinition = {
  id: 'exec.readonly',
  name: 'Read-only Adapter',
  version: '0.1.0',
  supportedCapabilities: [TAU_CAPABILITIES.GENERAL_TOOL_USE],
  supportedEnvironments: ['LOCAL'],
  privacyClass: 'LOCAL',
  availability: 'AVAILABLE',
  sideEffectClass: 'READ_ONLY',
  provenance: prov('exec.readonly'),
  healthStatus: 'HEALTHY',
  executable: true,
  async execute(request) {
    const input = request.input as { query?: string };
    return ok(request, { read: input.query ?? '' });
  },
};

export const LOCAL_TEST_ADAPTER: ExecutionAdapterDefinition = {
  id: 'exec.local',
  name: 'Local Test Adapter',
  version: '0.1.0',
  supportedCapabilities: [TAU_CAPABILITIES.GENERAL_TOOL_USE],
  supportedEnvironments: ['LOCAL'],
  privacyClass: 'LOCAL',
  availability: 'AVAILABLE',
  sideEffectClass: 'LOCAL_SIDE_EFFECT',
  provenance: prov('exec.local'),
  healthStatus: 'HEALTHY',
  executable: true,
  async execute(request) {
    return ok(request, { localEffect: true, simulated: true });
  },
};

export const CONFIRMATION_EXECUTION_ADAPTER: ExecutionAdapterDefinition = {
  id: 'exec.confirmation',
  name: 'Confirmation Required Adapter',
  version: '0.1.0',
  supportedCapabilities: [TAU_CAPABILITIES.GENERAL_TOOL_USE],
  supportedEnvironments: ['LOCAL'],
  privacyClass: 'LOCAL',
  availability: 'AVAILABLE',
  sideEffectClass: 'EXTERNAL_SIDE_EFFECT',
  provenance: prov('exec.confirmation'),
  healthStatus: 'HEALTHY',
  executable: true,
  async execute(request) {
    return ok(request, { externalSimulated: true });
  },
};

export const HIGH_IMPACT_EXECUTION_ADAPTER: ExecutionAdapterDefinition = {
  id: 'exec.high-impact',
  name: 'High Impact Adapter',
  version: '0.1.0',
  supportedCapabilities: [TAU_CAPABILITIES.GENERAL_TOOL_USE],
  supportedEnvironments: ['LOCAL'],
  privacyClass: 'LOCAL',
  availability: 'AVAILABLE',
  sideEffectClass: 'HIGH_IMPACT_SIDE_EFFECT',
  provenance: prov('exec.high-impact'),
  healthStatus: 'HEALTHY',
  executable: true,
  async execute(request) {
    return ok(request, { highImpactSimulated: true });
  },
};

export const UNAVAILABLE_EXECUTION_ADAPTER: ExecutionAdapterDefinition = {
  id: 'exec.unavailable',
  name: 'Unavailable Adapter',
  version: '0.1.0',
  supportedCapabilities: [TAU_CAPABILITIES.GENERAL_TOOL_USE],
  supportedEnvironments: ['LOCAL'],
  privacyClass: 'LOCAL',
  availability: 'UNAVAILABLE',
  sideEffectClass: 'NO_SIDE_EFFECT',
  provenance: prov('exec.unavailable'),
  healthStatus: 'UNKNOWN',
  executable: false,
};

export const DISABLED_EXECUTION_ADAPTER: ExecutionAdapterDefinition = {
  id: 'exec.disabled',
  name: 'Disabled Adapter',
  version: '0.1.0',
  supportedCapabilities: [TAU_CAPABILITIES.GENERAL_TOOL_USE],
  supportedEnvironments: ['LOCAL'],
  privacyClass: 'LOCAL',
  availability: 'DISABLED',
  sideEffectClass: 'NO_SIDE_EFFECT',
  provenance: prov('exec.disabled'),
  healthStatus: 'UNKNOWN',
  executable: false,
};

export const FAILING_EXECUTION_ADAPTER: ExecutionAdapterDefinition = {
  id: 'exec.failing',
  name: 'Failing Adapter',
  version: '0.1.0',
  supportedCapabilities: [TAU_CAPABILITIES.GENERAL_TOOL_USE],
  supportedEnvironments: ['LOCAL'],
  privacyClass: 'LOCAL',
  availability: 'AVAILABLE',
  sideEffectClass: 'READ_ONLY',
  provenance: prov('exec.failing'),
  healthStatus: 'HEALTHY',
  executable: true,
  async execute(request) {
    return {
      status: 'FAILED',
      executed: false,
      requestId: request.requestId,
      toolId: request.toolId,
      adapterId: request.executionAdapterId,
      error: 'Simulated adapter failure.',
      errorClassification: 'SIMULATED_FAILURE',
      timestamp: new Date().toISOString(),
    };
  },
};

export const REMOTE_EXECUTION_ADAPTER: ExecutionAdapterDefinition = {
  id: 'exec.remote',
  name: 'Remote Adapter',
  version: '0.1.0',
  supportedCapabilities: [TAU_CAPABILITIES.GENERAL_TOOL_USE],
  supportedEnvironments: ['REMOTE'],
  privacyClass: 'REMOTE_ALLOWED',
  availability: 'AVAILABLE',
  sideEffectClass: 'LOCAL_SIDE_EFFECT',
  provenance: prov('exec.remote'),
  healthStatus: 'UNKNOWN',
  executable: true,
  async execute(request) {
    return ok(request, { remote: true });
  },
};

export const CONTAINER_EXECUTION_ADAPTER: ExecutionAdapterDefinition = {
  id: 'exec.container',
  name: 'Container Adapter',
  version: '0.1.0',
  supportedCapabilities: [TAU_CAPABILITIES.GENERAL_TOOL_USE],
  supportedEnvironments: ['CONTAINER'],
  privacyClass: 'LOCAL',
  availability: 'AVAILABLE',
  sideEffectClass: 'REVERSIBLE_SIDE_EFFECT',
  provenance: prov('exec.container'),
  healthStatus: 'HEALTHY',
  executable: true,
  async execute(request) {
    return ok(request, { container: true, simulated: true });
  },
};

export const SYSTEM_SCOPE_EXECUTION_ADAPTER: ExecutionAdapterDefinition = {
  id: 'exec.system',
  name: 'System Scope Adapter',
  version: '0.1.0',
  supportedCapabilities: [TAU_CAPABILITIES.GENERAL_TOOL_USE],
  supportedEnvironments: ['LOCAL'],
  privacyClass: 'LOCAL',
  availability: 'AVAILABLE',
  sideEffectClass: 'HIGH_IMPACT_SIDE_EFFECT',
  provenance: prov('exec.system'),
  healthStatus: 'HEALTHY',
  executable: true,
  async execute(request) {
    return ok(request, { system: true });
  },
};

export const ALL_TEST_EXECUTION_ADAPTERS: ExecutionAdapterDefinition[] = [
  NOOP_EXECUTION_ADAPTER,
  READONLY_EXECUTION_ADAPTER,
  LOCAL_TEST_ADAPTER,
  CONFIRMATION_EXECUTION_ADAPTER,
  HIGH_IMPACT_EXECUTION_ADAPTER,
  UNAVAILABLE_EXECUTION_ADAPTER,
  DISABLED_EXECUTION_ADAPTER,
  FAILING_EXECUTION_ADAPTER,
  REMOTE_EXECUTION_ADAPTER,
  CONTAINER_EXECUTION_ADAPTER,
  SYSTEM_SCOPE_EXECUTION_ADAPTER,
];

export function registerTestExecutionAdapters(registry: {
  register: (a: ExecutionAdapterDefinition) => unknown;
}): void {
  for (const adapter of ALL_TEST_EXECUTION_ADAPTERS) {
    registry.register(adapter);
  }
}
