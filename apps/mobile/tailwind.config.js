/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Design tokens from docs/FOCUS-project-description.md §4
        // Dark + Cobalt system, revised 30 Jul 2026
        background: '#03060d',
        surface: '#0e1626',
        text: '#F3F6FB',
        textMuted: '#7C8AA6',
        border: 'rgba(255,255,255,0.08)',
        primary: '#3B82F6',
        success: '#34D399',
        strength: '#F87171',
        discipline: '#8FA2C9',
        focus: '#60A5FA',
        wisdom: '#818CF8',
        confidence: '#FBBF24',
      },
      fontFamily: {
        // Reserved for headlines/big numbers (day counter, XP, level-up) —
        // docs/FOCUS-project-description.md §4. Body text stays system font.
        display: ['Nunito_800ExtraBold'],
        'display-bold': ['Nunito_700Bold'],
      },
    },
  },
  plugins: [],
};
