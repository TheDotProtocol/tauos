import type { ChatRequest, ChatResponse, StreamChunk, ProviderHealth, ModelCapability, AiProviderId } from './types';
import { getProvider, pickAutoProvider, getConfiguredProviders, listAllModels, PROVIDER_CONFIGS } from './registry';
import { trackUsage } from './usage';

const MAX_RETRIES = 2;

export async function runAiChat(input: ChatRequest): Promise<ChatResponse> {
  const providers = input.provider && input.provider !== 'auto'
    ? [getProvider(input.provider)]
    : [...getConfiguredProviders().filter((p) => p.id !== 'fallback'), getProvider('fallback')];

  const maxTokens = input.maxTokens ?? 4096;
  const temperature = input.temperature ?? 0.7;

  const messages = input.messages[0]?.role === 'system'
    ? input.messages
    : [{ role: 'system' as const, content: 'You are Tau AI on Tau IDE — privacy-first, helpful, precise.' }, ...input.messages];

  let lastError: Error | null = null;

  for (const provider of providers) {
    if (!provider.isConfigured()) continue;
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const model = input.model || PROVIDER_CONFIGS.find((c) => c.id === provider.id)?.defaultModel || 'default';
        const result = await provider.chat(messages, { model, maxTokens, temperature });
        if (result.usage) {
          trackUsage(result.provider, result.model, result.usage, input.agent);
        }
        return result;
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        console.error(`[ai-gateway] ${provider.id} attempt ${attempt + 1} failed:`, lastError.message);
        if (attempt < MAX_RETRIES) await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
      }
    }
  }

  throw lastError ?? new Error('All AI providers failed');
}

export async function* streamAiChat(input: ChatRequest): AsyncGenerator<StreamChunk> {
  const provider = input.provider && input.provider !== 'auto'
    ? getProvider(input.provider)
    : pickAutoProvider();

  if (!provider.stream) {
    const result = await runAiChat(input);
    yield { delta: result.message, done: true, provider: result.provider, model: result.model, usage: result.usage };
    return;
  }

  const model = input.model || PROVIDER_CONFIGS.find((c) => c.id === provider.id)?.defaultModel || 'default';
  const maxTokens = input.maxTokens ?? 4096;
  const temperature = input.temperature ?? 0.7;
  const messages = input.messages;

  yield* provider.stream(messages, { model, maxTokens, temperature });
}

export async function checkProviderHealth(): Promise<ProviderHealth[]> {
  const results: ProviderHealth[] = [];
  for (const provider of getConfiguredProviders()) {
    if (provider.healthCheck) {
      results.push(await provider.healthCheck());
    } else {
      results.push({
        id: provider.id,
        available: provider.isConfigured(),
        lastChecked: new Date().toISOString(),
      });
    }
  }
  return results;
}

export function listAvailableModels(): ModelCapability[] {
  return listAllModels();
}

export function getProviderMatrix() {
  return PROVIDER_CONFIGS.map((config) => {
    const adapter = getProvider(config.id);
    return {
      ...config,
      configured: adapter.isConfigured(),
      models: adapter.listModels().filter((m) => m.available),
    };
  });
}

export { getUsageStats, getRecentUsage } from './usage';

// Re-export types for backward compatibility
export type { AiProviderId as AiProvider, ChatMessage, ChatRequest, ChatResponse, ModelCapability as AiModelInfo } from './types';
