import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-0': 'var(--bg-0)',
        'bg-1': 'var(--bg-1)',
        'bg-2': 'var(--bg-2)',
        'ink-0': 'var(--ink-0)',
        'ink-1': 'var(--ink-1)',
        'ink-2': 'var(--ink-2)',
        line: 'var(--line)',
        accent: 'var(--accent)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        display: ['var(--font-display)'],
      },
      maxWidth: {
        shell: '1240px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(30, 41, 59, 0.06), 0 8px 24px rgba(30, 41, 59, 0.04)',
        lift: '0 2px 4px rgba(30, 41, 59, 0.06), 0 18px 40px rgba(30, 41, 59, 0.08)',
      },
      transitionTimingFunction: {
        mountain: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        fog: {
          '0%, 100%': { transform: 'translate3d(-2%, 0, 0)', opacity: '0.42' },
          '50%': { transform: 'translate3d(2%, -1%, 0)', opacity: '0.62' },
        },
        pulseRing: {
          '0%': { transform: 'scale(0.8)', opacity: '0.55' },
          '70%': { transform: 'scale(1.7)', opacity: '0' },
          '100%': { transform: 'scale(1.7)', opacity: '0' },
        },
        drift: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(6px)' },
        },
      },
      animation: {
        fog: 'fog 18s ease-in-out infinite',
        pulseRing: 'pulseRing 2.6s ease-out infinite',
        drift: 'drift 2.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
