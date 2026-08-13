import { requireNativeViewManager } from 'expo-modules-core';
import type { ComponentType } from 'react';
import type { ExpoScreenShieldPickerViewProps } from './ExpoScreenShield.types';

let NativeView: ComponentType<ExpoScreenShieldPickerViewProps> | null = null;
try {
  NativeView = requireNativeViewManager<ExpoScreenShieldPickerViewProps>('ExpoScreenShieldPicker');
} catch {
  NativeView = null;
}

/** Hosts Apple's native FamilyActivityPicker. Renders nothing (parent screen
 * shows the dev-preview fallback state) when the native view isn't linked —
 * see `isDevStubActive` in `ExpoScreenShieldModule.ts` for the JS-only path. */
export default function ExpoScreenShieldPickerView(props: ExpoScreenShieldPickerViewProps) {
  if (!NativeView) return null;
  return <NativeView {...props} />;
}
