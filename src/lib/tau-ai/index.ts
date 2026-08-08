/**
 * Tau AI integration layer (AI-2) — sits above ai-gateway, not yet wired to routes.
 */

export {
  GatewayIntelligenceService,
  createGatewayIntelligenceService,
} from './intelligence-service';

export {
  PassthroughModelRouter,
  createPassthroughModelRouter,
} from './passthrough-router';

export {
  GatewayTauAIClient,
  createGatewayTauAIClient,
} from './gateway-client';

export {
  shadowRouteFromGateway,
  buildRoutableSubstratesFromGateway,
} from './shadow-routing';

export {
  runFoundationShadowComparison,
  runFoundationShadowMatrix,
} from './foundation-shadow';
