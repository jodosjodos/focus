import * as Notifications from 'expo-notifications';
import { BlockerMode } from '../types/screenBlocker';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const COPY = {
  [BlockerMode.REMINDER]: {
    start: (min: number) => `Reminder session started — ${min} min of a lighter phone. You've got this.`,
    end: () => "Reminder session complete. Nice work carving out that time.",
  },
  [BlockerMode.BLOCK]: {
    start: (min: number) => `Block session started — ${min} min, selected apps are shielded.`,
    end: () => 'Block session complete. Your apps are unlocked again.',
  },
};

export async function ensureNotificationPermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.status === 'granted') return true;
  if (current.status === 'denied' && !current.canAskAgain) return false;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.status === 'granted';
}

export async function scheduleSessionNotifications(
  mode: BlockerMode,
  durationMinutes: number,
): Promise<{ startId: string | null; endId: string | null }> {
  const granted = await ensureNotificationPermission();
  if (!granted) {
    return { startId: null, endId: null };
  }

  const startId = await Notifications.scheduleNotificationAsync({
    content: { title: 'Focus', body: COPY[mode].start(durationMinutes) },
    trigger: null,
  });

  const endId = await Notifications.scheduleNotificationAsync({
    content: { title: 'Focus', body: COPY[mode].end() },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: durationMinutes * 60,
    },
  });

  return { startId, endId };
}

export async function cancelSessionNotifications(ids: {
  startId: string | null;
  endId: string | null;
}): Promise<void> {
  if (ids.endId) {
    await Notifications.cancelScheduledNotificationAsync(ids.endId).catch(() => undefined);
  }
}
