import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg0':      '#02050f',
        'bg1':      '#050d1e',
        'bg2':      '#0a1628',
        'indigo1':  '#1a3fa0',
        'indigo2':  '#3a6fd8',
        'purple1':  '#7c4dff',
        'purple2':  '#b388ff',
        'rose1':    '#ff6b9d',
        'rose2':    '#ffb3ce',
        'gold1':    '#ffd700',
        'gold2':    '#ffe55c',
      },
      fontFamily: {
        serif:   ['"Playfair Display"', 'Georgia', 'serif'],
        sans:    ['Montserrat', 'sans-serif'],
        script:  ['"Great Vibes"', 'cursive'],
        dancing: ['"Dancing Script"', 'cursive'],
      },
      keyframes: {
        iconFloat: {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%':      { transform: 'translateY(-6px) scale(1.08)' },
        },
        shimmerSweep: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        heartBurst: {
          '0%':   { transform: 'translateY(0) scale(0)', opacity: '1' },
          '50%':  { opacity: '1' },
          '100%': { transform: 'translateY(-100px) scale(1.5)', opacity: '0' },
        },
        flickerF: {
          '0%':   { transform: 'translateX(-50%) scale(1) rotate(-4deg)' },
          '50%':  { transform: 'translateX(-50%) scale(0.92, 1.08) rotate(-2deg)' },
          '100%': { transform: 'translateX(-50%) scale(1.04) rotate(5deg)' },
        },
      },
      animation: {
        'icon-float':   'iconFloat 3s ease-in-out infinite',
        'heart-burst':  'heartBurst 1.2s ease-out forwards',
        'flicker':      'flickerF 0.4s ease-in-out infinite alternate',
      },
    },
  },
  plugins: [],
};

export default config;
