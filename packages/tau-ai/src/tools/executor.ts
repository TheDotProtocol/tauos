/**
 * Governed tool lifecycle executor (AI-6).
 *
 * DISCOVER → DESCRIBE → REQUEST → AUTHORIZE → CONFIRM → EXECUTE → VALIDATE → AUDIT
 */

import type { Constitution } from '../constitution/constitution';
import { createToolAuditLog, type ToolAuditLog } from './audit-log';
import { evaluateToolRequestGovernance } from './governance';
import type { TauToolRegistry } from './registry-impl';
import { validateToolInput } from './validation';
import type {
  TauToolDefinition,
  ToolAuditEntry,
  ToolExecutionResult,
  ToolRequest,
} from './types';
import { TAU_TOOL_FOUNDATION_VERSION } from './types';

export type GovernedToolExecutorOptions = {
  registry: TauToolRegistry;
  constitution?: Constitution;
  auditLog?: ToolAuditLog;
};

export class GovernedToolExecutor {
  private registry: TauToolRegistry;
  private constitution?: Constitution;
  private audit: ToolAuditLog;

  constructor(options: GovernedToolExecutorOptions) {
    this.registry = options.registry;
    this.constitution = options.constitution;
    this.audit = options.auditLog ?? createToolAuditLog();
  }

  discover(): TauToolDefinition[] {
    return this.registry.list();
  }

  describe(toolId: string): TauToolDefinition | undefined {
    return this.registry.get(toolId);
  }

  async request(request: ToolRequest): Promise<ToolExecutionResult> {
    const tool = this.registry.get(request.toolId);
    if (!tool) {
      return this.finish(request, undefined, {
        status: 'BLOCKED',
        executed: false,
        error: `Tool not registered: ${request.toolId}`,
        policyResult: 'BLOCK',
      }, 'REQUEST');
    }

    const inputValidation = validateToolInput(tool, request.input);
    if (!inputValidation.valid) {
      return this.finish(request, tool, {
        status: 'FAILURE',
        executed: false,
        error: inputValidation.errors.join('; '),
        policyResult: 'BLOCK',
      }, 'VALIDATE');
    }

    const governance = await evaluateToolRequestGovernance(tool, request, {
      constitution: this.constitution,
    });

    if (!governance.allowed) {
      return this.finish(request, tool, {
        status: governance.status === 'SUCCESS' ? 'BLOCKED' : governance.status,
        executed: false,
        error: governance.reason,
        policyResult: governance.policyResult,
        constitutionVersion: governance.constitutionVersion,
      }, governance.confirmationRequired ? 'CONFIRM' : 'AUTHORIZE');
    }

    if (!tool.executable || !tool.execute) {
      return this.finish(request, tool, {
        status: 'NOT_CONFIGURED',
        executed: false,
        error: 'Tool is not executable.',
        policyResult: 'PASS',
      }, 'EXECUTE');
    }

    try {
      const output = await tool.execute(request.input, {
        userId: request.userId,
        appId: request.appId,
        userConfirmed: request.confirmation.granted,
      });
      return this.finish(request, tool, {
        status: output.status,
        executed: output.status === 'SUCCESS',
        output: output.output,
        error: output.error,
        policyResult: governance.policyResult,
        constitutionVersion: governance.constitutionVersion,
        toolVersion: tool.version,
      }, 'EXECUTE');
    } catch (err) {
      return this.finish(request, tool, {
        status: 'FAILURE',
        executed: false,
        error: err instanceof Error ? err.message : 'Tool execution failed.',
        policyResult: governance.policyResult,
        constitutionVersion: governance.constitutionVersion,
      }, 'EXECUTE');
    }
  }

  getAuditLog(): ToolAuditEntry[] {
    return this.audit.list();
  }

  private finish(
    request: ToolRequest,
    tool: TauToolDefinition | undefined,
    result: Partial<ToolExecutionResult>,
    stage: ToolAuditEntry['lifecycleStage'],
  ): ToolExecutionResult {
    const finalResult: ToolExecutionResult = {
      status: result.status ?? 'FAILURE',
      toolId: request.toolId,
      requestId: request.requestId,
      executed: result.executed ?? false,
      output: result.output,
      error: result.error,
      policyResult: result.policyResult,
      constitutionVersion: result.constitutionVersion,
      toolVersion: result.toolVersion ?? tool?.version,
    };

    this.audit.append({
      timestamp: new Date().toISOString(),
      requestId: request.requestId,
      toolId: request.toolId,
      toolVersion: tool?.version ?? 'UNKNOWN',
      constitutionVersion: finalResult.constitutionVersion,
      policyResult: finalResult.policyResult,
      authorizationResult: request.authorization.granted ? 'GRANTED' : 'DENIED',
      confirmationResult: resolveConfirmationAudit(request, finalResult.status),
      executionStatus: finalResult.status,
      lifecycleStage: stage,
      metadata: {
        foundationVersion: TAU_TOOL_FOUNDATION_VERSION,
        capability: request.capability,
        scope: request.scope,
        executed: finalResult.executed ? 1 : 0,
      },
    });

    return finalResult;
  }
}

function resolveConfirmationAudit(
  request: ToolRequest,
  status: ToolExecutionResult['status'],
): ToolAuditEntry['confirmationResult'] {
  if (request.confirmation.denied) return 'DENIED';
  if (status === 'REQUIRES_CONFIRMATION') return 'PENDING';
  if (request.confirmation.granted) return 'GRANTED';
  if (!request.confirmation.required) return 'NOT_REQUIRED';
  return 'PENDING';
}

export function createGovernedToolExecutor(
  options: GovernedToolExecutorOptions,
): GovernedToolExecutor {
  return new GovernedToolExecutor(options);
}
