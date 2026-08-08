import type { AiProviderAdapter, ChatMessage, ModelCapability } from '../types';
import {
  FALLBACK_DEFAULT_MESSAGE,
  FALLBACK_GREETING_MESSAGE,
  FALLBACK_AIRBNB_CLONE_MESSAGE,
  FALLBACK_ARCHITECT_MESSAGE,
} from '../prompts';

export const fallbackAdapter: AiProviderAdapter = {
  id: 'fallback',
  isConfigured: () => true,
  listModels: () => [{ id: 'tau-fallback', provider: 'fallback', label: 'Tau Assistant (offline)', available: true }],
  async chat(messages) {
    const last = [...messages].reverse().find((m) => m.role === 'user')?.content ?? '';
    const lower = last.toLowerCase();
    let message = FALLBACK_DEFAULT_MESSAGE;
    if (lower.includes('hello') || lower.includes('hi')) {
      message = FALLBACK_GREETING_MESSAGE;
    } else if (lower.includes('airbnb') || lower.includes('clone')) {
      message = FALLBACK_AIRBNB_CLONE_MESSAGE;
    } else if (lower.includes('architect') || lower.includes('design')) {
      message = FALLBACK_ARCHITECT_MESSAGE;
    }
    return { message, provider: 'fallback', model: 'tau-fallback' };
  },
};
