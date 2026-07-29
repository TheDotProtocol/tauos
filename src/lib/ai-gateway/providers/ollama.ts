import type { AiProviderAdapter, ModelCapability } from '../types';

export const ollamaAdapter: AiProviderAdapter = {
  id: 'ollama',
  isConfigured: () => Boolean(process.env.OLLAMA_BASE_URL),
  listModels: () => [{
    id: process.env.OLLAMA_MODEL || 'llama3.2',
    provider: 'ollama',
    label: `Ollama (${process.env.OLLAMA_MODEL || 'llama3.2'})`,
    available: Boolean(process.env.OLLAMA_BASE_URL),
    supportsStreaming: true,
  }],
  async chat(messages, { model }) {
    const base = (process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434').replace(/\/$/, '');
    const res = await fetch(`${base}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages, stream: false }),
    });
    if (!res.ok) throw new Error(`Ollama ${res.status}: ${await res.text()}`);
    const data = await res.json();
    return { message: data.message?.content ?? '', provider: 'ollama', model };
  },
  async *stream(messages, { model }) {
    const base = (process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434').replace(/\/$/, '');
    const res = await fetch(`${base}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages, stream: true }),
    });
    if (!res.ok) throw new Error(`Ollama stream ${res.status}`);
    const reader = res.body?.getReader();
    if (!reader) throw new Error('No stream');
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) { yield { delta: '', done: true, provider: 'ollama', model }; break; }
      for (const line of decoder.decode(value).split('\n').filter(Boolean)) {
        try {
          const parsed = JSON.parse(line);
          const delta = parsed.message?.content ?? '';
          if (delta) yield { delta, done: false, provider: 'ollama', model };
          if (parsed.done) { yield { delta: '', done: true, provider: 'ollama', model }; return; }
        } catch { /* skip */ }
      }
    }
  },
};
