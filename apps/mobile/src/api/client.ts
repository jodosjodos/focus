// iOS Simulator shares the host's network, so localhost reaches the local
// NestJS dev server directly. A physical device will need the host's LAN IP
// instead — revisit when Phase 8 introduces a real hosted backend.
export const API_BASE_URL = 'http://localhost:3000';

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  });

  if (!response.ok) {
    throw new Error(`API error ${response.status}: ${await response.text()}`);
  }

  return response.json() as Promise<T>;
}
