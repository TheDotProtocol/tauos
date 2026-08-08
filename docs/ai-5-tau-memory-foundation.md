# AI-5 — Tau Memory Foundation

**Milestone:** AI-5 (Tau Foundation v0.1)  
**Status:** Complete  
**Verification:** MEMORY FOUNDATION VALIDATED

---

## Summary

Implemented the governed Tau Memory foundation — structured records, explicit/inferred distinction, constitution-aware writes, retention/scope models, deterministic retrieval, and in-memory replaceable storage. No vector database, no external memory services, no production cutover.

---

## Architecture

```
TauAIClient (future)
    ↓
MemoryStore / TauMemoryFoundation
    ↓
Memory Policy (Constitution)
    ↓
Memory Records
    ↓
Future persistence adapters
        ├── LocalMemoryAdapter (AI-5: in-memory)
        ├── DatabaseMemoryAdapter (future)
        ├── VectorMemoryAdapter (future)
        └── TauCloudMemoryAdapter (future)
```

Memory does **not** choose models. Flow remains:

```
Memory → Context → Constitution → Router → Model Substrate
```

---

## Memory categories

| Category | Purpose |
|----------|---------|
| CONVERSATION_MEMORY | Short-term conversational context |
| PREFERENCE_MEMORY | Explicit user preferences |
| PROFILE_MEMORY | User-allowed stable profile information |
| KNOWLEDGE_MEMORY | Durable user-provided facts/documents |
| TASK_MEMORY | Ongoing task/project continuity |
| SYSTEM_CONTEXT | Non-user operational context |

---

## Memory record fields

`id`, `category`, `content`, `reference`, `source`, `originKind`, `createdAt`, `updatedAt`, `expiresAt`, `importance`, `confidence`, `provenance`, `scope`, `privacyClass`, `retentionPolicy`, `consentState`, `tags`, `version`, plus optional `userId`, `projectId`, `productId`, `sessionId`.

---

## Explicit vs inferred

| Kind | Behaviour |
|------|-----------|
| **EXPLICIT** | User asked to remember or provided stable retention intent |
| **INFERRED** | Derived from conversation — **not** auto-persisted durably without consent |

Inferred + durable retention → `REQUIRES_CONFIRMATION` unless `consentState: GRANTED`.

External source + non-SESSION retention → `REQUIRES_CONFIRMATION`.

---

## Retention policies

| Policy | Meaning |
|--------|---------|
| SESSION | Session-scoped |
| SHORT_TERM | Ephemeral (hours–days) |
| LONG_TERM | Durable user memory |
| UNTIL_EXPIRY | Valid until `expiresAt` |
| USER_CONTROLLED | User-managed durable preference |

Expired records are excluded from reads; not silently extended.

---

## Scope model

| Scope | Example |
|-------|---------|
| SESSION | Current conversation |
| USER | User preferences |
| PROJECT | Project architecture notes |
| PRODUCT | Product-specific context |
| SYSTEM | Tau-wide operating requirements |

PROJECT memory cannot silently promote to SYSTEM scope.

---

## Memory authority hierarchy

1. Constitution  
2. System policy  
3. Current explicit user instruction  
4. User explicit memory  
5. Project memory  
6. Inferred context  
7. External content  

Memory is context — not authority above constitutional rules.

---

## Constitution integration

```
Memory Write Request
        ↓
evaluateMemoryWriteGovernance()
        ↓
Constitution.evaluateMemoryWrite()
        ↓
PASS / WARN / BLOCK
        ↓
MemoryStore.write()
```

Write outcomes: `STORED`, `REJECTED`, `EXPIRED`, `DUPLICATE`, `REQUIRES_CONFIRMATION`.

---

## Privacy behaviour

- `LOCAL_ONLY` rejects memory with `privacyClass: REMOTE_ALLOWED`
- Memory content is **never** written to audit logs
- Audit logs contain metadata only: `memoryId`, `category`, `operation`, `policyResult`

---

## Operations

| Operation | API |
|-----------|-----|
| Write | `requestMemoryWrite()` |
| Read | `getRecord()`, `listRecords()`, `queryRecords()` |
| Relevance | `findRelevant()` — deterministic keyword scoring |
| Update | `updateRecord()` — version increment, supersede on conflict |
| Delete | `deleteRecord()`, `deleteByCategory()`, `deleteByScope()`, `clearUserMemory()` |

---

## Conflict resolution

Deterministic — no LLM judge:

- Newer explicit beats older
- Explicit beats inferred
- Same `preferenceKey` tag → supersede, not duplicate
- Current explicit instruction outranks stored memory

---

## Future boundaries

| Future | Boundary |
|--------|----------|
| Semantic retrieval | `SemanticRetrievalAdapter` interface — not implemented |
| Tau Foundation Model | Same `TauMemoryFoundation` abstraction |
| Grayscale/ATHENA | Future scopes (COMPANY, EXECUTIVE, …) — documented only |
| Tau products | Shared memory engine — product-specific scopes only |

---

## Known limitations

- In-memory storage only — replaceable, not production persistence
- No embeddings or vector search
- No production wiring to `/api/tauai/chat`
- No memory UI ("Show me what Tau remembers")
- Relevance is keyword-based, not semantic

---

## Verification

```bash
./scripts/verify-tau-ai-ai5.sh
```

---

## AI-6 recommendation

**AI-6 — Tool registry foundation**: implement governed `ToolRegistry` with constitution-aware tool authorization, confirmation gates, and execution policy — preparing for tool use without production cutover.

---

## Related

- `docs/ai-4-tau-constitution.md`
- `docs/tau-foundation-v0.1-architecture.md`
