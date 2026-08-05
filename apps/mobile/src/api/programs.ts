import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from './client';
import { session } from './session';
import { ImprovementArea, OnboardingBaseline } from '../types/onboarding';
import { GeneratedQuest, Quest, QuestCategory } from '../types/quest';
import { Program, StatSnapshot } from '../types/program';
import { WeeklyQuest } from '../types/weekly-quest';

export interface PreviewResponse {
  baselineStats: StatSnapshot;
  potentialStats: StatSnapshot;
  notWorkingText: string | null;
  quests: GeneratedQuest[];
  bonusQuest: GeneratedQuest | null;
}

export type TodayQuest = Quest & {
  title: string;
  description: string;
  questType: GeneratedQuest['questType'];
  primaryStat: QuestCategory;
  secondaryStat: QuestCategory | null;
  category: QuestCategory;
};

export interface TodayResponse {
  day: number;
  lengthDays: number;
  programComplete: boolean;
  quests: TodayQuest[];
  bonusQuest: TodayQuest | null;
}

export interface StatsResponse {
  current: StatSnapshot;
  potential: StatSnapshot;
  totalXp: number;
  currentLevel: number;
  streakCount: number;
  longestStreak: number;
  totalQuestsCompleted: number;
}

export function getUserPrograms(): Promise<Program[]> {
  return apiFetch<Program[]>('/programs');
}

export function usePreviewProgram() {
  return useMutation({
    mutationFn: (params: {
      improvementAreas: ImprovementArea[];
      baseline: OnboardingBaseline;
      programLength: number;
      notWorkingText?: string;
    }) =>
      apiFetch<PreviewResponse>('/programs/preview', {
        method: 'POST',
        body: JSON.stringify(params),
      }),
  });
}

export function useSwapTemplate() {
  return useMutation({
    mutationFn: (params: {
      category: QuestCategory;
      excludeTemplateId: string;
      baseline: OnboardingBaseline;
    }) =>
      apiFetch<GeneratedQuest>('/programs/preview/swap', {
        method: 'POST',
        body: JSON.stringify(params),
      }),
  });
}

export function useCreateProgram() {
  return useMutation({
    mutationFn: (params: {
      improvementAreas: ImprovementArea[];
      baseline: OnboardingBaseline;
      lengthDays: number;
      notWorkingText?: string;
      timezone: string;
      quests: { templateId: string; isMainQuest: boolean }[];
    }) =>
      apiFetch<Program>('/programs', {
        method: 'POST',
        body: JSON.stringify(params),
      }),
    onSuccess: (program) => session.setProgramId(program.id),
  });
}

export function useTodayQuests(programId: string | null) {
  return useQuery({
    queryKey: ['programs', programId, 'today'],
    queryFn: () => apiFetch<TodayResponse>(`/programs/${programId}/quests/today`),
    enabled: !!programId,
  });
}

export function useProgramStats(programId: string | null) {
  return useQuery({
    queryKey: ['programs', programId, 'stats'],
    queryFn: () => apiFetch<StatsResponse>(`/programs/${programId}/stats`),
    enabled: !!programId,
  });
}

export function useWeeklyQuest(programId: string | null) {
  return useQuery({
    queryKey: ['programs', programId, 'weekly-quest'],
    queryFn: () => apiFetch<WeeklyQuest | null>(`/programs/${programId}/weekly-quest/current`),
    enabled: !!programId,
  });
}

export function useInvalidateProgram(programId: string | null) {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ['programs', programId] });
  };
}
