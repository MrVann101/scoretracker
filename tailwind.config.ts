import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0a192f',
        gold: '#D4AF37',
        'gold-2': '#f0d58a',
        ink: '#E8F0FF',
        muted: 'rgba(232, 240, 255, 0.75)',
        card: 'rgba(255, 255, 255, 0.03)',
        border: 'rgba(212, 175, 55, 0.55)',
        'border-strong': 'rgba(212, 175, 55, 0.9)',
      },
      fontFamily: {
        cinzel: ['Cinzel', 'ui-serif', 'Georgia', 'serif'],
      },
      boxShadow: {
        custom: '0 18px 40px rgba(0,0,0,0.35)',
      },
    },
  },
  plugins: [],
};

export default config;
