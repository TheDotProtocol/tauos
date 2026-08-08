/**
 * Legacy routing task kind → capability mapping (AI-3.0).
 */

import type { RoutingTaskKind } from '../routing/router';
import { TAU_CAPABILITIES, type KnownCapability } from './types';

export const ROUTING_TASK_TO_CAPABILITY: Partial<
  Record<RoutingTaskKind, KnownCapability>
> = {
  chat: TAU_CAPABILITIES.TEXT_REASONING,
  completion: TAU_CAPABILITIES.TEXT_REASONING,
  embedding: TAU_CAPABILITIES.EMBEDDING,
  vision: TAU_CAPABILITIES.IMAGE_UNDERSTANDING,
  voice: TAU_CAPABILITIES.SPEECH_TO_TEXT,
  'tool-planning': TAU_CAPABILITIES.GENERAL_TOOL_USE,
};
