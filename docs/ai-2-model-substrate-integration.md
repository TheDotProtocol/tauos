# Tau AI — AI-2 Model Substrate Integration

**Milestone:** AI-2  
**Status:** Complete  
**Principle:** Zero user-visible behaviour change — architectural refactor only

---

## Summary

AI-2 moves the existing `src/lib/ai-gateway/` provider layer underneath the `@tau/ai` `ModelSubstrate` abstraction and introduces the first real `IntelligenceService` implementation that delegates to the existing `runAiChat()` path.

Public API routes (`/api/tauai/chat`, `/api/taumail/ai`, etc.) **continue calling `runAiChat` directly**. The new Tau AI layer is available for internal verification and future cutover (AI-8).

---

## Architecture (post AI-2)

```
Application
    ↓
Existing API route (unchanged)
    ↓
runAiChat() / streamAiChat()  ← still the production path
    ↓
AiProviderAdapter (unchanged inference code)
    ↓
Model provider APIs

Parallel internal path (verified, not wired to routes):

TauAIClient → IntelligenceService → runAiChat() → Provider
                      ↓
               ModelRouter (passthrough)
                      ↓
               ModelSubstrate (via substrate-bridge)
```

---

## Provider migration

| Provider | Gateway adapter | ModelSubstrate | Kind | Status |
|----------|-----------------|----------------|------|--------|
| Tau AI | `providers/tau-ai.ts` | `getSubstrate('tau-ai')` | foundation | ✅ Bridge |
| OpenAI | `providers/openai.ts` | `getSubstrate('openai')` | remote | ✅ Bridge |
| Anthropic | `providers/anthropic.ts` | `getSubstrate('anthropic')` | remote | ✅ Bridge |
| Gemini | `providers/gemini.ts` | `getSubstrate('gemini')` | remote | ✅ Bridge |
| DeepSeek | `providers/deepseek.ts` | `getSubstrate('deepseek')` | remote | ✅ Bridge |
| OpenRouter | `providers/openrouter.ts` | `getSubstrate('openrouter')` | remote | ✅ Bridge |
| Azure OpenAI | `providers/azure-openai.ts` | `getSubstrate('azure-openai')` | remote | ✅ Bridge |
| Ollama | `providers/ollama.ts` | `getSubstrate('ollama')` | local | ✅ Bridge |
| Fallback | `providers/fallback.ts` | `getSubstrate('fallback')` | remote | ✅ Bridge |
| vLLM | `providers/vllm-stub.ts` | stub only | local | ⏸ Not routed |

**Bridge:** `src/lib/ai-gateway/substrate-bridge.ts` — `toModelSubstrate(adapter, meta)` wraps existing `AiProviderAdapter` without rewriting inference code.

---

## ModelSubstrate mapping

| ai-gateway type | @tau/ai type |
|-------------------|--------------|
| `AiProviderAdapter.id` | `ModelSubstrate.id` |
| `AiProviderAdapter.chat()` | `ModelSubstrate.complete()` |
| `AiProviderAdapter.stream()` | `ModelSubstrate.stream()` |
| `AiProviderAdapter.listModels()` | `ModelSubstrate.listCapabilities()` |
| `AiProviderAdapter.healthCheck()` | `ModelSubstrate.healthCheck()` |
| `ChatResponse.provider` | `IntelligenceResponse.substrateId` |

---

## IntelligenceService behaviour

**Location:** `src/lib/tau-ai/intelligence-service.ts`

- `GatewayIntelligenceService.chat()` converts `IntelligenceRequest` → `ChatRequest` → `runAiChat()`
- `GatewayIntelligenceService.stream()` delegates to `streamAiChat()`
- System prompt injection remains in `runAiChat()` (unchanged)
- Provider retry/fallback logic remains in `runAiChat()` (unchanged)

**Factory:** `createGatewayIntelligenceService()`

---

## Registry migration strategy

| Component | AI-2 status | Future |
|-----------|-------------|--------|
| `registry.ts` | **Preserved** — source of truth for adapters | Feeds substrate registry |
| `registerProvider()` | **Preserved** | Sync with substrate registry in AI-3 |
| `getSubstrate()` | New — wraps `getProvider()` via bridge | Used by ModelRouter in AI-3 |
| `createSubstrateRegistry()` | New — includes vLLM stub | Full registry cutover in AI-3 |
| `PROVIDER_CONFIGS` | **Unchanged** | Priority/privacy routing in AI-3 |

Do **not** delete `registry.ts`. Substrates are derived, not duplicated.

---

## Prompt separation strategy

**Location:** `src/lib/ai-gateway/prompts.ts`

| Prompt | Previous location | AI-2 action |
|--------|-------------------|-------------|
| Tau IDE default system prompt | `index.ts` inline | Extracted — **same string** |
| Fallback default message | `providers/fallback.ts` | Extracted — **same string** |
| Fallback greeting / clone / architect | `providers/fallback.ts` | Extracted — **same string** |

Provider adapters no longer own product prompt strings. Keyword matching logic remains in `fallback.ts`. **No prompt text was changed.**

Constitution/skills layer will consume these prompts in AI-4.

---

## vLLM interface

| File | Purpose |
|------|---------|
| `packages/tau-ai/src/models/vllm-substrate.ts` | Package-level stub factory |
| `src/lib/ai-gateway/providers/vllm-stub.ts` | Gateway-side stub (not in routing) |

vLLM is **not registered** in `registry.ts` or production provider selection. Configure via `VLLM_BASE_URL` / `VLLM_HOST` when implemented.

---

## Tau Foundation Model

`providers/tau-ai.ts` unchanged. `ModelSubstrate.kind: 'foundation'` reserved for Tau Foundation Model. No model training or new API behaviour in AI-2.

---

## Backward compatibility

| Surface | Changed? |
|---------|----------|
| `/api/tauai/chat` | ❌ No |
| `/api/taumail/ai` | ❌ No |
| `/api/tau-ide/architect` | ❌ No |
| `runAiChat()` signature | ❌ No |
| Response JSON shape | ❌ No |
| Streaming behaviour | ❌ No |
| Fallback keyword responses | ❌ No |
| Provider env configuration | ❌ No |

**New exports (additive):** `getSubstrate`, `listSubstrates`, `createSubstrateRegistry`, `src/lib/tau-ai/*`

---

## Legacy components

| Component | AI-2 action |
|-----------|-------------|
| `tauai-core/` | Preserved — not migrated |
| `public/tauai/` | Preserved |
| `/api/tauai/route.ts` (legacy) | Unchanged |
| `src/lib/ai-gateway.ts` shim | Unchanged |

---

## Risks

| Risk | Mitigation |
|------|------------|
| Dual code paths diverge | Regression script compares gateway vs IntelligenceService |
| Prompt extraction changes text | Strings copied verbatim; regression tests fallback cases |
| Substrate bridge alters inference | Bridge delegates to existing `adapter.chat()` unchanged |
| Premature route cutover | Verify script asserts routes still import ai-gateway only |

---

## Verification

```bash
./scripts/verify-tau-ai-ai2.sh
```

Regression (fallback, no credentials):

```bash
npx tsx scripts/tau-ai-ai2-regression.ts
```

---

## AI-3 recommendations

1. Implement **privacy-aware routing** in `ModelRouter` (privacy mode → Ollama/local).
2. Wire `ModelRouter` into `GatewayIntelligenceService` behind feature flag.
3. Register vLLM substrate when serving infra is available.
4. Begin moving retry/fallback orchestration from `runAiChat()` into Tau AI core (behaviour-preserving).
5. Keep API routes on `runAiChat()` until AI-8 cutover with shadow comparison.

---

## Related

- `docs/ai-1-core-interface-scaffold.md`
- `docs/tau-ai-architecture.md`
- `docs/tau-ai-provider-architecture.md`
