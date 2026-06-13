/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        trough: {
          bg: '#080810',
          surface: '#0f0f1a',
          card: '#141420',
          border: '#1e1e30',
          purple: '#7c3aed',
          'purple-light': '#a855f7',
          green: '#10b981',
          red: '#ef4444',
          gold: '#f59e0b',
          muted: '#6b7280',
          text: '#e2e8f0',
          'text-dim': '#94a3b8',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'ticker-scroll': 'ticker-scroll 30s linear infinite',
        'pig-wobble': 'pig-wobble 2s ease-in-out infinite',
        'mud-bubble': 'mud-bubble 1.5s ease-in-out infinite',
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'slide-up': 'slide-up 0.5s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'ticker-scroll': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'pig-wobble': {
          '0%, 100%': { transform: 'rotate(-4deg) scale(1)' },
          '50%': { transform: 'rotate(4deg) scale(1.05)' },
        },
        'mud-bubble': {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '0.8' },
          '100%': { transform: 'translateY(-30px) scale(0)', opacity: '0' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
