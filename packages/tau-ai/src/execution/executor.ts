/**
 * Governed execution executor (AI-7).
 *
 * Tool authorization → ExecutionPolicy → ExecutionAdapter → Audit
 */

import type { Constitution } from '../constitution/constitution';
import { createExecutionAuditLog, type ExecutionAuditLog } from './audit-log';
import { evaluateExecutionPolicy } from './policy';
import type { TauExecutionAdapterRegistry } from './registry-impl';
import { validateAdapterInput } from './validation';
import type {
  ExecutionAdapterDefinition,
  ExecutionAuditEntry,
  GovernedExecutionRequest,
  GovernedExecutionResult,
} from './types';
import { TAU_EXECUTION_FOUNDATION_VERSION } from './types';

export type GovernedExecutionExecutorOptions = {
  registry: TauExecutionAdapterRegistry;
  constitution?: Constitution;
  auditLog?: ExecutionAuditLog;
};

function generateExecutionId(): string {
  return `exec-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export class GovernedExecutionExecutor {
  private registry: TauExecutionAdapterRegistry;
  private constitution?: Constitution;
  private audit: ExecutionAuditLog;

  constructor(options: GovernedExecutionExecutorOptions) {
    this.registry = options.registry;
    this.constitution = options.constitution;
    this.audit = options.auditLog ?? createExecutionAuditLog();
  }

  listAdapters(): ExecutionAdapterDefinition[] {
    return this.registry.list();
  }

  describeAdapter(adapterId: string): ExecutionAdapterDefinition | undefined {
    return this.registry.get(adapterId);
  }

  async execute(request: GovernedExecutionRequest): Promise<GovernedExecutionResult> {
    const adapter = this.registry.get(request.executionAdapterId);
    if (!adapter) {
      return this.finish(request, undefined, {
        status: 'BLOCKED',
        executed: false,
        error: `Adapter not registered: ${request.executionAdapterId}`,
        policyDecision: 'INVALID',
        errorClassification: 'ADAPTER_NOT_FOUND',
      });
    }

    const inputValidation = validateAdapterInput(adapter, request.input);
    if (!inputValidation.valid) {
      return this.finish(request, adapter, {
        status: 'INVALID',
        executed: false,
        error: inputValidation.errors.join('; '),
        policyDecision: 'INVALID',
        errorClassification: 'INPUT_INVALID',
      });
    }

    const policy = await evaluateExecutionPolicy(adapter, request, {
      constitution: this.constitution,
    });

    if (!policy.allowed) {
      const status =
        policy.decision === 'REQUIRES_CONFIRMATION'
          ? 'REQUIRES_CONFIRMATION'
          : policy.decision === 'UNAVAILABLE'
            ? 'UNAVAILABLE'
            : policy.decision === 'NOT_CONFIGURED'
              ? 'NOT_CONFIGURED'
              : policy.decision === 'INVALID'
                ? 'INVALID'
                : 'BLOCKED';
      return this.finish(request, adapter, {
        status,
        executed: false,
        error: policy.reason,
        policyDecision: policy.decision,
        constitutionVersion: policy.constitutionVersion,
        errorClassification: 'POLICY_DENIED',
      });
    }

    if (!adapter.executable || !adapter.execute) {
      return this.finish(request, adapter, {
        status: 'NOT_CONFIGURED',
        executed: false,
        error: 'Adapter is not executable.',
        policyDecision: 'NOT_CONFIGURED',
      });
    }

    const executionId = generateExecutionId();
    const timestamp = new Date().toISOString();

    try {
      const result = await adapter.execute(request, {
        userId: request.userId,
        appId: request.appId,
        userConfirmed: request.confirmation.granted,
      });
      return this.finish(request, adapter, {
        ...result,
        executionId: result.executionId ?? executionId,
        executed: result.status === 'SUCCESS' && result.executed === true,
        policyDecision: 'ALLOW',
        constitutionVersion: policy.constitutionVersion,
        timestamp,
      });
    } catch (err) {
      return this.finish(request, adapter, {
        status: 'FAILED',
        executed: false,
        executionId,
        error: err instanceof Error ? err.message : 'Execution failed.',
        policyDecision: 'ALLOW',
        constitutionVersion: policy.constitutionVersion,
        errorClassification: 'ADAPTER_ERROR',
        timestamp,
      });
    }
  }

  getAuditLog(): ExecutionAuditEntry[] {
    return this.audit.list();
  }

  private finish(
    request: GovernedExecutionRequest,
    adapter: ExecutionAdapterDefinition | undefined,
    partial: Partial<GovernedExecutionResult> & Pick<GovernedExecutionResult, 'status' | 'executed'>,
  ): GovernedExecutionResult {
    const timestamp = partial.timestamp ?? new Date().toISOString();
    const result: GovernedExecutionResult = {
      status: partial.status,
      executed: partial.executed,
      requestId: request.requestId,
      executionId: partial.executionId,
      toolId: request.toolId,
      adapterId: request.executionAdapterId,
      adapterVersion: adapter?.version,
      constitutionVersion: partial.constitutionVersion ?? request.constitutionVersion,
      policyDecision: partial.policyDecision,
      output: partial.output,
      error: partial.error,
      errorClassification: partial.errorClassification,
      provenance: adapter?.provenance,
      timestamp,
    };

    this.audit.append({
      timestamp,
      requestId: request.requestId,
      executionId: result.executionId,
      toolId: request.toolId,
      adapterId: request.executionAdapterId,
      adapterVersion: adapter?.version ?? 'UNKNOWN',
      constitutionVersion: result.constitutionVersion,
      policyDecision: result.policyDecision ?? 'DENY',
      confirmationResult: resolveConfirmationAudit(request, result.status),
      executionStatus: result.status,
      metadata: {
        foundationVersion: TAU_EXECUTION_FOUNDATION_VERSION,
        capability: request.capability,
        scope: request.scope,
        executed: result.executed ? 1 : 0,
      },
    });

    return result;
  }
}

function resolveConfirmationAudit(
  request: GovernedExecutionRequest,
  status: GovernedExecutionResult['status'],
): ExecutionAuditEntry['confirmationResult'] {
  if (request.confirmation.denied) return 'DENIED';
  if (status === 'REQUIRES_CONFIRMATION') return 'PENDING';
  if (request.confirmation.granted) return 'GRANTED';
  if (!request.confirmation.required) return 'NOT_REQUIRED';
  return 'PENDING';
}

export function createGovernedExecutionExecutor(
  options: GovernedExecutionExecutorOptions,
): GovernedExecutionExecutor {
  return new GovernedExecutionExecutor(options);
}
