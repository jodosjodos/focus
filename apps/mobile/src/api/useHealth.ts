import { useQuery } from '@tanstack/react-query';
import { apiFetch } from './client';

export interface HealthResponse {
  status: 'ok';
  db: 'connected';
  dbTime: string;
}

export function useHealth() {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => apiFetch<HealthResponse>('/health'),
    refetchInterval: 10_000,
  });
}
