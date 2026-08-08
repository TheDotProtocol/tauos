# AI-10 — Tau AI Voice

**Milestone:** AI-10 Batch 1  
**Status:** Complete — STOP (await review before AI-11)  
**Verification:** `./scripts/verify-tau-ai-ai10.sh`

---

## Objective

Turn the Figma voice UI from a demo surface into a **governed backend capability** using existing `SPEECH_TO_TEXT` and `TEXT_TO_SPEECH` capabilities — without a second voice architecture.

---

## Pipeline

```
VOICE INPUT (browser MediaRecorder)
    ↓
STT SUBSTRATE (OpenAI Whisper if configured, else browser SpeechRecognition)
    ↓
POST /api/tau-foundation/voice  (requires Tau ID session)
    ↓
TauFoundationClient → TauFoundationPipeline
    ↓
Constitution → Memory → Router → Model substrate
    ↓
TEXT RESPONSE
    ↓
TTS (browser SpeechSynthesis — client-side in v0.1)
```

Production path **unchanged:** `/api/tauai/voice` → `runAiChat()` (legacy beta API).

Product path **new:** `/api/tau-foundation/voice` → `TauFoundationClient`.

---

## Verification levels (honest reporting)

| Layer | Typical level | Notes |
|-------|---------------|-------|
| UI | `UI_VERIFIED` | Figma overlay + voice page wired |
| STT adapter | `ADAPTER_VERIFIED` | Always — fallback path exists |
| STT live | `LIVE_MODEL_VERIFIED` | Only when Whisper returns transcription |
| Foundation | `ADAPTER_VERIFIED` / `END_TO_END_VERIFIED` | When Foundation returns response |
| TTS | `ADAPTER_VERIFIED` | Client SpeechSynthesis only |
| End-to-end | `END_TO_END_VERIFIED` | STT live + Foundation response + TTS hint |

Check live status: `GET /api/tau-foundation/voice`

---

## Files

| Area | Path |
|------|------|
| Types | `src/lib/tau-ai-app/voice-types.ts` |
| STT/TTS adapters | `src/lib/tau-ai-app/voice-adapters.ts` |
| Orchestration | `src/lib/tau-ai-app/voice-service.ts` |
| Product API | `src/app/api/tau-foundation/voice/route.ts` |
| Browser client | `src/lib/tau-ai-app/voice-client.ts` |
| React hook | `src/lib/tau-ai-app/useTauAiVoice.ts` |
| UI | `TauAiVoiceOverlay.tsx`, `TauAiVoicePage.tsx` |
| Tests | `scripts/test-voice-ai10.ts` |

---

## Privacy & boundaries

- API keys remain **server-side** — never exposed to client
- Whisper is a **third-party substrate** — not Tau-owned
- No fabricated live voice when STT/TTS unavailable — safe fallbacks
- Figma UI preserved — no redesign

---

## Not in this batch

- Server-side TTS substrate
- Local-only Whisper / on-device STT
- AI-11 ecosystem integrations
- TF-0 model research docs

**STOP** — await approval before AI-11.
