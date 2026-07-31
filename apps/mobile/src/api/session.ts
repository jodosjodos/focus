import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'focus.accessToken';
const PROGRAM_ID_KEY = 'focus.programId';
const USER_KEY = 'focus.user';

export interface StoredUser {
  id: string;
  email: string;
  displayName: string;
}

export const session = {
  getToken: () => SecureStore.getItemAsync(TOKEN_KEY),
  setToken: (token: string) => SecureStore.setItemAsync(TOKEN_KEY, token),
  clearToken: () => SecureStore.deleteItemAsync(TOKEN_KEY),

  getProgramId: () => SecureStore.getItemAsync(PROGRAM_ID_KEY),
  setProgramId: (programId: string) =>
    SecureStore.setItemAsync(PROGRAM_ID_KEY, programId),
  clearProgramId: () => SecureStore.deleteItemAsync(PROGRAM_ID_KEY),

  async getUser(): Promise<StoredUser | null> {
    const raw = await SecureStore.getItemAsync(USER_KEY);
    return raw ? (JSON.parse(raw) as StoredUser) : null;
  },
  setUser: (user: StoredUser) =>
    SecureStore.setItemAsync(USER_KEY, JSON.stringify(user)),
  clearUser: () => SecureStore.deleteItemAsync(USER_KEY),

  async clearAll() {
    await Promise.all([this.clearToken(), this.clearProgramId(), this.clearUser()]);
  },
};
