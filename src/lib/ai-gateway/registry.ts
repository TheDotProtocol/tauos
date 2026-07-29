import type { AiProviderAdapter, AiProviderId, AiProviderConfig } from './types';
import { openaiAdapter } from './providers/openai';
import { anthropicAdapter } from './providers/anthropic';
import { geminiAdapter } from './providers/gemini';
import { ollamaAdapter } from './providers/ollama';
import { deepseekAdapter } from './providers/deepseek';
import { openrouterAdapter } from './providers/openrouter';
import { azureOpenaiAdapter } from './providers/azure-openai';
import { tauAiAdapter } from './providers/tau-ai';
import { fallbackAdapter } from './providers/fallback';

export const PROVIDER_CONFIGS: AiProviderConfig[] = [
  { id: 'tau-ai', label: 'Tau AI', envKeys: ['TAU_AI_API_KEY', 'TAU_AI_BASE_URL'], defaultModel: 'tau-architect', priority: 0 },
  { id: 'openai', label: 'OpenAI', envKeys: ['OPENAI_API_KEY'], defaultModel: process.env.OPENAI_DEFAULT_MODEL || 'gpt-4o-mini', priority: 1 },
  { id: 'anthropic', label: 'Anthropic', envKeys: ['ANTHROPIC_API_KEY'], defaultModel: process.env.ANTHROPIC_DEFAULT_MODEL || 'claude-3-5-sonnet-latest', priority: 2 },
  { id: 'gemini', label: 'Google Gemini', envKeys: ['GEMINI_API_KEY', 'GOOGLE_AI_API_KEY'], defaultModel: 'gemini-2.0-flash', priority: 3 },
  { id: 'deepseek', label: 'DeepSeek', envKeys: ['DEEPSEEK_API_KEY'], defaultModel: 'deepseek-chat', priority: 4 },
  { id: 'openrouter', label: 'OpenRouter', envKeys: ['OPENROUTER_API_KEY'], defaultModel: 'openai/gpt-4o-mini', priority: 5 },
  { id: 'azure-openai', label: 'Azure OpenAI', envKeys: ['AZURE_OPENAI_API_KEY', 'AZURE_OPENAI_ENDPOINT'], defaultModel: process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o', priority: 6 },
  { id: 'ollama', label: 'Ollama (Local)', envKeys: ['OLLAMA_BASE_URL'], defaultModel: process.env.OLLAMA_MODEL || 'llama3.2', priority: 7 },
  { id: 'fallback', label: 'Offline Fallback', envKeys: [], defaultModel: 'tau-fallback', priority: 99 },
];

const adapters: AiProviderAdapter[] = [
  tauAiAdapter,
  openaiAdapter,
  anthropicAdapter,
  geminiAdapter,
  deepseekAdapter,
  openrouterAdapter,
  azureOpenaiAdapter,
  ollamaAdapter,
  fallbackAdapter,
];

export function getProvider(id: AiProviderId): AiProviderAdapter {
  const adapter = adapters.find((a) => a.id === id);
  if (!adapter) throw new Error(`Unknown provider: ${id}`);
  return adapter;
}

export function getConfiguredProviders(): AiProviderAdapter[] {
  return adapters.filter((a) => a.isConfigured()).sort((a, b) => {
    const pa = PROVIDER_CONFIGS.find((c) => c.id === a.id)?.priority ?? 50;
    const pb = PROVIDER_CONFIGS.find((c) => c.id === b.id)?.priority ?? 50;
    return pa - pb;
  });
}

export function pickAutoProvider(): AiProviderAdapter {
  const manual = process.env.TAU_AI_PROVIDER as AiProviderId | undefined;
  if (manual) {
    const adapter = getProvider(manual);
    if (adapter.isConfigured()) return adapter;
  }
  const configured = getConfiguredProviders().filter((a) => a.id !== 'fallback');
  return configured[0] ?? fallbackAdapter;
}

export function listAllModels() {
  return adapters.flatMap((a) => a.listModels());
}

export function registerProvider(adapter: AiProviderAdapter) {
  const idx = adapters.findIndex((a) => a.id === adapter.id);
  if (idx >= 0) adapters[idx] = adapter;
  else adapters.push(adapter);
}
