import { useEffect } from 'react';
import { AppState } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { useSession } from '../state/SessionContext';
import { usePendingUnlocks, useAcknowledgeUnlock } from '../api/achievements';
import { useTodayMotivationCard, useAcknowledgeMotivationCard } from '../api/motivationCards';
import { AchievementType } from '../types/achievement';
import MilestoneCelebrationOverlay from '../components/MilestoneCelebrationOverlay';
import MotivationCardOverlay from '../components/MotivationCardOverlay';
import HiddenAchievementToast from '../components/HiddenAchievementToast';
import MainTabs from './MainTabs';

export default function RewardOverlayHost() {
  const { programId } = useSession();
  const queryClient = useQueryClient();

  const pendingUnlocks = usePendingUnlocks(programId);
  const motivationCard = useTodayMotivationCard(programId);
  const acknowledgeUnlock = useAcknowledgeUnlock(programId);
  const acknowledgeMotivationCard = useAcknowledgeMotivationCard(programId);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        queryClient.invalidateQueries({ queryKey: ['achievements', 'unlocks', 'pending', programId] });
        queryClient.invalidateQueries({ queryKey: ['motivation-cards', 'today', programId] });
      }
    });
    return () => sub.remove();
  }, [programId, queryClient]);

  const unlocks = pendingUnlocks.data ?? [];
  const milestoneUnlock = unlocks.find((u) => u.achievement.type === AchievementType.MILESTONE);
  const hiddenUnlock = !milestoneUnlock
    ? unlocks.find((u) => u.achievement.type === AchievementType.HIDDEN)
    : undefined;

  const pull = motivationCard.data ?? null;
  const showMotivationCard =
    !milestoneUnlock && !hiddenUnlock && pull && !pull.acknowledgedAt;

  return (
    <>
      <MainTabs />

      {hiddenUnlock && (
        <HiddenAchievementToast
          key={hiddenUnlock.id}
          unlock={hiddenUnlock}
          onDone={() => acknowledgeUnlock.mutate(hiddenUnlock.id)}
        />
      )}

      {milestoneUnlock && (
        <MilestoneCelebrationOverlay
          key={milestoneUnlock.id}
          unlock={milestoneUnlock}
          loading={acknowledgeUnlock.isPending}
          onContinue={() => acknowledgeUnlock.mutate(milestoneUnlock.id)}
        />
      )}

      {showMotivationCard && pull && (
        <MotivationCardOverlay
          pull={pull}
          loading={acknowledgeMotivationCard.isPending}
          onDismiss={() => acknowledgeMotivationCard.mutate(pull.id)}
        />
      )}
    </>
  );
}
