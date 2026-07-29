import type { AiProviderAdapter, ModelCapability } from '../types';

export const openrouterAdapter: AiProviderAdapter = {
  id: 'openrouter',
  isConfigured: () => Boolean(process.env.OPENROUTER_API_KEY),
  listModels: () => [
    { id: 'openai/gpt-4o-mini', provider: 'openrouter', label: 'OpenRouter GPT-4o Mini', available: Boolean(process.env.OPENROUTER_API_KEY), supportsStreaming: true },
    { id: 'anthropic/claude-3.5-sonnet', provider: 'openrouter', label: 'OpenRouter Claude 3.5', available: Boolean(process.env.OPENROUTER_API_KEY), supportsStreaming: true },
    { id: 'google/gemini-2.0-flash-001', provider: 'openrouter', label: 'OpenRouter Gemini Flash', available: Boolean(process.env.OPENROUTER_API_KEY), supportsStreaming: true },
  ],
  async chat(messages, { model, maxTokens, temperature }) {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://www.tauos.org',
        'X-Title': 'Tau IDE',
      },
      body: JSON.stringify({ model, messages, max_tokens: maxTokens, temperature }),
    });
    if (!res.ok) throw new Error(`OpenRouter ${res.status}: ${await res.text()}`);
    const data = await res.json();
    const prompt = data.usage?.prompt_tokens ?? 0;
    const completion = data.usage?.completion_tokens ?? 0;
    return {
      message: data.choices?.[0]?.message?.content ?? '',
      provider: 'openrouter',
      model,
      usage: { promptTokens: prompt, completionTokens: completion, totalTokens: prompt + completion },
    };
  },
};
