import { session } from './session';

// iOS Simulator shares the host's network, so localhost reaches the local
// NestJS dev server directly. A physical device can't resolve "localhost" to
// the Mac at all. Expo dev-client's own bundle-loading path doesn't populate
// RN's usual scriptURL/getDevServer introspection (confirmed empirically —
// both return null under dev-client), so there's no reliable way to detect
// the LAN host from inside the app. Instead the host is passed in explicitly
// via EXPO_PUBLIC_API_HOST when Metro starts (Expo statically inlines
// EXPO_PUBLIC_* vars into the bundle) — see package.json's "start" script,
// which resolves the Mac's current LAN IP fresh on every launch. Revisit
// when Phase 8 introduces a real hosted backend.
function resolveApiBaseUrl(): string {
  const host = process.env.EXPO_PUBLIC_API_HOST;
  if (__DEV__ && host) return `http://${host}:3000`;
  return 'http://localhost:3000';
}

export const API_BASE_URL = resolveApiBaseUrl();

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await session.getToken();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new ApiError(response.status, await response.text());
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
