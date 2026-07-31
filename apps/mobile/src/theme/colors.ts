// Mirrors apps/mobile/tailwind.config.js — for contexts that need raw hex
// (icon `color` props, ActivityIndicator, inline Animated styles) rather
// than a NativeWind className.
export const colors = {
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
} as const;
