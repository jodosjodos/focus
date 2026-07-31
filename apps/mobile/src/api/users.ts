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

export interface UpdateProfilePayload {
  displayName?: string;
  email?: string;
  newPassword?: string;
  currentPassword?: string;
}

export function useUpdateProfile() {
  return useMutation({
    mutationFn: (params: { userId: string } & UpdateProfilePayload) =>
      apiFetch<UserResponse>(`/users/${params.userId}/profile`, {
        method: 'PATCH',
        body: JSON.stringify({
          displayName: params.displayName,
          email: params.email,
          newPassword: params.newPassword,
          currentPassword: params.currentPassword,
        }),
      }),
  });
}
