import { useMutation } from '@tanstack/react-query';
import { apiFetch } from './client';
import { session } from './session';

interface AuthResponse {
  accessToken: string;
  user: { id: string; email: string; displayName: string };
}

export function useRegister() {
  return useMutation({
    mutationFn: (params: {
      email: string;
      password: string;
      displayName: string;
    }) => apiFetch<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(params),
    }),
    onSuccess: (data) =>
      Promise.all([session.setToken(data.accessToken), session.setUser(data.user)]),
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: (params: { email: string; password: string }) =>
      apiFetch<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(params),
      }),
    onSuccess: (data) =>
      Promise.all([session.setToken(data.accessToken), session.setUser(data.user)]),
  });
}
