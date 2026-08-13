import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from './client';
import { VideoCompleteResponse, VideoLibraryItem } from '../types/video';

export function useVideoQuests(programId: string | null) {
  return useQuery({
    queryKey: ['video-quests', programId],
    queryFn: () => apiFetch<VideoLibraryItem[]>(`/video-quests?programId=${programId ?? ''}`),
  });
}

export function useCompleteVideoLink(programId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (videoLinkId: string) =>
      apiFetch<VideoCompleteResponse>(`/video-quests/${videoLinkId}/complete?programId=${programId ?? ''}`, {
        method: 'POST',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['video-quests', programId] });
      queryClient.invalidateQueries({ queryKey: ['programs', programId] });
      queryClient.invalidateQueries({ queryKey: ['achievements', 'unlocks', 'pending', programId] });
    },
  });
}
