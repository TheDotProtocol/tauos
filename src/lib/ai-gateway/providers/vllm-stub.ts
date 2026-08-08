/**
 * vLLM substrate stub (AI-2/AI-3.1) — interface + metadata, not production routing.
 */

import {
  createVLLMSubstrateStub,
  VLLM_SUBSTRATE_ID,
} from '@tau/ai';

export { VLLM_SUBSTRATE_ID };

export const vllmSubstrateStub = createVLLMSubstrateStub();
