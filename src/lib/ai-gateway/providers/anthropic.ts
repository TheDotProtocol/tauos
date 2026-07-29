import type { AiProviderAdapter, ChatResponse, ModelCapability } from '../types';

export const anthropicAdapter: AiProviderAdapter = {
  id: 'anthropic',
  isConfigured: () => Boolean(process.env.ANTHROPIC_API_KEY),
  listModels: () => [
    { id: 'claude-3-5-sonnet-latest', provider: 'anthropic', label: 'Claude 3.5 Sonnet', available: Boolean(process.env.ANTHROPIC_API_KEY), contextWindow: 200000, supportsStreaming: true, costPer1kInput: 0.003, costPer1kOutput: 0.015 },
    { id: 'claude-3-5-haiku-latest', provider: 'anthropic', label: 'Claude 3.5 Haiku', available: Boolean(process.env.ANTHROPIC_API_KEY), contextWindow: 200000, supportsStreaming: true, costPer1kInput: 0.0008, costPer1kOutput: 0.004 },
  ],
  async chat(messages, { model, maxTokens }) {
    const system = messages.find((m) => m.role === 'system')?.content;
    const chatMessages = messages.filter((m) => m.role !== 'system');
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': process.env.ANTHROPIC_API_KEY!, 'anthropic-version': '2023-06-01', 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, max_tokens: maxTokens, system, messages: chatMessages.map((m) => ({ role: m.role, content: m.content })) }),
    });
    if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`);
    const data = await res.json();
    const text = data.content?.find((c: { type: string }) => c.type === 'text')?.text ?? '';
    const prompt = data.usage?.input_tokens ?? 0;
    const completion = data.usage?.output_tokens ?? 0;
    return { message: text, provider: 'anthropic', model, usage: { promptTokens: prompt, completionTokens: completion, totalTokens: prompt + completion } };
  },
};
