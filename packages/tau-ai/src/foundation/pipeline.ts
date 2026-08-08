/**
 * Tau Foundation v0.1 composed shadow pipeline (AI-8).
 *
 * Orchestrates Memory → Constitution → Capability → Router → Tools → Execution
 * without duplicating AI-3 through AI-7 logic.
 */

import { createUnknownHardwareProfile } from '../hardware/profile';
import { TAU_FOUNDATION_SUBSTRATE_ID } from '../models/tau-foundation-substrate';
import type { RoutingRequest } from '../routing/routing-types';
import { buildShadowLog } from './shadow-audit';
import { detectCapability, derivePrivacyMode } from './capability-detector';
import type {
  FoundationPipelineRequest,
  FoundationPipelineResult,
  TauFoundationPipelineDeps,
} from './types';
import { TAU_FOUNDATION_PIPELINE_VERSION } from './types';

function generateRequestId(): string {
  return `tau-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export class TauFoundationPipeline {
  constructor(private readonly deps: TauFoundationPipelineDeps) {}

  async process(request: FoundationPipelineRequest): Promise<FoundationPipelineResult> {
    const started = Date.now();
    const requestId = request.requestId ?? generateRequestId();
    const capability = detectCapability(request, request.capabilityOverride);
    const privacyMode = request.privacyModeOverride ?? derivePrivacyMode(request);

    const constitutionDecision = await this.deps.constitution.evaluateRequest({
      userId: request.userId,
      appId: request.appId,
      request,
    });

    if (!constitutionDecision.allowed) {
      return this.blockedResult(requestId, capability, privacyMode, started, 'Constitution blocked request.', 'BLOCK');
    }

    let memoryContextCount = 0;
    if (request.userId) {
      const ctx = await this.deps.memory.findRelevant({
        userId: request.userId,
        productId: request.appId,
        query: request.messages.at(-1)?.content?.slice(0, 64),
        privacyMode,
        limit: 5,
      });
      memoryContextCount = ctx.memories.length;
    }

    let memoryWriteResult;
    if (request.memoryWrite) {
      memoryWriteResult = await this.deps.memory.requestMemoryWrite({
        ...request.memoryWrite,
        privacyMode,
      });
      if (memoryWriteResult.outcome === 'REJECTED') {
        return this.blockedResult(
          requestId,
          capability,
          privacyMode,
          started,
          memoryWriteResult.reason ?? 'Memory write rejected.',
          'BLOCK',
          { memoryContextCount, memoryWrite: memoryWriteResult },
        );
      }
    }

    const hardware = this.resolveHardware();
    const routingRequest: RoutingRequest = {
      requestId,
      capability,
      privacyMode,
      substrates: this.deps.substrates,
      hardwareProfile: hardware,
      systemPolicy: privacyMode === 'LOCAL_ONLY' ? { privacyMode: 'LOCAL_ONLY' } : undefined,
    };
    const routing = this.deps.router.route(routingRequest);

    let toolResult;
    if (request.toolRequest) {
      toolResult = await this.deps.toolExecutor.request({
        ...request.toolRequest,
        requestId: request.toolRequest.requestId ?? `${requestId}-tool`,
        privacyMode,
      });
    }

    let executionResult;
    if (request.executionRequest) {
      executionResult = await this.deps.executionExecutor.execute({
        ...request.executionRequest,
        requestId: request.executionRequest.requestId ?? `${requestId}-exec`,
        privacyMode,
      });
    }

    let response;
    let success = routing.success;

    if (routing.success && this.deps.intelligence && !request.toolRequest && !request.executionRequest) {
      try {
        response = await this.deps.intelligence.chat(request);
        success = true;
      } catch {
        success = false;
      }
    } else if (routing.success) {
      success = true;
    }

    let responseCheck;
    if (request.responseCheck) {
      responseCheck = this.deps.constitution.evaluateStructured({
        ...request.responseCheck,
        kind: 'RESPONSE',
      });
      if (responseCheck.overall === 'BLOCK') {
        success = false;
      }
    }

    const latencyMs = Date.now() - started;
    const constitutionResult = mapPolicyCode(constitutionDecision.code);
    const shadow = buildShadowLog({
      pipelineVersion: TAU_FOUNDATION_PIPELINE_VERSION,
      requestId,
      capability,
      privacyMode,
      substrateId: routing.success ? routing.substrateId : undefined,
      routingSuccess: routing.success,
      constitutionResult,
      memoryDecision: memoryWriteResult?.outcome,
      toolDecision: toolResult?.status,
      executionDecision: executionResult?.status,
      responseCheckResult: responseCheck?.overall,
      latencyMs,
      success,
    });

    return {
      requestId,
      capability,
      privacyMode,
      constitutionAllowed: true,
      routing,
      memoryContextCount,
      memoryWrite: memoryWriteResult,
      toolResult,
      executionResult,
      responseCheck,
      response,
      shadow,
      success,
      latencyMs,
    };
  }

  /** Expose tau-foundation substrate availability without faking weights. */
  isTauFoundationConfigured(): boolean {
    const substrate = this.deps.substrates.find((s) => s.substrate.id === TAU_FOUNDATION_SUBSTRATE_ID);
    return substrate?.substrate.isConfigured() === true;
  }

  private resolveHardware() {
    const detector = this.deps.hardwareDetector;
    if (!detector) return createUnknownHardwareProfile();
    const detected = detector.detect();
    if (detected instanceof Promise) return createUnknownHardwareProfile();
    return detected;
  }

  private blockedResult(
    requestId: string,
    capability: FoundationPipelineResult['capability'],
    privacyMode: FoundationPipelineResult['privacyMode'],
    started: number,
    reason: string,
    constitutionResult: 'PASS' | 'WARN' | 'BLOCK',
    extra?: Partial<FoundationPipelineResult>,
  ): FoundationPipelineResult {
    const latencyMs = Date.now() - started;
    const routing = this.deps.router.route({
      requestId,
      capability,
      privacyMode,
      substrates: this.deps.substrates,
      hardwareProfile: createUnknownHardwareProfile(),
    });

    return {
      requestId,
      capability,
      privacyMode,
      constitutionAllowed: false,
      routing,
      memoryContextCount: extra?.memoryContextCount ?? 0,
      memoryWrite: extra?.memoryWrite,
      shadow: buildShadowLog({
        pipelineVersion: TAU_FOUNDATION_PIPELINE_VERSION,
        requestId,
        capability,
        privacyMode,
        routingSuccess: routing.success,
        constitutionResult,
        memoryDecision: extra?.memoryWrite?.outcome,
        latencyMs,
        success: false,
      }),
      success: false,
      latencyMs,
    };
  }
}

function mapPolicyCode(code?: string): 'PASS' | 'WARN' | 'BLOCK' {
  if (code === 'CONSTITUTION_WARN') return 'WARN';
  if (code === 'CONSTITUTION_BLOCK' || code?.includes('BLOCK')) return 'BLOCK';
  return 'PASS';
}

export function createTauFoundationPipeline(deps: TauFoundationPipelineDeps): TauFoundationPipeline {
  return new TauFoundationPipeline(deps);
}
