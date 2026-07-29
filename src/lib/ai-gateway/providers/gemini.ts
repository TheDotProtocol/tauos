import type { AiProviderAdapter, ModelCapability } from '../types';

export const geminiAdapter: AiProviderAdapter = {
  id: 'gemini',
  isConfigured: () => Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY),
  listModels: () => [
    { id: 'gemini-2.0-flash', provider: 'gemini', label: 'Gemini 2.0 Flash', available: Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY), contextWindow: 1000000, supportsStreaming: true },
    { id: 'gemini-1.5-pro', provider: 'gemini', label: 'Gemini 1.5 Pro', available: Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY), contextWindow: 2000000, supportsStreaming: true },
  ],
  async chat(messages, { model, maxTokens, temperature }) {
    const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
    const system = messages.find((m) => m.role === 'system')?.content ?? '';
    const contents = messages.filter((m) => m.role !== 'system').map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: system ? { parts: [{ text: system }] } : undefined,
        contents,
        generationConfig: { maxOutputTokens: maxTokens, temperature },
      }),
    });
    if (!res.ok) throw new Error(`Gemini ${res.status}: ${await res.text()}`);
    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    const prompt = data.usageMetadata?.promptTokenCount ?? 0;
    const completion = data.usageMetadata?.candidatesTokenCount ?? 0;
    return { message: text, provider: 'gemini', model, usage: { promptTokens: prompt, completionTokens: completion, totalTokens: prompt + completion } };
  },
};
