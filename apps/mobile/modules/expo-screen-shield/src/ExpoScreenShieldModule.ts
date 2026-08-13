import { requireNativeModule } from 'expo-modules-core';
import { Platform } from 'react-native';
import type { ShieldAuthorizationStatusValue } from './ExpoScreenShield.types';

interface NativeExpoScreenShield {
  requestAuthorization(): Promise<string>;
  getAuthorizationStatus(): Promise<string>;
  applyShield(selectionToken: string): Promise<void>;
  clearShield(): Promise<void>;
  isShieldActive(): Promise<boolean>;
}

/** Dev-only stand-in so every Screen Blocker screen is walkable in Simulator
 * or before `expo prebuild` has ever run, without the real native module
 * being linked. Never used outside `__DEV__` — production builds that lack
 * the real module fall through to `unavailable`, not a fake "approved". */
const devStub: NativeExpoScreenShield = {
  async requestAuthorization() {
    console.warn('[expo-screen-shield] dev stub: requestAuthorization → approved');
    return 'approved';
  },
  async getAuthorizationStatus() {
    return 'approved';
  },
  async applyShield() {
    console.warn('[expo-screen-shield] dev stub: applyShield (no-op)');
  },
  async clearShield() {
    console.warn('[expo-screen-shield] dev stub: clearShield (no-op)');
  },
  async isShieldActive() {
    return false;
  },
};

function loadNativeModule(): NativeExpoScreenShield | null {
  if (Platform.OS !== 'ios') return null;
  try {
    return requireNativeModule<NativeExpoScreenShield>('ExpoScreenShield');
  } catch {
    return null;
  }
}

const native = loadNativeModule();
const isStubbed = __DEV__ && !native;

function backing(): NativeExpoScreenShield | null {
  if (native) return native;
  if (isStubbed) return devStub;
  return null;
}

/** True when Screen Blocker's Block Mode screens are running against the
 * dev-only stub rather than the real native module — surfaced so UI can show
 * a small "dev preview" badge instead of implying a real device was tested. */
export const isDevStubActive = isStubbed;

function toStatus(raw: string): ShieldAuthorizationStatusValue {
  return raw === 'approved' || raw === 'denied' || raw === 'notDetermined' ? raw : 'unavailable';
}

export async function requestAuthorization(): Promise<ShieldAuthorizationStatusValue> {
  const mod = backing();
  if (!mod) return 'unavailable';
  try {
    return toStatus(await mod.requestAuthorization());
  } catch {
    return 'unavailable';
  }
}

export async function getAuthorizationStatus(): Promise<ShieldAuthorizationStatusValue> {
  const mod = backing();
  if (!mod) return 'unavailable';
  try {
    return toStatus(await mod.getAuthorizationStatus());
  } catch {
    return 'unavailable';
  }
}

export async function applyShield(selectionToken: string): Promise<boolean> {
  const mod = backing();
  if (!mod) return false;
  try {
    await mod.applyShield(selectionToken);
    return true;
  } catch {
    return false;
  }
}

export async function clearShield(): Promise<boolean> {
  const mod = backing();
  if (!mod) return false;
  try {
    await mod.clearShield();
    return true;
  } catch {
    return false;
  }
}

export async function isShieldActive(): Promise<boolean> {
  const mod = backing();
  if (!mod) return false;
  try {
    return await mod.isShieldActive();
  } catch {
    return false;
  }
}
