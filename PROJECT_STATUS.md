# Tau Core — Project Status

**Updated:** 2026-08-08  
**Branch:** `main`  
**Active track:** **Tau AI** (Master Engineering Directive v1.0)  
**Shelved:** Mobile OS / Tau Launcher / mobile Figma (resume tomorrow)

---

## Current milestone

**AI-9 — Tau Foundation v0.1 Product** · **Complete**  
**AI-10 — Tau AI Voice** · **Batch 1 complete**  
**AI-11 — Tau Ecosystem Integration** · **Complete**  
**TF-0 — Tau Foundation Model Research** · **Complete**  
**TF-1 — Tau Dataset v0.1** · **Complete**  
**TF-2 — Training Pipeline v0.1** · **Complete** · **STOP** (await approval for TF-3)

**Shelved (do not modify):** M7 Mobile OS, Tau Launcher, mobile Figma, mobile platform milestones

---

## Tau AI — Intelligence Platform Consolidation

**Directive:** Master Engineering Directive v1.0  
**Principle:** Tau AI ≠ model. Tau AI ≠ Grayscale. Tau AI ≠ ATHENA. Tau AI ≠ Ollama/vLLM.

| Batch | Scope | Status |
|-------|-------|--------|
| **AI-0** | Architecture audit | ✅ Complete |
| **AI-1** | Tau AI core abstraction (`packages/tau-ai/`) | ✅ Complete |
| **AI-2** | Model/provider substrate integration | ✅ Complete |
| **AI-3** | Multimodal router + capability assembly | 🔄 In progress |
| AI-3.0 | Capability registry | ✅ Complete |
| AI-3.1 | Model substrate metadata (Tau Foundation v0.1) | ✅ Complete |
| AI-3.2 | Deterministic model router (shadow mode) | ✅ Complete |
| AI-3.3 | Hardware / environment-aware routing | ✅ Complete |
| AI-3.4 | Substrate enrichment + routing validation | ✅ Complete |
| AI-4 | Tau Constitution | ✅ Complete |
| AI-5 | Memory abstraction | ✅ Complete |
| AI-6 | Tool registry foundation | ✅ Complete |
| AI-7 | Execution abstraction | ✅ Complete |
| AI-8 | Tau Foundation composition (shadow) | ✅ Complete |
| AI-9 | Tau Foundation v0.1 product + Figma UI + Tau ID SSO | ✅ Complete |
| AI-10 | Tau AI Voice (governed STT → Foundation → TTS) | ✅ Batch 1 complete |
| AI-11 | Ecosystem integrations (TauMail bridge + contract) | ✅ Complete |
| AI-12 | Testing + performance | ⏸ |
| AI-13 | Production hardening | ⏸ |

### AI-0 findings (summary)

- **Canonical foundation:** `src/lib/ai-gateway/` + `/api/tauai/chat`
- **Legacy to deprecate:** `tauai-core/`, `public/tauai/` HTML demos
- **Grayscale:** Separate product (marketing only today); no ATHENA/OpenClaw in repo
- **Recommendation:** Evolve gateway → substrate layer; new `packages/tau-ai/` for core

### AI-9 deliverables (complete)

- `src/lib/tau-ai-app/` — tokens, assets, foundation service, session context, screen registry
- `src/components/tau-ai-app/` — all desktop Figma screens + modals/overlays + TauAiLogo
- `src/app/tau-ai-app/*` — full product routes (20 screens)
- Tau ID SSO — login, OAuth, 2FA, protected routes, live profile in sidebar
- `src/app/api/tau-foundation/chat/route.ts` — authenticated product chat API
- `src/app/api/tau-foundation/substrates/route.ts` — live substrate status
- `public/tau-ai-app/` — Figma assets (logo-lockup, logo-emblem, icons)
- `scripts/test-tau-ai-product.ts`, `scripts/verify-tau-ai-ai9.sh`
- Marketing entry: `/tauai` → **Try Tau AI** → `/tau-ai-app/welcome`

**Product URL:** `http://localhost:3000/tau-ai-app/welcome` · Login: `/tau-ai-app/auth`

### AI-10 deliverables (batch 1 — STOP)

- Governed voice pipeline: STT substrate → `TauFoundationClient` → client TTS
- `POST /api/tau-foundation/voice` (authenticated) + `GET` status
- Wired `TauAiVoiceOverlay` + `/tau-ai-app/chat/voice` (Figma UI preserved)
- Verification levels: UI / ADAPTER / LIVE_MODEL / END_TO_END (honest reporting)
- Legacy `/api/tauai/voice` **unchanged**
- `scripts/test-voice-ai10.ts`, `scripts/verify-tau-ai-ai10.sh`
- `docs/ai-10-tau-ai-voice.md`

### AI-11 deliverables (complete — STOP)

- Ecosystem integration contract: `packages/tau-ai/src/ecosystem/`
- Per-product Foundation clients: `src/lib/tau-ai/ecosystem-foundation-service.ts`
- TauMail bridge: `src/lib/taumail/foundation-bridge.ts` → Foundation primary, `runAiChat` fallback
- Integration registry: `src/lib/tau-ai/ecosystem-registry.ts`
- Status API: `GET /api/tau-foundation/ecosystem`
- Legacy routes preserved (`/api/tauai/chat`, `/api/taumail/ai` fallback, `/api/tau-ide/architect`)
- `scripts/test-ecosystem-ai11.ts`, `scripts/verify-tau-ai-ai11.sh`
- `docs/ai-11-tau-ecosystem-integration.md`

**Product status:** TauMail READY · Tau Developer PARTIALLY_READY · TauTalk NOT_READY

---

## Tau Foundation Model Roadmap (TF-0+)

**Principle:** Tau Foundation ≠ Tau Foundation Model. Third-party substrates remain third-party.

| Phase | Scope | Status |
|-------|-------|--------|
| **TF-0** | Research + licensing + dataset/training plan | ✅ Complete |
| **TF-1** | Dataset v0.1 + provenance registry | ✅ Complete |
| **TF-2** | Reproducible training pipeline | ✅ Complete |
| **TF-3** | First checkpoint | ⏸ |
| **TF-4** | Internal evaluation | ⏸ |
| **TF-5** | Tau Foundation Model v0.1 | ⏸ |
| **TF-6** | Private beta | ⏸ |
| **TF-7** | Public beta | ⏸ |
| **TF-8** | Production substrate integration | ⏸ |

### TF-0 deliverables (complete — STOP)

- **Recommended base:** Qwen2.5-7B-Instruct (Apache 2.0) — REQUIRES LEGAL REVIEW for “Tau-owned” branding
- **Recommended method:** LoRA/QLoRA SFT + optional DPO (not from-scratch)
- **Recommended v0.1 size:** 7B (POC at 1.5B optional)
- `docs/tf-0-tau-foundation-model-strategy.md`
- `docs/tf-0-base-model-evaluation.md`
- `docs/tf-0-dataset-architecture.md`
- `docs/tf-0-training-pipeline.md`
- `docs/tf-0-compute-strategy.md`
- `docs/tf-0-evaluation-framework.md`
- `docs/tf-0-license-and-provenance.md`
- `docs/tau-foundation-model-track.md` (updated)
- `weightsAvailable: false` — no training, no downloads, no AWS

**Next milestone:** TF-3 — First checkpoint (await approval)

### TF-2 deliverables (complete — STOP)

- `tools/tau-training/` — gate, export, manifest, checkpoint, train, eval harness
- `BaseModelAdapter` — qwen2.5, llama3, mistral, smoke-tiny
- Configs: `qwen2.5-7b-lora.yaml` (TF-3 intent), `smoke-tiny.yaml` (PIPELINE SMOKE TEST)
- `scripts/export-tau-training-data.py`, `run-tau-training-smoke.py`, `test-tf-2-pipeline.py`, `verify-tf-2.sh`
- Training gate fail-closed; test split protected; Gold Set unchanged (106)
- PIPELINE SMOKE TEST: **PASS** (tiny HF test model only)
- Smoke artifact: `checkpoints/tf2-smoke/` (gitignored)
- Downloaded for smoke: `hf-internal-testing/tiny-random-LlamaForCausalLM` only — **not Qwen 7B**

---

### TF-1 deliverables (complete)

- `datasets/tau-foundation/v0.1/` — schema, curated gold, train/val/test splits, manifests
- `tools/tau-dataset/` — schema, validation, build, seed factory (gold preserved on rebuild)
- `scripts/build-tau-dataset-v01.ts`, `scripts/test-tau-dataset-v01.ts`, `scripts/verify-tau-dataset-v01.sh`
- Gold seed: 106 TAU_CREATED human-authored records (Phase A)
- Deterministic validation: provenance, duplicates, split leakage, secrets
- `docs/tf-1-tau-dataset-v01.md` + schema/provenance/quality/generation/license docs

---

- `packages/tau-ai/src/foundation/` — composed shadow pipeline + factory
- `packages/tau-ai/src/client/foundation-client.ts` — TauFoundationClient
- `src/lib/tau-ai/foundation-shadow.ts` — gateway shadow comparison
- `packages/tau-ai/scripts/test-foundation-ai8.ts` — 19-scenario matrix
- `scripts/verify-tau-ai-ai8.sh`
- `docs/ai-8-tau-foundation-composition.md`

### AI-7 deliverables

- `packages/tau-ai/src/execution/` — types, policy, registry, executor, bridge, test adapters
- `packages/tau-ai/scripts/test-execution-ai7.ts` — 31-scenario test matrix
- `scripts/verify-tau-ai-ai7.sh`
- `docs/ai-7-tau-execution-foundation.md`

### AI-6 deliverables

- `packages/tau-ai/src/tools/` — types, registry, governance, executor, test tools
- `packages/tau-ai/scripts/test-tools-ai6.ts` — 25-scenario test matrix
- `scripts/verify-tau-ai-ai6.sh`
- `docs/ai-6-tau-tool-foundation.md`

### AI-5 deliverables

- `packages/tau-ai/src/memory/` — types, governance, in-memory store, retrieval boundary
- `packages/tau-ai/scripts/test-memory-ai5.ts` — 22-scenario test matrix
- `scripts/verify-tau-ai-ai5.sh`
- `docs/ai-5-tau-memory-foundation.md`

### AI-4 deliverables

- `packages/tau-ai/src/constitution/` — principles, hierarchy, evaluator, TauConstitutionV01
- `packages/tau-ai/scripts/test-constitution-ai4.ts` — 22-scenario test matrix
- `scripts/verify-tau-ai-ai4.sh`
- `docs/ai-4-tau-constitution.md`

### AI-3.4 deliverables

- `packages/tau-ai/src/catalog/` — open model catalog (family/runtime/substrate)
- `src/lib/ai-gateway/inference-requirements.ts` — verified requirement presets
- `packages/tau-ai/src/hardware/macos-detector.ts` — truthful macOS detection
- `scripts/verify-tau-ai-ai3-4.sh` — expanded validation matrix
- `docs/tau-foundation-model-track.md` — TF-0 through TF-8 planning
- `docs/tau-dataset-provenance-principle.md`
- `docs/ai-3.4-substrate-enrichment.md`

### AI-3.3 deliverables

- `packages/tau-ai/src/hardware/` — HardwareProfile, HardwareDetector, compatibility filter
- `packages/tau-ai/src/routing/hardware-filter.ts` — router integration
- Shadow metrics (legacy vs Tau routing agreement)
- `scripts/verify-tau-ai-ai3-3.sh`
- `docs/ai-3.3-hardware-aware-routing.md`

### AI-3.2 deliverables

- `packages/tau-ai/src/routing/deterministic-router.ts` — deterministic ModelRouter
- `packages/tau-ai/src/routing/filters.ts` — privacy, availability, capability filters
- `packages/tau-ai/src/routing/ranking.ts` — cost/latency/priority ranking
- `packages/tau-ai/src/routing/shadow.ts` — shadow mode logging
- `src/lib/tau-ai/shadow-routing.ts` — gateway shadow integration
- `scripts/verify-tau-ai-ai3-2.sh` — 15-scenario test matrix
- `docs/ai-3.2-deterministic-router.md`

### AI-3.1 deliverables (Tau Foundation v0.1)

- `packages/tau-ai/src/models/metadata.ts` — privacy, availability, health, cost, latency, provenance
- `packages/tau-ai/src/models/tau-foundation-substrate.ts` — future Tau Foundation Model placeholder
- `src/lib/ai-gateway/substrate-metadata.ts` — provider metadata declarations
- `docs/tau-foundation-v0.1-architecture.md`
- `docs/ai-3.1-model-substrate-metadata.md`
- `docs/tau-ai-model-catalog.md`
- `scripts/verify-tau-ai-ai3-1.sh`

### AI-3.0 deliverables

- `packages/tau-ai/src/capabilities/` — capability types, registry, defaults
- `docs/tau-ai-capability-registry.md`
- `scripts/verify-tau-ai-ai3-0.sh`

### AI-2 deliverables

- `src/lib/ai-gateway/substrate-bridge.ts` — `AiProviderAdapter` → `ModelSubstrate`
- `src/lib/ai-gateway/substrate-registry.ts` — substrate registry (wraps existing registry)
- `src/lib/ai-gateway/prompts.ts` — product prompts separated (strings unchanged)
- `src/lib/ai-gateway/providers/vllm-stub.ts` — vLLM stub (not routed)
- `src/lib/tau-ai/` — `GatewayIntelligenceService`, `PassthroughModelRouter`, `GatewayTauAIClient`
- `scripts/verify-tau-ai-ai2.sh` + `scripts/tau-ai-ai2-regression.ts`
- `docs/ai-2-model-substrate-integration.md`

### AI-1 deliverables

- `packages/tau-ai/` — `@tau/ai` interfaces (IntelligenceService, MemoryStore, ModelRouter, Constitution, ToolRegistry, ExecutionAdapter, TauAIClient, ModelSubstrate)
- `scripts/verify-tau-ai-core.sh` — package + regression checks
- `docs/ai-1-core-interface-scaffold.md` — AI-1 contract reference

### Documentation

- `docs/tau-ai-architecture.md` — audit + proposed architecture + migration
- `docs/ai-1-core-interface-scaffold.md` — AI-1 interfaces + AI-2 requirements
- `docs/ai-2-model-substrate-integration.md` — AI-2 substrate integration
- `docs/tau-ai-model-strategy.md`
- `docs/tau-ai-provider-architecture.md`
- `docs/tau-ai-memory-architecture.md`
- `docs/tau-ai-tool-architecture.md`
- `docs/tau-ai-grayscale-boundary.md`

---

## Shelved — Mobile OS (Track A)

**Status:** ⏸ Paused — Figma screen extraction issues; resume planned

M7 Tau Launcher work preserved in repo but **frozen**. Do not modify until explicitly resumed.

Previous checkpoint: `mobile/M7-RESUME-CHECKPOINT.md`, `docs/m7-launcher-prototype.md`

---

## Track B — Build portability

| Item | Status |
|------|--------|
| Provider-independent build strategy | ✅ Documented |
| Build server portability guide | ✅ Documented |
| Cloud / CI | ⏸ Founder arranging cloud space |

---

## Completed (historical)

- M5.1 Compatibility Platform ✅
- M6 Tau Core Services ✅
- M7.0–M7.1 Tau Launcher scaffold (shelved) 🔄

---

**Next action:** Review AI-0 docs → approve AI-1 → implement `packages/tau-ai/` interfaces only.
