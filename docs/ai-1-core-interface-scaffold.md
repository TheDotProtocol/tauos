# Tau AI Core — AI-1 Interface Scaffold

**Milestone:** AI-1  
**Status:** Complete (interfaces only — zero production behaviour change)  
**Package:** `packages/tau-ai/` (`@tau/ai`)

---

## Purpose

AI-1 establishes the canonical Tau AI contract layer defined in AI-0. No existing routes, providers, prompts, or gateway code were modified. The package is independently typecheckable and ready for AI-2 substrate migration.

---

## Created interfaces

| Contract | Location | Responsibility |
|----------|----------|----------------|
| **IntelligenceService** | `src/core/intelligence.ts` | Orchestration entry for chat (and future modalities) |
| **MemoryStore** | `src/memory/store.ts` | Conversation, short/long-term, preferences, knowledge retrieval |
| **ModelRouter** | `src/routing/router.ts` | Substrate/model selection (logic deferred to AI-3) |
| **Constitution** | `src/constitution/constitution.ts` | Policy hooks for requests, tools, execution, memory, models |
| **ToolRegistry** | `src/tools/registry.ts` | Tool registration + `TauTool` contract |
| **ExecutionAdapter** | `src/execution/adapter.ts` | Provider-agnostic approved-action execution |
| **TauAIClient** | `src/client/tau-ai-client.ts` | Public app integration boundary |
| **ModelSubstrate** | `src/models/substrate.ts` | Inference substrate abstraction (evolves from ai-gateway) |

---

## Public API

Import from `@tau/ai` (package path only — **not yet wired into the Next.js app**):

```typescript
import type {
  TauAIClient,
  IntelligenceService,
  MemoryStore,
  ModelRouter,
  Constitution,
  ToolRegistry,
  ExecutionAdapter,
  ModelSubstrate,
} from '@tau/ai';
```

### Integration boundary

```
Application (TauMail, Tau IDE, future Grayscale/ATHENA)
        ↓
   TauAIClient          ← public API
        ↓
   Tau AI Core          ← IntelligenceService + constitution + memory + tools
        ↓
   Model Abstraction    ← ModelSubstrate (AI-2: evolved ai-gateway)
        ↓
   Inference infra      ← Ollama, vLLM (future), remote providers
```

Grayscale consumes Tau AI **only** through `TauAIClient`. No Grayscale or ATHENA code belongs in `packages/tau-ai/`.

---

## Dependency boundaries

| Layer | May import | Must NOT |
|-------|------------|----------|
| `types/` | — | core, client, providers |
| `models/`, `memory/`, `routing/`, `constitution/`, `tools/`, `execution/` | `types/` | OpenAI, Anthropic, Ollama SDKs |
| `core/` | lower layers | Next.js, app routes |
| `client/` | `types/`, `core/` (interfaces) | Grayscale, ATHENA, OpenClaw |
| Applications | `TauAIClient` only | Direct provider SDKs |

**No circular dependencies** within the package — enforced by layered imports and `scripts/verify-tau-ai-core.sh`.

---

## Intentionally NOT implemented (AI-1)

- No ai-gateway refactor or provider migration
- No `/api/tauai/*` route changes
- No vLLM adapter
- No constitution engine implementation
- No memory database or persistence
- No tool implementations
- No OpenClaw dependency or adapter
- No Grayscale / ATHENA logic
- No Figma product UI
- No production wiring of `@tau/ai` into the Next.js app

---

## Verification

```bash
chmod +x scripts/verify-tau-ai-core.sh
./scripts/verify-tau-ai-core.sh
```

Checks:

- Package and all seven contracts exist
- `@tau/ai` TypeScript compiles
- Export surface resolves (compile-time via `scripts/verify-exports.ts`, included in typecheck)
- No circular dependency patterns
- `src/lib/ai-gateway/` intact
- Canonical API routes present
- Root project typecheck passes
- `/api/tauai/chat` still references ai-gateway

---

## AI-2 migration requirements

1. **Refactor `src/lib/ai-gateway/`** → substrate layer implementing `ModelSubstrate`
2. **Map existing `AiProviderAdapter`** to `ModelSubstrate` without changing route behaviour initially
3. **Introduce passthrough `IntelligenceService`** that delegates to current `runAiChat` logic
4. **Split product prompts** out of gateway/index and fallback provider (constitution/skills)
5. **Add vLLM substrate stub** (interface-ready; implementation optional in AI-2)
6. **Wire `TauAIClient` HTTP implementation** behind feature flag before AI-8 route cutover
7. **Do not delete** `tauai-core/` or legacy routes until AI-8 verification

See also: `docs/tau-ai-architecture.md`, `docs/tau-ai-provider-architecture.md`.

---

## Related documentation

- `docs/tau-ai-architecture.md` — canonical architecture (AI-0)
- `docs/tau-ai-model-strategy.md`
- `docs/tau-ai-provider-architecture.md`
- `docs/tau-ai-memory-architecture.md`
- `docs/tau-ai-tool-architecture.md`
- `docs/tau-ai-grayscale-boundary.md`
