import type { AiProviderAdapter, ModelCapability } from '../types';

export const deepseekAdapter: AiProviderAdapter = {
  id: 'deepseek',
  isConfigured: () => Boolean(process.env.DEEPSEEK_API_KEY),
  listModels: () => [
    { id: 'deepseek-chat', provider: 'deepseek', label: 'DeepSeek Chat', available: Boolean(process.env.DEEPSEEK_API_KEY), supportsStreaming: true },
    { id: 'deepseek-reasoner', provider: 'deepseek', label: 'DeepSeek Reasoner', available: Boolean(process.env.DEEPSEEK_API_KEY), supportsStreaming: true },
  ],
  async chat(messages, { model, maxTokens, temperature }) {
    const res = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages, max_tokens: maxTokens, temperature }),
    });
    if (!res.ok) throw new Error(`DeepSeek ${res.status}: ${await res.text()}`);
    const data = await res.json();
    const prompt = data.usage?.prompt_tokens ?? 0;
    const completion = data.usage?.completion_tokens ?? 0;
    return {
      message: data.choices?.[0]?.message?.content ?? '',
      provider: 'deepseek',
      model,
      usage: { promptTokens: prompt, completionTokens: completion, totalTokens: prompt + completion },
    };
  },
};
