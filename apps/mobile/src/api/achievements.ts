import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from './client';
import { AchievementGridItem, AchievementUnlock } from '../types/achievement';

export function useAchievementsGrid(programId: string | null) {
  return useQuery({
    queryKey: ['achievements', 'grid', programId],
    queryFn: () => apiFetch<AchievementGridItem[]>('/achievements/grid'),
    enabled: !!programId,
  });
}

export function usePendingUnlocks(programId: string | null) {
  return useQuery({
    queryKey: ['achievements', 'unlocks', 'pending', programId],
    queryFn: () => apiFetch<AchievementUnlock[]>('/achievements/unlocks/pending'),
    enabled: !!programId,
  });
}

export function useAcknowledgeUnlock(programId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (unlockId: string) =>
      apiFetch<AchievementUnlock>(`/achievements/unlocks/${unlockId}/acknowledge`, {
        method: 'POST',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements', 'unlocks', 'pending', programId] });
      queryClient.invalidateQueries({ queryKey: ['achievements', 'grid', programId] });
    },
  });
}
