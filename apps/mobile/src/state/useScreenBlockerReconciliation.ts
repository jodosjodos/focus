import { useEffect } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { clearShield } from 'expo-screen-shield';
import { useSession } from './SessionContext';
import { screenBlockerStore } from './screenBlockerStore';
import { BlockerMode } from '../types/screenBlocker';
import { apiFetch } from '../api/client';
import type { TodayResponse } from '../api/programs';

/** Runs at cold-launch and on every foreground: if a Block/Reminder session's
 * scheduled end already passed while the app was backgrounded or killed,
 * clears the shield defensively (idempotent — safe even if already clear)
 * and awards XP if not already claimed. This is the self-heal half of Block
 * Mode's "fails closed, not silently unblocked" design — without it, a
 * force-quit mid-session would leave the shield up until the user happened
 * to reopen Screen Blocker specifically, rather than on next app open. */
export function useScreenBlockerReconciliation() {
  const { programId } = useSession();
  const queryClient = useQueryClient();

  useEffect(() => {
    const reconcile = async () => {
      const activeSession = await screenBlockerStore.getActiveSession();
      if (!activeSession) return;
      if (Date.now() < new Date(activeSession.endsAt).getTime()) return;

      if (activeSession.mode === BlockerMode.BLOCK) {
        await clearShield();
      }

      if (!activeSession.xpAwarded && programId) {
        try {
          const today = await apiFetch<TodayResponse>(`/programs/${programId}/quests/today`);
          const match = today.quests.find(
            (q) =>
              q.status === 'pending' &&
              (q.title.toLowerCase().includes('screen time') ||
                q.title.toLowerCase().includes('digital fast')),
          );
          if (match) {
            await apiFetch(`/quests/${match.id}/complete`, {
              method: 'POST',
              body: JSON.stringify({ loggedValue: `${activeSession.durationMinutes} min` }),
            });
            queryClient.invalidateQueries({ queryKey: ['programs', programId] });
          }
        } catch {
          // Best-effort — worst case the user opens Screen Blocker and it's
          // already resolved, or they've missed that day's quest, neither of
          // which is a dead end.
        }
      }

      await screenBlockerStore.clearActiveSession();
    };

    reconcile();
    const subscription = AppState.addEventListener('change', (status: AppStateStatus) => {
      if (status === 'active') reconcile();
    });
    return () => subscription.remove();
  }, [programId, queryClient]);
}
