/**
 * Deterministic capability detection (AI-8).
 */

import { TAU_CAPABILITIES, type CapabilityId } from '../capabilities/types';
import type { IntelligenceRequest } from '../types/context';

export function detectCapability(
  request: IntelligenceRequest,
  override?: CapabilityId,
): CapabilityId {
  if (override) return override;

  if (request.options?.agent === 'code') {
    return TAU_CAPABILITIES.CODE;
  }
  if (request.options?.agent === 'tool') {
    return TAU_CAPABILITIES.GENERAL_TOOL_USE;
  }

  const lastUser = [...request.messages].reverse().find((m) => m.role === 'user');
  const content = lastUser?.content?.toLowerCase() ?? '';

  if (content.includes('```') || content.includes('function ') || content.includes('def ')) {
    return TAU_CAPABILITIES.CODE;
  }
  if (content.includes('generate image') || content.includes('create image')) {
    return TAU_CAPABILITIES.IMAGE_GENERATION;
  }
  if (content.includes('describe this image') || content.includes('analyze image')) {
    return TAU_CAPABILITIES.IMAGE_UNDERSTANDING;
  }
  if (content.includes('use tool') || content.includes('run tool')) {
    return TAU_CAPABILITIES.GENERAL_TOOL_USE;
  }

  return TAU_CAPABILITIES.TEXT_REASONING;
}

export function derivePrivacyMode(request: IntelligenceRequest): 'LOCAL_ONLY' | 'REMOTE_ALLOWED' {
  if (request.options?.privacyMode === true) {
    return 'LOCAL_ONLY';
  }
  return 'REMOTE_ALLOWED';
}
