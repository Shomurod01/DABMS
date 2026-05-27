/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary:   '#0d9488', // Teal-600 — modern medical
        secondary: '#0f766e', // Teal-700 — hover
        accent:    '#2563eb', // Blue-600 — supporting accent
        dark:      '#0f172a', // Slate-900 — body text
        surface:   '#ffffff', // Pure white — cards
        muted:     '#64748b', // Slate-500 — secondary text
        border:    '#e2e8f0', // Slate-200 — borders
        bg:        '#f8fafc', // Slate-50 — page background
      },
      fontFamily: {
        display: ['"DM Serif Display"', 'serif'],
        body:    ['"DM Sans"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'fade-in':    'fadeIn 0.5s ease forwards',
        'slide-up':   'slideUp 0.4s ease forwards',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
};
