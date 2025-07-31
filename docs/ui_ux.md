# Tau OS UI/UX Design Language

Tau OS delivers a unique, minimalist, and calming user interface for modern devices.

## 🎨 Design Principles
- **Dark-first, OLED-friendly:** Black & Gold palette, high contrast, low power
- **Minimalism:** Clean layouts, purposeful whitespace, no visual clutter
- **Glassmorphism:** Subtle blur, transparency, and depth
- **Rounded Edges:** All UI elements have soft, rounded corners
- **Text-based Fallback:** Every UI action is accessible via keyboard and text
- **Accessibility:** High-contrast, screen reader support, scalable fonts
- **Localization:** All UI strings are translatable

## 🖥 UI Layers
- **Shell:** Sway or Weston with GTK Layer Shell for overlays
- **Launcher:** Tau Launcher (fast, minimal, GNOME-inspired)
- **App UI Kit:** TauKit (GTK + CSS + animation presets)

## 🖋 Fonts
- **Primary:** Inter, Roboto, or Noto Sans
- **Monospace:** JetBrains Mono, Fira Mono
- **Font Sizes:**
  - Title: 22-28px
  - Body: 14-18px
  - Caption: 12-14px

## 📏 Spacing
- **Padding:** 16px standard, 8px for compact elements
- **Margin:** 24px between major sections, 12px between related items
- **Border Radius:** 12px for cards, 8px for buttons/inputs

## 🌈 Color Palette
- **Background:** #101010 (black)
- **Accent:** #FFD700 (gold)
- **Surface:** #181818 (dark gray, glassy)
- **Text:** #F5F5F5 (primary), #FFD700 (accent)
- **Error:** #FF5555
- **Success:** #44FF99

## ✨ Animation
- **Duration:** 120-200ms (fast, but not jarring)
- **Easing:** cubic-bezier(0.4, 0.0, 0.2, 1)
- **Effects:** Fade, slide, scale, glass blur transitions

## ♿ Accessibility
- All actions available via keyboard
- High-contrast mode toggle
- ARIA labels and screen reader support
- Scalable UI for low vision

## 🌍 Localization
- All UI strings in translation files
- RTL language support

---

**Tau OS: Minimal, Fast, Calming, and Accessible.** 