import { createContext, useContext, useState, type ReactNode } from 'react';
import { ImprovementArea, OnboardingBaseline } from '../types/onboarding';
import { GeneratedQuest } from '../types/quest';
import { PreviewResponse } from '../api/programs';

interface OnboardingState {
  // Collected but not sent to the backend yet — no schema for it. See
  // docs/DEFERRED-IMPLEMENTATION.md.
  age: number;
  improvementAreas: ImprovementArea[];
  baseline: Partial<OnboardingBaseline>;
  programLength: number;
  notWorkingText: string;
  preview: PreviewResponse | null;
  quests: GeneratedQuest[];
  // Not swappable in Preview and not part of the submitted `quests`
  // selection — the backend derives it server-side on confirm. Kept
  // separate here so it never gets treated as a regular quest.
  bonusQuest: GeneratedQuest | null;
}

interface OnboardingContextValue extends OnboardingState {
  setAge: (age: number) => void;
  setImprovementAreas: (areas: ImprovementArea[]) => void;
  setBaselineAnswer: <K extends keyof OnboardingBaseline>(
    key: K,
    value: OnboardingBaseline[K],
  ) => void;
  setProgramLength: (length: number) => void;
  setNotWorkingText: (text: string) => void;
  setPreview: (preview: PreviewResponse) => void;
  replaceQuest: (index: number, replacement: GeneratedQuest) => void;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

const DEFAULT_STATE: OnboardingState = {
  age: 24,
  improvementAreas: [],
  baseline: {},
  programLength: 66,
  notWorkingText: '',
  preview: null,
  quests: [],
  bonusQuest: null,
};

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OnboardingState>(DEFAULT_STATE);

  const value: OnboardingContextValue = {
    ...state,
    setAge: (age) => setState((s) => ({ ...s, age })),
    setImprovementAreas: (improvementAreas) =>
      setState((s) => ({ ...s, improvementAreas })),
    setBaselineAnswer: (key, val) =>
      setState((s) => ({ ...s, baseline: { ...s.baseline, [key]: val } })),
    setProgramLength: (programLength) =>
      setState((s) => ({ ...s, programLength })),
    setNotWorkingText: (notWorkingText) =>
      setState((s) => ({ ...s, notWorkingText })),
    setPreview: (preview) =>
      setState((s) => ({
        ...s,
        preview,
        quests: preview.quests.filter((q) => !q.isBonusQuest),
        bonusQuest: preview.bonusQuest,
      })),
    replaceQuest: (index, replacement) =>
      setState((s) => {
        const quests = [...s.quests];
        quests[index] = replacement;
        return { ...s, quests };
      }),
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding(): OnboardingContextValue {
  const ctx = useContext(OnboardingContext);
  if (!ctx) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return ctx;
}
