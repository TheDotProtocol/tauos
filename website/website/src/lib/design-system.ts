// TauOS Design System
// Professional, modern, GitHub-like interface with privacy-first branding

export const colors = {
  // Primary Colors
  primary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#8b5cf6', // Electric Purple - Main accent
    600: '#7c3aed',
    700: '#6d28d9',
    800: '#5b21b6',
    900: '#4c1d95',
  },
  
  // Background Colors
  background: {
    primary: '#0a0a0a',    // Matte Black
    secondary: '#1a1a1a',  // Dark Gray
    tertiary: '#262626',   // Lighter Gray
    card: '#1f1f1f',       // Card Background
    hover: '#2a2a2a',      // Hover State
  },
  
  // Text Colors
  text: {
    primary: '#ffffff',    // White
    secondary: '#a1a1aa',  // Light Gray
    tertiary: '#71717a',   // Medium Gray
    muted: '#52525b',      // Muted Gray
  },
  
  // Status Colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  
  // Border Colors
  border: {
    primary: '#374151',
    secondary: '#4b5563',
    accent: '#8b5cf6',
  }
} as const;

export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'Consolas', 'monospace'],
  },
  
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
  },
  
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  }
} as const;

export const spacing = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
} as const;

export const borderRadius = {
  none: '0',
  sm: '0.25rem',   // 4px
  md: '0.5rem',    // 8px
  lg: '0.75rem',   // 12px
  xl: '1rem',      // 16px
  '2xl': '1.5rem', // 24px
  full: '9999px',
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  purple: '0 0 20px rgb(139 92 246 / 0.3)',
  purpleLg: '0 0 40px rgb(139 92 246 / 0.4)',
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Component-specific design tokens
export const components = {
  button: {
    primary: {
      background: colors.primary[500],
      backgroundHover: colors.primary[600],
      text: colors.text.primary,
      borderRadius: borderRadius.lg,
      padding: `${spacing[3]} ${spacing[6]}`,
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
    },
    secondary: {
      background: colors.background.card,
      backgroundHover: colors.background.hover,
      text: colors.text.primary,
      border: `1px solid ${colors.border.primary}`,
      borderRadius: borderRadius.lg,
      padding: `${spacing[3]} ${spacing[6]}`,
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
    }
  },
  
  card: {
    background: colors.background.card,
    borderRadius: borderRadius.xl,
    padding: spacing[6],
    border: `1px solid ${colors.border.primary}`,
    shadow: shadows.md,
  },
  
  input: {
    background: colors.background.secondary,
    border: `1px solid ${colors.border.primary}`,
    borderRadius: borderRadius.lg,
    padding: `${spacing[3]} ${spacing[4]}`,
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
    placeholder: colors.text.tertiary,
  }
} as const;
