/**
 * Foundation shadow comparison with gateway routing (AI-8).
 * Metadata only — production path unchanged.
 */

import {
  createDefaultFoundationPipeline,
  compareShadowRouting,
  TAU_CAPABILITIES,
  type FoundationPipelineRequest,
  type PrivacyMode,
  type CapabilityId,
} from '@tau/ai';
import { shadowRouteFromGateway } from './shadow-routing';
import { buildRoutableSubstratesFromGateway } from './shadow-routing';

export type FoundationShadowInput = {
  requestId?: string;
  capability: CapabilityId;
  privacyMode: PrivacyMode;
  messages?: FoundationPipelineRequest['messages'];
};

export function runFoundationShadowComparison(input: FoundationShadowInput) {
  const pipeline = createDefaultFoundationPipeline({
    substrates: buildRoutableSubstratesFromGateway(),
    includeTestTools: true,
    includeTestExecutionAdapters: true,
  });

  const legacy = shadowRouteFromGateway({
    requestId: input.requestId,
    capability: input.capability,
    privacyMode: input.privacyMode,
  });

  const foundationRequest: FoundationPipelineRequest = {
    requestId: input.requestId,
    messages: input.messages ?? [{ role: 'user', content: 'shadow test' }],
    capabilityOverride: input.capability,
    privacyModeOverride: input.privacyMode,
    options: { privacyMode: input.privacyMode === 'LOCAL_ONLY' },
  };

  return pipeline.process(foundationRequest).then((result) => {
    const legacyId = legacy.success ? legacy.substrateId : legacy.metrics?.legacySubstrateId;
    const foundationId = result.routing.success ? result.routing.substrateId : undefined;
    const agreement = compareShadowRouting(legacyId, foundationId);

    result.shadow.routingAgreement = agreement;
    result.shadow.legacySubstrateId = legacyId;

    return {
      legacy,
      foundation: result,
      agreement,
    };
  });
}

export async function runFoundationShadowMatrix() {
  const scenarios = [
    { capability: TAU_CAPABILITIES.TEXT_REASONING, privacyMode: 'REMOTE_ALLOWED' as const },
    { capability: TAU_CAPABILITIES.CODE, privacyMode: 'REMOTE_ALLOWED' as const },
    { capability: TAU_CAPABILITIES.TEXT_REASONING, privacyMode: 'LOCAL_ONLY' as const },
  ];

  for (const scenario of scenarios) {
    const cmp = await runFoundationShadowComparison(scenario);
    console.log(
      `  ${scenario.capability} + ${scenario.privacyMode}: ` +
        `legacy=${cmp.legacy.success ? cmp.legacy.substrateId : ('failureCode' in cmp.legacy ? cmp.legacy.failureCode : 'fail')} ` +
        `foundation=${cmp.foundation.routing.success ? cmp.foundation.routing.substrateId : 'fail'} ` +
        `agreement=${cmp.agreement ?? 'n/a'}`,
    );
  }
}
