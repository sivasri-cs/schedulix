/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'osnova-bg': '#f8fafc',
        'osnova-surface': '#ffffff',
        'osnova-card': '#ffffff',
        'neon-cyan': '#0ea5e9', // Corporate Blue
        'neon-purple': '#6366f1', // Indigo
        'neon-magenta': '#8b5cf6', // Violet
        'neon-green': '#10b981', // Emerald
        'neon-orange': '#f59e0b', // Amber
        'neon-pink': '#ec4899', // Pink
        'neon-blue': '#2563eb', // Blue
        'glass-bg': '#ffffff',
        'glass-border': '#e2e8f0',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'neon-cyan': '0 4px 6px -1px rgba(14, 165, 233, 0.1), 0 2px 4px -1px rgba(14, 165, 233, 0.06)',
        'neon-purple': '0 4px 6px -1px rgba(99, 102, 241, 0.1), 0 2px 4px -1px rgba(99, 102, 241, 0.06)',
        'neon-green': '0 4px 6px -1px rgba(16, 185, 129, 0.1), 0 2px 4px -1px rgba(16, 185, 129, 0.06)',
        'neon-magenta': '0 4px 6px -1px rgba(139, 92, 246, 0.1), 0 2px 4px -1px rgba(139, 92, 246, 0.06)',
        'glass': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)',
      },
      animation: {
        'glow-pulse': 'none',
        'float': 'none',
        'gradient-shift': 'none',
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'spin-slow': 'spin 8s linear infinite',
        'pulse-neon': 'none',
        'typing': 'typing 3.5s steps(40, end)',
      },
      keyframes: {
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        typing: {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
      },
    },
  },
  plugins: [],
}
