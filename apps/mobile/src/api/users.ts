import { useMutation } from '@tanstack/react-query';
import { apiFetch } from './client';

interface UserResponse {
  id: string;
  email: string;
  authProvider: string;
  displayName: string;
  createdAt: string;
  currentProgramId: string | null;
  hardModeEnabled: boolean;
}

export function useUpdateHardMode() {
  return useMutation({
    mutationFn: (params: { userId: string; hardModeEnabled: boolean }) =>
      apiFetch<UserResponse>(`/users/${params.userId}`, {
        method: 'PATCH',
        body: JSON.stringify({ hardModeEnabled: params.hardModeEnabled }),
      }),
  });
}
