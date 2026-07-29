import type { AiProviderAdapter, ChatMessage, ChatResponse, ModelCapability, ProviderHealth } from '../types';

export const openaiAdapter: AiProviderAdapter = {
  id: 'openai',
  isConfigured: () => Boolean(process.env.OPENAI_API_KEY),
  listModels: () => [
    { id: 'gpt-4o-mini', provider: 'openai', label: 'GPT-4o Mini', available: Boolean(process.env.OPENAI_API_KEY), contextWindow: 128000, supportsStreaming: true, costPer1kInput: 0.00015, costPer1kOutput: 0.0006 },
    { id: 'gpt-4o', provider: 'openai', label: 'GPT-4o', available: Boolean(process.env.OPENAI_API_KEY), contextWindow: 128000, supportsStreaming: true, costPer1kInput: 0.0025, costPer1kOutput: 0.01 },
  ],
  async chat(messages, { model, maxTokens, temperature }) {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages, max_tokens: maxTokens, temperature }),
    });
    if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
    const data = await res.json();
    const prompt = data.usage?.prompt_tokens ?? 0;
    const completion = data.usage?.completion_tokens ?? 0;
    return {
      message: data.choices?.[0]?.message?.content ?? '',
      provider: 'openai',
      model,
      finishReason: data.choices?.[0]?.finish_reason,
      usage: { promptTokens: prompt, completionTokens: completion, totalTokens: prompt + completion },
    };
  },
  async *stream(messages, { model, maxTokens, temperature }) {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages, max_tokens: maxTokens, temperature, stream: true }),
    });
    if (!res.ok) throw new Error(`OpenAI stream ${res.status}`);
    const reader = res.body?.getReader();
    if (!reader) throw new Error('No stream body');
    const decoder = new TextDecoder();
    let buffer = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) { yield { delta: '', done: true, provider: 'openai', model }; break; }
      buffer += decoder.decode(value, { stream: true });
      for (const line of buffer.split('\n')) {
        if (!line.startsWith('data: ')) continue;
        const payload = line.slice(6).trim();
        if (payload === '[DONE]') { yield { delta: '', done: true, provider: 'openai', model }; return; }
        try {
          const parsed = JSON.parse(payload);
          const delta = parsed.choices?.[0]?.delta?.content ?? '';
          if (delta) yield { delta, done: false, provider: 'openai', model };
        } catch { /* skip malformed */ }
      }
      buffer = buffer.split('\n').pop() ?? '';
    }
  },
  async healthCheck() {
    const start = Date.now();
    try {
      if (!process.env.OPENAI_API_KEY) return { id: 'openai' as const, available: false, error: 'OPENAI_API_KEY not set', lastChecked: new Date().toISOString() };
      const res = await fetch('https://api.openai.com/v1/models', { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` } });
      return { id: 'openai' as const, available: res.ok, latencyMs: Date.now() - start, lastChecked: new Date().toISOString(), error: res.ok ? undefined : `HTTP ${res.status}` };
    } catch (e) {
      return { id: 'openai' as const, available: false, latencyMs: Date.now() - start, error: e instanceof Error ? e.message : 'Unknown', lastChecked: new Date().toISOString() };
    }
  },
};
