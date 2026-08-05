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
      // Milestone/hidden-achievement unlocks are a side effect of completion
      // — surface them same-session instead of waiting for app-foreground.
      queryClient.invalidateQueries({ queryKey: ['achievements', 'unlocks', 'pending', programId] });
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
      queryClient.invalidateQueries({ queryKey: ['achievements', 'unlocks', 'pending', programId] });
    },
  });
}

export function useRestoreQuest(programId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (questId: string) =>
      apiFetch<Quest>(`/quests/${questId}/restore`, { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs', programId] });
    },
  });
}
