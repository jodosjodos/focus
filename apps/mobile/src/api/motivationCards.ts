import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from './client';
import { MotivationCardPullResponse } from '../types/motivation';

export function useTodayMotivationCard(programId: string | null) {
  return useQuery({
    queryKey: ['motivation-cards', 'today', programId],
    queryFn: () =>
      apiFetch<MotivationCardPullResponse>(
        `/motivation-cards/today${programId ? `?programId=${programId}` : ''}`,
      ),
    enabled: !!programId,
  });
}

export function useAcknowledgeMotivationCard(programId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (pullId: string) =>
      apiFetch<MotivationCardPullResponse>(`/motivation-cards/pulls/${pullId}/acknowledge`, {
        method: 'POST',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['motivation-cards', 'today', programId] });
    },
  });
}
