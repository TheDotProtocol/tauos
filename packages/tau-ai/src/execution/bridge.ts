/**
 * Tool → Execution boundary (AI-7).
 *
 * ToolRegistry must NOT bypass ExecutionPolicy.
 * Models must NOT call adapters directly.
 */

import type { Constitution } from '../constitution/constitution';
import type { ToolRequest, ToolExecutionResult } from '../tools/types';
import type { GovernedExecutionExecutor } from './executor';
import type { GovernedExecutionRequest, GovernedExecutionResult } from './types';
import type { GovernedToolExecutor } from '../tools/executor';

export type ToolExecutionBridgeResult = {
  toolResult: ToolExecutionResult;
  executionResult?: GovernedExecutionResult;
  executionBypassed: boolean;
};

export type ToolExecutionBridgeOptions = {
  toolExecutor: GovernedToolExecutor;
  executionExecutor: GovernedExecutionExecutor;
  constitution?: Constitution;
  /** When true, runs execution layer after tool authorization (not direct adapter). */
  useExecutionLayer: boolean;
  buildExecutionRequest: (
    toolRequest: ToolRequest,
    toolResult: ToolExecutionResult,
  ) => GovernedExecutionRequest | undefined;
};

/**
 * Orchestrates tool governance then execution governance.
 * Tool authorization alone does not grant side-effect execution.
 */
export async function executeToolWithExecutionLayer(
  toolRequest: ToolRequest,
  options: ToolExecutionBridgeOptions,
): Promise<ToolExecutionBridgeResult> {
  const toolResult = await options.toolExecutor.request(toolRequest);

  if (!toolResult.executed || toolResult.status !== 'SUCCESS') {
    return { toolResult, executionBypassed: true };
  }

  if (!options.useExecutionLayer) {
    return { toolResult, executionBypassed: true };
  }

  const execRequest = options.buildExecutionRequest(toolRequest, toolResult);
  if (!execRequest) {
    return { toolResult, executionBypassed: true };
  }

  if (!execRequest.authorization.toolAuthorized) {
    const executionResult: GovernedExecutionResult = {
      status: 'BLOCKED',
      executed: false,
      requestId: execRequest.requestId,
      toolId: execRequest.toolId,
      adapterId: execRequest.executionAdapterId,
      error: 'Tool not authorized — execution layer blocked.',
      policyDecision: 'DENY',
      timestamp: new Date().toISOString(),
    };
    return { toolResult, executionResult, executionBypassed: false };
  }

  const executionResult = await options.executionExecutor.execute(execRequest);
  return { toolResult, executionResult, executionBypassed: false };
}

/** Direct adapter invocation bypasses policy — blocked by design. */
export function assertNoDirectAdapterInvocation(): never {
  throw new Error('Direct adapter invocation bypasses execution policy.');
}
