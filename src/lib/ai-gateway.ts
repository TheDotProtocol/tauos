export type AiProvider = 'openai' | 'anthropic' | 'ollama' | 'fallback';

export type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export type ChatRequest = {
  messages: ChatMessage[];
  model?: string;
  provider?: AiProvider | 'auto';
  temperature?: number;
  maxTokens?: number;
  privacyMode?: boolean;
};

export type ChatResponse = {
  message: string;
  provider: AiProvider;
  model: string;
  usage?: { promptTokens?: number; completionTokens?: number };
};

export type AiModelInfo = {
  id: string;
  provider: AiProvider;
  label: string;
  available: boolean;
};

function pickProvider(requested?: ChatRequest['provider']): AiProvider {
  if (requested && requested !== 'auto') return requested;
  if (process.env.OPENAI_API_KEY) return 'openai';
  if (process.env.ANTHROPIC_API_KEY) return 'anthropic';
  if (process.env.OLLAMA_BASE_URL) return 'ollama';
  return 'fallback';
}

export function listAvailableModels(): AiModelInfo[] {
  const openai = Boolean(process.env.OPENAI_API_KEY);
  const anthropic = Boolean(process.env.ANTHROPIC_API_KEY);
  const ollama = Boolean(process.env.OLLAMA_BASE_URL);

  return [
    { id: 'gpt-4o-mini', provider: 'openai', label: 'GPT-4o Mini', available: openai },
    { id: 'gpt-4o', provider: 'openai', label: 'GPT-4o', available: openai },
    { id: 'claude-3-5-sonnet-latest', provider: 'anthropic', label: 'Claude 3.5 Sonnet', available: anthropic },
    { id: 'claude-3-5-haiku-latest', provider: 'anthropic', label: 'Claude 3.5 Haiku', available: anthropic },
    {
      id: process.env.OLLAMA_MODEL || 'llama3.2',
      provider: 'ollama',
      label: `Ollama (${process.env.OLLAMA_MODEL || 'llama3.2'})`,
      available: ollama,
    },
    { id: 'tau-fallback', provider: 'fallback', label: 'Tau Assistant (offline)', available: true },
  ];
}

async function chatOpenAI(messages: ChatMessage[], model: string, maxTokens: number): Promise<ChatResponse> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model, messages, max_tokens: maxTokens, temperature: 0.7 }),
  });

  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return {
    message: data.choices?.[0]?.message?.content ?? '',
    provider: 'openai',
    model,
    usage: {
      promptTokens: data.usage?.prompt_tokens,
      completionTokens: data.usage?.completion_tokens,
    },
  };
}

async function chatAnthropic(messages: ChatMessage[], model: string, maxTokens: number): Promise<ChatResponse> {
  const system = messages.find((m) => m.role === 'system')?.content;
  const chatMessages = messages.filter((m) => m.role !== 'system');

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      system,
      messages: chatMessages.map((m) => ({ role: m.role, content: m.content })),
    }),
  });

  if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const text = data.content?.find((c: { type: string }) => c.type === 'text')?.text ?? '';
  return {
    message: text,
    provider: 'anthropic',
    model,
    usage: {
      promptTokens: data.usage?.input_tokens,
      completionTokens: data.usage?.output_tokens,
    },
  };
}

async function chatOllama(messages: ChatMessage[], model: string): Promise<ChatResponse> {
  const base = (process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434').replace(/\/$/, '');
  const res = await fetch(`${base}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, messages, stream: false }),
  });

  if (!res.ok) throw new Error(`Ollama ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return {
    message: data.message?.content ?? '',
    provider: 'ollama',
    model,
  };
}

function chatFallback(messages: ChatMessage[]): ChatResponse {
  const last = [...messages].reverse().find((m) => m.role === 'user')?.content ?? '';
  const lower = last.toLowerCase();

  let message =
    'I am Tau AI. Connect OPENAI_API_KEY, ANTHROPIC_API_KEY, or OLLAMA_BASE_URL for full model responses.';
  if (lower.includes('hello') || lower.includes('hi')) {
    message = "Hello — I'm Tau, your privacy-first assistant on TAU CORE™. How can I help?";
  } else if (lower.includes('mail')) {
    message = 'Open Tau Mail at /taumail to manage your inbox.';
  } else if (lower.includes('cloud') || lower.includes('file')) {
    message = 'Tau Cloud lives at /taucloud — encrypted storage on Supabase.';
  }

  return { message, provider: 'fallback', model: 'tau-fallback' };
}

const DEFAULT_MODELS: Record<AiProvider, string> = {
  openai: process.env.OPENAI_DEFAULT_MODEL || 'gpt-4o-mini',
  anthropic: process.env.ANTHROPIC_DEFAULT_MODEL || 'claude-3-5-sonnet-latest',
  ollama: process.env.OLLAMA_MODEL || 'llama3.2',
  fallback: 'tau-fallback',
};

export async function runAiChat(input: ChatRequest): Promise<ChatResponse> {
  const provider = pickProvider(input.provider);
  const model = input.model || DEFAULT_MODELS[provider];
  const maxTokens = input.maxTokens ?? 1024;

  const systemPrompt: ChatMessage = {
    role: 'system',
    content:
      'You are Tau AI on TAU CORE™ — privacy-first, helpful, concise. Never request unnecessary personal data.',
  };

  const messages =
    input.messages[0]?.role === 'system'
      ? input.messages
      : [systemPrompt, ...input.messages];

  if (input.privacyMode) {
    // Ephemeral — no persistence hook here; callers must not log messages
  }

  try {
    switch (provider) {
      case 'openai':
        if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY not set');
        return await chatOpenAI(messages, model, maxTokens);
      case 'anthropic':
        if (!process.env.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY not set');
        return await chatAnthropic(messages, model, maxTokens);
      case 'ollama':
        return await chatOllama(messages, model);
      default:
        return chatFallback(messages);
    }
  } catch (err) {
    if (provider !== 'fallback') {
      console.error(`[ai-gateway] ${provider} failed:`, err);
      return chatFallback(messages);
    }
    throw err;
  }
}
