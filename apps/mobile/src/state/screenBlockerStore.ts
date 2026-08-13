import * as SecureStore from 'expo-secure-store';
import { ActiveBlockerSession, BlockerMode } from '../types/screenBlocker';

const ACTIVE_SESSION_KEY = 'focus.screenBlocker.activeSession';
const SELECTION_TOKEN_KEY = 'focus.screenBlocker.selectionToken';
const DEFAULT_MODE_KEY = 'focus.screenBlocker.defaultMode';

export const screenBlockerStore = {
  async getActiveSession(): Promise<ActiveBlockerSession | null> {
    const raw = await SecureStore.getItemAsync(ACTIVE_SESSION_KEY);
    return raw ? (JSON.parse(raw) as ActiveBlockerSession) : null;
  },
  setActiveSession: (session: ActiveBlockerSession) =>
    SecureStore.setItemAsync(ACTIVE_SESSION_KEY, JSON.stringify(session)),
  clearActiveSession: () => SecureStore.deleteItemAsync(ACTIVE_SESSION_KEY),

  getSelectionToken: () => SecureStore.getItemAsync(SELECTION_TOKEN_KEY),
  setSelectionToken: (token: string) => SecureStore.setItemAsync(SELECTION_TOKEN_KEY, token),
  clearSelectionToken: () => SecureStore.deleteItemAsync(SELECTION_TOKEN_KEY),

  async getDefaultMode(): Promise<BlockerMode | null> {
    const raw = await SecureStore.getItemAsync(DEFAULT_MODE_KEY);
    return raw === BlockerMode.REMINDER || raw === BlockerMode.BLOCK ? raw : null;
  },
  setDefaultMode: (mode: BlockerMode) => SecureStore.setItemAsync(DEFAULT_MODE_KEY, mode),
};
