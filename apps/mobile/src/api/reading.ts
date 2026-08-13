import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from './client';
import { ReadingCompleteResponse, ReadingLibraryItem } from '../types/reading';

export function useReadingLibrary(programId: string | null) {
  return useQuery({
    queryKey: ['reading', programId],
    queryFn: () => apiFetch<ReadingLibraryItem[]>(`/reading?programId=${programId ?? ''}`),
  });
}

export function useCompleteReadingEntry(programId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (entryId: string) =>
      apiFetch<ReadingCompleteResponse>(`/reading/${entryId}/complete?programId=${programId ?? ''}`, {
        method: 'POST',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reading', programId] });
      queryClient.invalidateQueries({ queryKey: ['programs', programId] });
      queryClient.invalidateQueries({ queryKey: ['achievements', 'unlocks', 'pending', programId] });
    },
  });
}
