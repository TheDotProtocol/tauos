/**
 * IntelligenceService — core orchestration entry for chat and future modalities.
 *
 * Consumes routing, constitution, memory, tools, and model substrates.
 * Production wiring to ai-gateway is deferred to AI-2 / AI-8.
 */

import type {
  IntelligenceRequest,
  IntelligenceResponse,
  IntelligenceStreamChunk,
} from '../types/context';

export interface IntelligenceService {
  chat(request: IntelligenceRequest): Promise<IntelligenceResponse>;
  stream?(
    request: IntelligenceRequest,
  ): AsyncGenerator<IntelligenceStreamChunk>;
}
