import React from 'react'

// TauOS Design System - Futuristic Minimalist Theme
export const TauOSTheme = {
  colors: {
    // Primary Colors
    primary: {
      50: '#f5f3ff',
      100: '#ede9fe',
      200: '#ddd6fe',
      300: '#c4b5fd',
      400: '#a78bfa',
      500: '#8b5cf6', // Electric Purple
      600: '#7c3aed',
      700: '#6d28d9',
      800: '#5b21b6',
      900: '#4c1d95',
    },
    // Neutral Colors
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717', // Matte Black
    },
    // Accent Colors
    accent: {
      blue: '#3b82f6',
      green: '#10b981',
      red: '#ef4444',
      yellow: '#f59e0b',
      cyan: '#06b6d4',
    },
    // Background Colors
    background: {
      primary: '#0a0a0a', // Deep Black
      secondary: '#111111',
      tertiary: '#1a1a1a',
      card: '#1f1f1f',
      overlay: 'rgba(0, 0, 0, 0.8)',
    },
    // Text Colors
    text: {
      primary: '#ffffff',
      secondary: '#a3a3a3',
      tertiary: '#737373',
      inverse: '#000000',
    },
    // Gradient Colors
    gradients: {
      primary: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
      secondary: 'linear-gradient(135deg, #1f1f1f 0%, #2d2d2d 100%)',
      glow: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
    }
  },
  typography: {
    fontFamily: {
      sans: ['SF Pro Display', 'Poppins', 'system-ui', 'sans-serif'],
      mono: ['SF Mono', 'Monaco', 'Consolas', 'monospace'],
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    }
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    glow: '0 0 20px rgba(139, 92, 246, 0.3)',
    'glow-lg': '0 0 40px rgba(139, 92, 246, 0.4)',
  },
  animations: {
    fadeIn: 'fadeIn 0.3s ease-in-out',
    slideUp: 'slideUp 0.3s ease-out',
    pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    glow: 'glow 2s ease-in-out infinite alternate',
  }
}

// CSS Animations
export const TauOSAnimations = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  @keyframes glow {
    from { box-shadow: 0 0 20px rgba(139, 92, 246, 0.3); }
    to { box-shadow: 0 0 40px rgba(139, 92, 246, 0.6); }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes shimmer {
    0% { background-position: -200px 0; }
    100% { background-position: calc(200px + 100%) 0; }
  }
`

// TauOS Button Component
export const TauOSButton: React.FC<{
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  className?: string
  onClick?: () => void
  disabled?: boolean
}> = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '',
  onClick,
  disabled = false
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900'
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-glow hover:shadow-glow-lg hover:scale-105 focus:ring-primary-500',
    secondary: 'bg-neutral-800 text-neutral-100 border border-neutral-700 hover:bg-neutral-700 hover:border-neutral-600 focus:ring-neutral-500',
    ghost: 'text-neutral-300 hover:text-white hover:bg-neutral-800 focus:ring-neutral-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`
  
  return (
    <button className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}

// TauOS Card Component
export const TauOSCard: React.FC<{
  children: React.ReactNode
  className?: string
  glow?: boolean
}> = ({ children, className = '', glow = false }) => {
  const baseClasses = 'bg-background-card border border-neutral-800 rounded-xl p-6 shadow-lg'
  const glowClasses = glow ? 'shadow-glow' : ''
  
  return (
    <div className={`${baseClasses} ${glowClasses} ${className}`}>
      {children}
    </div>
  )
}

// TauOS Icon Component
export const TauOSIcon: React.FC<{
  icon: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}> = ({ icon, size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  }
  
  return (
    <div className={`${sizes[size]} text-neutral-300 ${className}`}>
      {icon}
    </div>
  )
}

export default TauOSTheme 