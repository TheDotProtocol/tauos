import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // TauOS Brand Colors
        primary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#8b5cf6', // Electric Purple
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        background: {
          primary: '#0a0a0a',    // Matte Black
          secondary: '#1a1a1a',  // Dark Gray
          tertiary: '#262626',   // Lighter Gray
          card: '#1f1f1f',       // Card Background
          hover: '#2a2a2a',      // Hover State
        },
        text: {
          primary: '#ffffff',    // White
          secondary: '#a1a1aa',  // Light Gray
          tertiary: '#71717a',   // Medium Gray
          muted: '#52525b',      // Muted Gray
        },
        border: {
          primary: '#374151',
          secondary: '#4b5563',
          accent: '#8b5cf6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-purple': 'pulsePurple 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulsePurple: {
          '0%, 100%': { boxShadow: '0 0 20px rgb(139 92 246 / 0.3)' },
          '50%': { boxShadow: '0 0 40px rgb(139 92 246 / 0.6)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'purple': '0 0 20px rgb(139 92 246 / 0.3)',
        'purple-lg': '0 0 40px rgb(139 92 246 / 0.4)',
      }
    },
  },
  plugins: [],
};

export default config;