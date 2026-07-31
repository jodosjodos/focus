import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from './client';
import { Quest } from '../types/quest';

export function useCompleteQuest(programId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ questId, loggedValue }: { questId: string; loggedValue?: string }) =>
      apiFetch<Quest>(`/quests/${questId}/complete`, {
        method: 'POST',
        body: JSON.stringify({ loggedValue }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs', programId] });
    },
  });
}

export function useSkipQuest(programId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (questId: string) =>
      apiFetch<Quest>(`/quests/${questId}/skip`, { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs', programId] });
    },
  });
}
