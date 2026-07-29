export type AiProviderId =
  | 'openai'
  | 'anthropic'
  | 'gemini'
  | 'ollama'
  | 'deepseek'
  | 'openrouter'
  | 'azure-openai'
  | 'tau-ai'
  | 'fallback';

export type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export type ChatRequest = {
  messages: ChatMessage[];
  model?: string;
  provider?: AiProviderId | 'auto';
  temperature?: number;
  maxTokens?: number;
  privacyMode?: boolean;
  stream?: boolean;
  agent?: string;
};

export type TokenUsage = {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCostUsd?: number;
};

export type ChatResponse = {
  message: string;
  provider: AiProviderId;
  model: string;
  usage?: TokenUsage;
  finishReason?: string;
};

export type StreamChunk = {
  delta: string;
  done: boolean;
  provider: AiProviderId;
  model: string;
  usage?: TokenUsage;
};

export type ProviderHealth = {
  id: AiProviderId;
  available: boolean;
  latencyMs?: number;
  error?: string;
  lastChecked: string;
};

export type ModelCapability = {
  id: string;
  provider: AiProviderId;
  label: string;
  available: boolean;
  contextWindow?: number;
  supportsStreaming?: boolean;
  supportsVision?: boolean;
  costPer1kInput?: number;
  costPer1kOutput?: number;
};

export type AiProviderConfig = {
  id: AiProviderId;
  label: string;
  envKeys: string[];
  defaultModel: string;
  priority: number;
};

export interface AiProviderAdapter {
  id: AiProviderId;
  isConfigured(): boolean;
  listModels(): ModelCapability[];
  chat(messages: ChatMessage[], options: { model: string; maxTokens: number; temperature: number }): Promise<ChatResponse>;
  stream?(messages: ChatMessage[], options: { model: string; maxTokens: number; temperature: number }): AsyncGenerator<StreamChunk>;
  healthCheck?(): Promise<ProviderHealth>;
}
