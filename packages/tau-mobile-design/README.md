# @tau/mobile-design

Shared Tau Mobile design tokens — **Figma is the source of truth**.

**Figma file:** [Tau Core Mobile OS UI](https://www.figma.com/design/SyttNz970dAe4MSnkrCxdw/Tau-Core-Mobile-OS-UI)

## Usage

```typescript
import { tauTheme } from '@tau/mobile-design';

// Always reference tokens — never hardcode colors, spacing, etc.
const { colors, spacing, typography, radii, shadows, motion } = tauTheme;
```

## Token categories

| Module | Contents |
|--------|----------|
| `colors` | Background gradient, primary, text, glass surfaces |
| `typography` | Time, widgets, nav, FAB |
| `spacing` | Screen padding, gaps, FAB offsets |
| `radii` | Widget, FAB corners |
| `shadows` | Glass cards, FAB glow |
| `motion` | Durations, spring, scale |
| `blur` | Glassmorphism blur radii |

## Verify

```bash
npm run typecheck
```
