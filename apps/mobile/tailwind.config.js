/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Design tokens from docs/FOCUS-project-description.md §4
        background: '#FAF9F6',
        text: '#292524',
        primary: '#F97316',
        success: '#16A34A',
        strength: '#DC2626',
        discipline: '#334155',
        focus: '#2563EB',
        wisdom: '#7C3AED',
        confidence: '#D97706',
        surface: '#FFFFFF',
      },
    },
  },
  plugins: [],
};
