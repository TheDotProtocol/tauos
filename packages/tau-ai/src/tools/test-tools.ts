/**
 * Safe deterministic test tools (AI-6).
 *
 * No real email, banking, filesystem destruction, or external mutations.
 */

import { TAU_CAPABILITIES } from '../capabilities/types';
import { deriveConfirmationPolicy } from './risk';
import type { TauToolDefinition, ToolExecutionResult } from './types';

const NOW = new Date().toISOString();

function baseProvenance(id: string) {
  return {
    provider: 'tau-test',
    version: '0.1.0',
    source: 'AI-6_TEST',
    registeredAt: NOW,
  };
}

function success(requestId: string, toolId: string, output: unknown): ToolExecutionResult {
  return {
    status: 'SUCCESS',
    toolId,
    requestId,
    executed: true,
    output,
  };
}

export const ECHO_TEST_TOOL: TauToolDefinition = {
  id: 'test.echo',
  name: 'Echo Test',
  description: 'Read-only echo for governance testing.',
  version: '0.1.0',
  capability: TAU_CAPABILITIES.GENERAL_TOOL_USE,
  inputSchema: { type: 'object', properties: { message: { type: 'string' } }, required: ['message'] },
  outputSchema: { type: 'object', properties: { echo: { type: 'string' } } },
  permissions: [{ scope: 'read', resource: 'test:echo' }],
  requiredScopes: ['USER'],
  privacyClass: 'LOCAL',
  riskClass: 'READ_ONLY',
  sideEffectClass: 'NONE',
  confirmationPolicy: deriveConfirmationPolicy('READ_ONLY'),
  availability: 'AVAILABLE',
  provenance: baseProvenance('test.echo'),
  executable: true,
  async execute(input, _ctx) {
    const msg = (input as { message?: string })?.message ?? '';
    return success('inline', 'test.echo', { echo: msg });
  },
};

export const CALCULATOR_TEST_TOOL: TauToolDefinition = {
  id: 'test.calculator',
  name: 'Calculator Test',
  description: 'Deterministic calculator for low-impact testing.',
  version: '0.1.0',
  capability: TAU_CAPABILITIES.CODE,
  inputSchema: {
    type: 'object',
    properties: { a: { type: 'number' }, b: { type: 'number' }, op: { type: 'string' } },
    required: ['a', 'b', 'op'],
  },
  outputSchema: { type: 'object', properties: { result: { type: 'number' } } },
  permissions: [{ scope: 'execute', resource: 'test:calc' }],
  requiredScopes: ['USER'],
  privacyClass: 'LOCAL',
  riskClass: 'LOW_IMPACT',
  sideEffectClass: 'LOCAL',
  confirmationPolicy: deriveConfirmationPolicy('LOW_IMPACT'),
  availability: 'AVAILABLE',
  provenance: baseProvenance('test.calculator'),
  executable: true,
  async execute(input, _ctx) {
    const { a, b, op } = input as { a: number; b: number; op: string };
    let result = 0;
    if (op === '+') result = a + b;
    else if (op === '-') result = a - b;
    else if (op === '*') result = a * b;
    else if (op === '/' && b !== 0) result = a / b;
    else return { status: 'FAILURE', toolId: 'test.calculator', requestId: 'inline', executed: false, error: 'Invalid op' };
    return success('inline', 'test.calculator', { result });
  },
};

export const UNAVAILABLE_TEST_TOOL: TauToolDefinition = {
  id: 'test.unavailable',
  name: 'Unavailable Test',
  description: 'Tool marked unavailable.',
  version: '0.1.0',
  capability: TAU_CAPABILITIES.GENERAL_TOOL_USE,
  inputSchema: { type: 'object' },
  outputSchema: { type: 'object' },
  permissions: [],
  requiredScopes: ['USER'],
  privacyClass: 'LOCAL',
  riskClass: 'READ_ONLY',
  sideEffectClass: 'NONE',
  confirmationPolicy: deriveConfirmationPolicy('READ_ONLY'),
  availability: 'UNAVAILABLE',
  provenance: baseProvenance('test.unavailable'),
  executable: false,
};

export const DISABLED_TEST_TOOL: TauToolDefinition = {
  id: 'test.disabled',
  name: 'Disabled Test',
  description: 'Tool marked disabled.',
  version: '0.1.0',
  capability: TAU_CAPABILITIES.GENERAL_TOOL_USE,
  inputSchema: { type: 'object' },
  outputSchema: { type: 'object' },
  permissions: [],
  requiredScopes: ['USER'],
  privacyClass: 'LOCAL',
  riskClass: 'READ_ONLY',
  sideEffectClass: 'NONE',
  confirmationPolicy: deriveConfirmationPolicy('READ_ONLY'),
  availability: 'DISABLED',
  provenance: baseProvenance('test.disabled'),
  executable: false,
};

export const CONFIRMATION_TEST_TOOL: TauToolDefinition = {
  id: 'test.confirmation',
  name: 'Confirmation Test',
  description: 'Requires explicit user confirmation.',
  version: '0.1.0',
  capability: TAU_CAPABILITIES.GENERAL_TOOL_USE,
  inputSchema: { type: 'object', properties: { action: { type: 'string' } }, required: ['action'] },
  outputSchema: { type: 'object' },
  permissions: [{ scope: 'execute', resource: 'test:confirm' }],
  requiredScopes: ['USER'],
  privacyClass: 'LOCAL',
  riskClass: 'EXTERNAL_SIDE_EFFECT',
  sideEffectClass: 'EXTERNAL',
  confirmationPolicy: deriveConfirmationPolicy('EXTERNAL_SIDE_EFFECT'),
  availability: 'AVAILABLE',
  provenance: baseProvenance('test.confirmation'),
  executable: true,
  async execute(input, _ctx) {
    return success('inline', 'test.confirmation', { action: (input as { action: string }).action, simulated: true });
  },
};

export const HIGH_IMPACT_TEST_TOOL: TauToolDefinition = {
  id: 'test.high-impact',
  name: 'High Impact Test',
  description: 'High-impact action requiring confirmation and authorization.',
  version: '0.1.0',
  capability: TAU_CAPABILITIES.GENERAL_TOOL_USE,
  inputSchema: { type: 'object', properties: { target: { type: 'string' } }, required: ['target'] },
  outputSchema: { type: 'object' },
  permissions: [{ scope: 'execute', resource: 'test:high-impact' }],
  requiredScopes: ['USER'],
  privacyClass: 'LOCAL',
  riskClass: 'HIGH_IMPACT',
  sideEffectClass: 'IRREVERSIBLE',
  confirmationPolicy: deriveConfirmationPolicy('HIGH_IMPACT'),
  availability: 'AVAILABLE',
  provenance: baseProvenance('test.high-impact'),
  executable: true,
  async execute(input, _ctx) {
    return success('inline', 'test.high-impact', { target: (input as { target: string }).target, simulated: true });
  },
};

export const REMOTE_TEST_TOOL: TauToolDefinition = {
  id: 'test.remote',
  name: 'Remote Test',
  description: 'Tool requiring remote privacy class — blocked under LOCAL_ONLY.',
  version: '0.1.0',
  capability: TAU_CAPABILITIES.GENERAL_TOOL_USE,
  inputSchema: { type: 'object' },
  outputSchema: { type: 'object' },
  permissions: [{ scope: 'network', resource: 'test:remote' }],
  requiredScopes: ['USER'],
  privacyClass: 'REMOTE_ALLOWED',
  riskClass: 'LOW_IMPACT',
  sideEffectClass: 'EXTERNAL',
  confirmationPolicy: deriveConfirmationPolicy('LOW_IMPACT'),
  availability: 'AVAILABLE',
  provenance: baseProvenance('test.remote'),
  executable: true,
  async execute() {
    return success('inline', 'test.remote', { ok: true });
  },
};

export const SYSTEM_SCOPE_TEST_TOOL: TauToolDefinition = {
  id: 'test.system-scope',
  name: 'System Scope Test',
  description: 'Tool requiring SYSTEM scope.',
  version: '0.1.0',
  capability: TAU_CAPABILITIES.GENERAL_TOOL_USE,
  inputSchema: { type: 'object' },
  outputSchema: { type: 'object' },
  permissions: [{ scope: 'execute', resource: 'system:test' }],
  requiredScopes: ['SYSTEM'],
  privacyClass: 'LOCAL',
  riskClass: 'HIGH_IMPACT',
  sideEffectClass: 'IRREVERSIBLE',
  confirmationPolicy: deriveConfirmationPolicy('HIGH_IMPACT'),
  availability: 'AVAILABLE',
  provenance: baseProvenance('test.system-scope'),
  executable: true,
  async execute() {
    return success('inline', 'test.system-scope', { ok: true });
  },
};

export const ALL_TEST_TOOLS: TauToolDefinition[] = [
  ECHO_TEST_TOOL,
  CALCULATOR_TEST_TOOL,
  UNAVAILABLE_TEST_TOOL,
  DISABLED_TEST_TOOL,
  CONFIRMATION_TEST_TOOL,
  HIGH_IMPACT_TEST_TOOL,
  REMOTE_TEST_TOOL,
  SYSTEM_SCOPE_TEST_TOOL,
];

export function registerTestTools(registry: { register: (t: TauToolDefinition) => unknown }): void {
  for (const tool of ALL_TEST_TOOLS) {
    registry.register(tool);
  }
}
