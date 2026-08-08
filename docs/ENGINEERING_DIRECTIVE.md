# Tau Core Mobile Beta — Engineering Directive v1.0

**Status:** Active — supersedes enterprise/cloud-first assumptions  
**Applies to:** All mobile beta milestones until explicitly revised

---

## Stage

Building the **first usable Tau Core Mobile Beta** — not enterprise infrastructure.

---

## Team

| Now | Future |
|-----|--------|
| Founder (1) | Max 2–3 internal testers |
| Cursor AI | |
| ChatGPT (architecture) | |

Do **not** design for a large organisation.

---

## Approved workflow (only)

```
MacBook Pro
  → Docker Desktop
  → Cursor
  → Android Studio Emulator
  → GitHub
  → Redmi Note 9 Pro
  → 3–4 internal test devices
```

**Deferred until funding / investment / larger team:** cloud build servers, cloud CI/CD, artifact clusters, Kubernetes, Jenkins, complex DevOps.

---

## Docker

**Mandatory** — consistent, reproducible tooling.  
**Not** a massive build farm. Keep images simple and maintainable.

---

## GitHub

Source, issues, documentation, milestones, releases. Lightweight only.

---

## Test devices (only these four)

1. **Redmi Note 9 Pro** — primary development device  
2. Vivo device  
3. Samsung mid-range  
4. Samsung flagship  

No additional targets until post-Beta.

---

## Release cycle

**60 days** — not weekly, fortnightly, or nightly.

```
Development → Internal testing → Bug fixes → RC → Beta release → (next 60-day cycle)
```

---

## Frontend

Figma designs are **approved**. Implement pixel-perfect. Do **not** redesign.

[Tau Core Mobile OS UI](https://www.figma.com/design/SyttNz970dAe4MSnkrCxdw/Tau-Core-Mobile-OS-UI)

---

## Priorities

1. Stable Tau Core Mobile Beta  
2. Android Studio Emulator  
3. Redmi Note 9 Pro deployment  
4. Remaining 3 reference devices  
5. Bug fix & optimisation  
6. Additional infrastructure — **only after** the above  

---

## Architecture (unchanged)

```
Tau Apps → Tau Runtime → Tau System Services → Compatibility Layer → AOSP → Linux
```

Native Tau Core Mobile OS remains the long-term goal. Beta is a bridge. Minimise migration cost.

---

## Decision rule

When two solutions are valid, **choose the simpler** unless the complex option gives a **clear, immediate** benefit to the **current milestone**.

---

## Philosophy

Clean architecture · maintainable code · simple infrastructure · build only what is required today · no premature optimisation · no enterprise complexity.

Optimise for: one founder, small test group, high-quality Beta every **60 days**.
