import type { AiProviderAdapter, ModelCapability } from '../types';

export const azureOpenaiAdapter: AiProviderAdapter = {
  id: 'azure-openai',
  isConfigured: () => Boolean(process.env.AZURE_OPENAI_API_KEY && process.env.AZURE_OPENAI_ENDPOINT),
  listModels: () => [{
    id: process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o',
    provider: 'azure-openai',
    label: `Azure OpenAI (${process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o'})`,
    available: Boolean(process.env.AZURE_OPENAI_API_KEY && process.env.AZURE_OPENAI_ENDPOINT),
    supportsStreaming: true,
  }],
  async chat(messages, { model, maxTokens, temperature }) {
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT!.replace(/\/$/, '');
    const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || model;
    const apiVersion = process.env.AZURE_OPENAI_API_VERSION || '2024-02-15-preview';
    const res = await fetch(`${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`, {
      method: 'POST',
      headers: { 'api-key': process.env.AZURE_OPENAI_API_KEY!, 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, max_tokens: maxTokens, temperature }),
    });
    if (!res.ok) throw new Error(`Azure OpenAI ${res.status}: ${await res.text()}`);
    const data = await res.json();
    const prompt = data.usage?.prompt_tokens ?? 0;
    const completion = data.usage?.completion_tokens ?? 0;
    return {
      message: data.choices?.[0]?.message?.content ?? '',
      provider: 'azure-openai',
      model: deployment,
      usage: { promptTokens: prompt, completionTokens: completion, totalTokens: prompt + completion },
    };
  },
};
