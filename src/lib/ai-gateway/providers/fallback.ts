import type { AiProviderAdapter, ChatMessage, ModelCapability } from '../types';

export const fallbackAdapter: AiProviderAdapter = {
  id: 'fallback',
  isConfigured: () => true,
  listModels: () => [{ id: 'tau-fallback', provider: 'fallback', label: 'Tau Assistant (offline)', available: true }],
  async chat(messages) {
    const last = [...messages].reverse().find((m) => m.role === 'user')?.content ?? '';
    const lower = last.toLowerCase();
    let message = 'I am Tau Architect (offline mode). Configure an AI provider (OPENAI_API_KEY, ANTHROPIC_API_KEY, GEMINI_API_KEY, OLLAMA_BASE_URL, etc.) for full intelligence.';
    if (lower.includes('hello') || lower.includes('hi')) {
      message = "Hello! I'm Tau Architect. Tell me what software you'd like to build and I'll guide you through discovery, design, and implementation.";
    } else if (lower.includes('airbnb') || lower.includes('clone')) {
      message = `[Discovery Phase]\n\nGreat idea — an Airbnb clone! Before I design anything, I need to understand your vision:\n\n1. **Target users**: Hosts, guests, or both?\n2. **Platform**: Web, mobile, or both?\n3. **Core features**: Booking, payments, reviews, messaging?\n4. **Authentication**: Email, social login, or phone?\n5. **Payments**: Stripe, PayPal, or manual?\n6. **Scale**: How many users initially?\n\nI'll never jump straight to code — let's define requirements first.`;
    } else if (lower.includes('architect') || lower.includes('design')) {
      message = 'I can help with system architecture. Tell me about your project and I\'ll produce PRD, database schema, API design, and deployment plan.';
    }
    return { message, provider: 'fallback', model: 'tau-fallback' };
  },
};
