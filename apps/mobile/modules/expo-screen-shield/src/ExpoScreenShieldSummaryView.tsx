import { requireNativeViewManager } from 'expo-modules-core';
import type { ComponentType } from 'react';
import type { ExpoScreenShieldSummaryViewProps } from './ExpoScreenShield.types';

let NativeView: ComponentType<ExpoScreenShieldSummaryViewProps> | null = null;
try {
  NativeView = requireNativeViewManager<ExpoScreenShieldSummaryViewProps>('ExpoScreenShieldSummary');
} catch {
  NativeView = null;
}

/** Renders real Apple-provided app icons for a Block Mode selection token.
 * Renders nothing when the native view isn't linked — callers should pair
 * this with their own fallback (e.g. an app-count chip) using
 * `isDevStubActive` from `ExpoScreenShieldModule`. */
export default function ExpoScreenShieldSummaryView(props: ExpoScreenShieldSummaryViewProps) {
  if (!NativeView) return null;
  return <NativeView {...props} />;
}
