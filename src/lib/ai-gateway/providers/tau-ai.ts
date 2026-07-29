/**
 * Future Tau AI provider — stub ready for proprietary models.
 * When Tau AI launches, implement chat/stream here without changing the rest of Tau IDE.
 */
import type { AiProviderAdapter, ChatMessage, ModelCapability } from '../types';

export const tauAiAdapter: AiProviderAdapter = {
  id: 'tau-ai',
  isConfigured: () => Boolean(process.env.TAU_AI_API_KEY && process.env.TAU_AI_BASE_URL),
  listModels: () => [
    { id: 'tau-foundation', provider: 'tau-ai', label: 'Tau AI Foundation', available: Boolean(process.env.TAU_AI_API_KEY), supportsStreaming: true },
    { id: 'tau-code', provider: 'tau-ai', label: 'Tau Code Model', available: Boolean(process.env.TAU_AI_API_KEY), supportsStreaming: true },
    { id: 'tau-architect', provider: 'tau-ai', label: 'Tau Architect Model', available: Boolean(process.env.TAU_AI_API_KEY), supportsStreaming: true },
    { id: 'tau-reasoning', provider: 'tau-ai', label: 'Tau Reasoning Model', available: Boolean(process.env.TAU_AI_API_KEY), supportsStreaming: true },
    { id: 'tau-enterprise', provider: 'tau-ai', label: 'Tau Enterprise Model', available: Boolean(process.env.TAU_AI_API_KEY), supportsStreaming: true },
  ],
  async chat(messages, { model, maxTokens }) {
    const base = process.env.TAU_AI_BASE_URL!.replace(/\/$/, '');
    const res = await fetch(`${base}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.TAU_AI_API_KEY}`,
        'Content-Type': 'application/json',
        'X-Tau-Client': 'tau-ide',
      },
      body: JSON.stringify({ model, messages, max_tokens: maxTokens }),
    });
    if (!res.ok) throw new Error(`Tau AI ${res.status}: ${await res.text()}`);
    const data = await res.json();
    return {
      message: data.choices?.[0]?.message?.content ?? data.message ?? '',
      provider: 'tau-ai',
      model,
      usage: data.usage ? {
        promptTokens: data.usage.prompt_tokens ?? 0,
        completionTokens: data.usage.completion_tokens ?? 0,
        totalTokens: (data.usage.prompt_tokens ?? 0) + (data.usage.completion_tokens ?? 0),
      } : undefined,
    };
  },
};
