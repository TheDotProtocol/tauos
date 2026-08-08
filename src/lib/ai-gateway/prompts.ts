/**
 * Product-layer prompts and offline responses (AI-2 separation).
 *
 * Provider adapters must NOT own product-specific intelligence.
 * Strings are preserved exactly from pre-AI-2 behaviour.
 */

/** Default system prompt injected by runAiChat when none is present. */
export const TAU_IDE_DEFAULT_SYSTEM_PROMPT =
  'You are Tau AI on Tau IDE — privacy-first, helpful, precise.';

/** Offline fallback — default response. */
export const FALLBACK_DEFAULT_MESSAGE =
  'I am Tau Architect (offline mode). Configure an AI provider (OPENAI_API_KEY, ANTHROPIC_API_KEY, GEMINI_API_KEY, OLLAMA_BASE_URL, etc.) for full intelligence.';

/** Offline fallback — greeting. */
export const FALLBACK_GREETING_MESSAGE =
  "Hello! I'm Tau Architect. Tell me what software you'd like to build and I'll guide you through discovery, design, and implementation.";

/** Offline fallback — Airbnb / clone discovery. */
export const FALLBACK_AIRBNB_CLONE_MESSAGE = `[Discovery Phase]

Great idea — an Airbnb clone! Before I design anything, I need to understand your vision:

1. **Target users**: Hosts, guests, or both?
2. **Platform**: Web, mobile, or both?
3. **Core features**: Booking, payments, reviews, messaging?
4. **Authentication**: Email, social login, or phone?
5. **Payments**: Stripe, PayPal, or manual?
6. **Scale**: How many users initially?

I'll never jump straight to code — let's define requirements first.`;

/** Offline fallback — architecture / design. */
export const FALLBACK_ARCHITECT_MESSAGE =
  "I can help with system architecture. Tell me about your project and I'll produce PRD, database schema, API design, and deployment plan.";
