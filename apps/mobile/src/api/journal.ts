import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from './client';
import { JournalEntry, JournalMood } from '../types/journal';

export function useJournalEntries(programId: string | null) {
  return useQuery({
    queryKey: ['journal', programId],
    queryFn: () => apiFetch<JournalEntry[]>(`/journal?programId=${programId}`),
    enabled: !!programId,
  });
}

export function useCreateJournalEntry(programId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { mood: JournalMood; text: string; photoUri?: string }) =>
      apiFetch<JournalEntry>(`/journal?programId=${programId}`, {
        method: 'POST',
        body: JSON.stringify(params),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal', programId] });
    },
  });
}

export function useUpdateJournalEntry(programId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...params
    }: {
      id: string;
      mood?: JournalMood;
      text?: string;
      photoUri?: string | null;
    }) =>
      apiFetch<JournalEntry>(`/journal/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(params),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal', programId] });
    },
  });
}

export function useDeleteJournalEntry(programId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiFetch<void>(`/journal/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal', programId] });
    },
  });
}
