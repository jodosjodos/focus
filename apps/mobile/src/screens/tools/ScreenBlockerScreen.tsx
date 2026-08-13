import { useEffect, useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ToolsStackParamList } from '../../navigation/ToolsStack';
import { useSession } from '../../state/SessionContext';
import { useTodayQuests } from '../../api/programs';
import { useCompleteQuest } from '../../api/quests';
import { QuestStatus } from '../../types/quest';
import { screenBlockerStore } from '../../state/screenBlockerStore';
import { scheduleSessionNotifications, cancelSessionNotifications } from '../../api/notifications';
import {
  applyShield,
  clearShield,
  getAuthorizationStatus,
  isDevStubActive,
  ExpoScreenShieldSummaryView,
} from 'expo-screen-shield';
import { ActiveBlockerSession, BlockerMode, DURATION_OPTIONS_MIN } from '../../types/screenBlocker';
import GlassCard from '../../components/GlassCard';
import BlockerShieldRing from '../../components/BlockerShieldRing';
import QuestCompleteBurst from '../../components/QuestCompleteBurst';
import { colors } from '../../theme/colors';
import { CARD_SHADOW } from '../../theme/shadows';

type Props = NativeStackScreenProps<ToolsStackParamList, 'ScreenBlocker'>;

type Phase = 'loading' | 'setup' | 'active' | 'complete';

const MODE_COPY: Record<BlockerMode, { title: string; description: string; icon: keyof typeof Ionicons.glyphMap; tint: string; badge?: string }> = {
  [BlockerMode.REMINDER]: {
    title: 'Reminder Mode',
    description: "A gentle nudge — no restriction, just a check-in when your time's up.",
    icon: 'notifications',
    tint: colors.primary,
    badge: 'Low friction',
  },
  [BlockerMode.BLOCK]: {
    title: 'Block Mode',
    description: 'Real iOS restriction — selected apps are actually shielded for the session.',
    icon: 'shield-checkmark',
    tint: colors.discipline,
  },
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function ScreenBlockerScreen({ navigation, route }: Props) {
  const { programId } = useSession();
  const today = useTodayQuests(programId);
  const completeQuest = useCompleteQuest(programId);

  const [phase, setPhase] = useState<Phase>('loading');
  const [selectedMode, setSelectedMode] = useState<BlockerMode>(BlockerMode.REMINDER);
  const [selectedDuration, setSelectedDuration] = useState<number>(30);
  const [selectionToken, setSelectionToken] = useState<string | null>(null);

  const [activeSession, setActiveSession] = useState<ActiveBlockerSession | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [justEnded, setJustEnded] = useState<'natural' | 'early' | null>(null);
  const [burstXp, setBurstXp] = useState<number | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Picked up when returning from ScreenBlockerAppPickerScreen.
  useEffect(() => {
    if (route.params?.selectionToken) {
      setSelectionToken(route.params.selectionToken);
      setSelectedMode(BlockerMode.BLOCK);
      screenBlockerStore.setSelectionToken(route.params.selectionToken);
    }
  }, [route.params?.selectionToken]);

  useEffect(() => {
    (async () => {
      const stored = await screenBlockerStore.getActiveSession();
      if (stored && Date.now() < new Date(stored.endsAt).getTime()) {
        setActiveSession(stored);
        setSecondsLeft(Math.round((new Date(stored.endsAt).getTime() - Date.now()) / 1000));
        setPhase('active');
        return;
      }
      const [savedToken, defaultMode] = await Promise.all([
        screenBlockerStore.getSelectionToken(),
        screenBlockerStore.getDefaultMode(),
      ]);
      if (savedToken) setSelectionToken(savedToken);
      if (defaultMode) setSelectedMode(defaultMode);
      setPhase('setup');
    })();
  }, []);

  useEffect(() => {
    if (phase !== 'active') {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          finishSession('natural');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const selectMode = (mode: BlockerMode) => {
    setSelectedMode(mode);
    screenBlockerStore.setDefaultMode(mode);
  };

  const handlePickApps = async () => {
    const status = await getAuthorizationStatus();
    if (status === 'approved') {
      navigation.navigate('ScreenBlockerAppPicker');
    } else {
      navigation.navigate('ScreenBlockerPermission');
    }
  };

  const startSession = async () => {
    const now = Date.now();
    const endsAt = new Date(now + selectedDuration * 60_000).toISOString();
    const notificationIds = await scheduleSessionNotifications(selectedMode, selectedDuration);

    if (selectedMode === BlockerMode.BLOCK && selectionToken) {
      await applyShield(selectionToken);
    }

    const session: ActiveBlockerSession = {
      mode: selectedMode,
      durationMinutes: selectedDuration,
      startedAt: new Date(now).toISOString(),
      endsAt,
      selectionToken: selectedMode === BlockerMode.BLOCK ? selectionToken : null,
      notificationIds,
      xpAwarded: false,
    };
    await screenBlockerStore.setActiveSession(session);
    setActiveSession(session);
    setSecondsLeft(selectedDuration * 60);
    setJustEnded(null);
    setPhase('active');
  };

  const finishSession = async (reason: 'natural' | 'early') => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!activeSession) return;

    if (activeSession.mode === BlockerMode.BLOCK) {
      await clearShield();
    }
    await cancelSessionNotifications(activeSession.notificationIds);
    await screenBlockerStore.clearActiveSession();

    setJustEnded(reason);
    setPhase('setup');
    setActiveSession(null);

    if (reason === 'natural') {
      const matchingQuest = today.data?.quests.find(
        (q) =>
          q.status === QuestStatus.PENDING &&
          (q.title.toLowerCase().includes('screen time') ||
            q.title.toLowerCase().includes('digital fast')),
      );
      if (matchingQuest) {
        completeQuest.mutate(
          { questId: matchingQuest.id, loggedValue: `${activeSession.durationMinutes} min` },
          { onSuccess: (result) => setBurstXp(result.xpAwarded) },
        );
      }
    }
  };

  const confirmEndEarly = () => {
    Alert.alert('End session early?', "You'll lose today's XP credit for this session.", [
      { text: 'Keep going', style: 'cancel' },
      { text: 'End session', style: 'destructive', onPress: () => finishSession('early') },
    ]);
  };

  if (phase === 'loading') {
    return <View className="flex-1 bg-background" />;
  }

  if (phase === 'active' && activeSession) {
    const totalSeconds = activeSession.durationMinutes * 60;
    const progress = Math.max(0, Math.min(1, secondsLeft / totalSeconds));
    const tint = MODE_COPY[activeSession.mode].tint;

    return (
      <View className="flex-1 bg-background items-center justify-center" style={{ padding: 24, gap: 22 }}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={{ position: 'absolute', top: 64, left: 24 }}
          hitSlop={8}
        >
          <Text className="text-textMuted" style={{ fontSize: 13 }}>‹ Tools</Text>
        </Pressable>

        <BlockerShieldRing
          progress={progress}
          label={formatTime(secondsLeft)}
          sublabel={
            activeSession.mode === BlockerMode.BLOCK ? 'Block Mode active' : 'Reminder session'
          }
          tint={tint}
          active
        />

        {activeSession.mode === BlockerMode.BLOCK && (
          <ExpoScreenShieldSummaryView token={activeSession.selectionToken} style={{ height: 28 }} />
        )}

        <Pressable onPress={confirmEndEarly} hitSlop={8} style={{ marginTop: 4 }}>
          <Text style={{ color: colors.textMuted, fontSize: 13, fontWeight: '600' }}>End Early</Text>
        </Pressable>
      </View>
    );
  }

  // phase === 'setup'
  const canStart = selectedMode === BlockerMode.REMINDER || !!selectionToken;

  return (
    <View className="flex-1 bg-background">
      <LinearGradient
        colors={[`${colors.discipline}33`, colors.background]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '55%' }}
      />
      <ScrollView contentContainerClassName="px-6 pt-16 pb-10">
        <Pressable onPress={() => navigation.goBack()} style={{ marginBottom: 14 }} hitSlop={8}>
          <Text className="text-textMuted" style={{ fontSize: 13 }}>‹ Tools</Text>
        </Pressable>
        <Text className="font-display text-text" style={{ fontSize: 22, marginBottom: 4 }}>
          Screen Blocker
        </Text>
        <Text className="text-textMuted" style={{ fontSize: 13, marginBottom: 20 }}>
          Pick a mode, set a duration, start when you're ready.
        </Text>

        {(Object.values(BlockerMode) as BlockerMode[]).map((mode) => {
          const copy = MODE_COPY[mode];
          const selected = selectedMode === mode;
          return (
            <Pressable key={mode} onPress={() => selectMode(mode)} style={{ marginBottom: 10 }}>
              <GlassCard
                style={[
                  CARD_SHADOW,
                  { borderColor: selected ? copy.tint : colors.border, borderWidth: selected ? 1.5 : 1 },
                ]}
              >
                <View className="flex-row items-center" style={{ gap: 12 }}>
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      backgroundColor: `${copy.tint}22`,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons name={copy.icon} size={19} color={copy.tint} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View className="flex-row items-center" style={{ gap: 6 }}>
                      <Text className="font-semibold" style={{ color: colors.text, fontSize: 14.5 }}>
                        {copy.title}
                      </Text>
                      {copy.badge && (
                        <Text
                          style={{
                            fontSize: 9.5,
                            fontWeight: '700',
                            color: copy.tint,
                            backgroundColor: `${copy.tint}22`,
                            paddingHorizontal: 6,
                            paddingVertical: 2,
                            borderRadius: 6,
                            overflow: 'hidden',
                          }}
                        >
                          {copy.badge.toUpperCase()}
                        </Text>
                      )}
                    </View>
                    <Text className="text-textMuted" style={{ fontSize: 12, marginTop: 2, lineHeight: 16 }}>
                      {copy.description}
                    </Text>
                  </View>
                  {selected && <Ionicons name="checkmark-circle" size={20} color={copy.tint} />}
                </View>
              </GlassCard>
            </Pressable>
          );
        })}

        <Text
          className="text-textMuted"
          style={{ fontSize: 11.5, fontWeight: '700', letterSpacing: 0.4, marginTop: 16, marginBottom: 8 }}
        >
          DURATION
        </Text>
        <View className="flex-row" style={{ gap: 8, marginBottom: 20 }}>
          {DURATION_OPTIONS_MIN.map((min) => {
            const selected = selectedDuration === min;
            return (
              <Pressable
                key={min}
                onPress={() => setSelectedDuration(min)}
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  borderRadius: 12,
                  alignItems: 'center',
                  backgroundColor: selected ? `${colors.primary}33` : colors.surface,
                  borderWidth: 1.5,
                  borderColor: selected ? colors.primary : colors.border,
                }}
              >
                <Text
                  style={{
                    color: selected ? colors.primary : colors.textMuted,
                    fontWeight: '700',
                    fontSize: 13,
                  }}
                >
                  {min}m
                </Text>
              </Pressable>
            );
          })}
        </View>

        {selectedMode === BlockerMode.BLOCK && (
          <Pressable onPress={handlePickApps} style={{ marginBottom: 20 }}>
            <GlassCard style={[CARD_SHADOW, { flexDirection: 'row', alignItems: 'center', gap: 10 }]}>
              <Ionicons name="apps" size={18} color={colors.discipline} />
              <View style={{ flex: 1 }}>
                <Text className="font-semibold" style={{ color: colors.text, fontSize: 13.5 }}>
                  {selectionToken ? 'Apps selected' : 'Select apps to block'}
                </Text>
                {selectionToken ? (
                  <ExpoScreenShieldSummaryView token={selectionToken} style={{ height: 22, marginTop: 4 }} />
                ) : (
                  <Text className="text-textMuted" style={{ fontSize: 11.5, marginTop: 2 }}>
                    Opens iOS's own picker — Focus never sees which apps you choose.
                  </Text>
                )}
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
            </GlassCard>
          </Pressable>
        )}

        {isDevStubActive && (
          <Text
            className="text-textMuted"
            style={{ fontSize: 10.5, textAlign: 'center', marginBottom: 10, opacity: 0.7 }}
          >
            Dev preview — real Screen Time authorization isn't linked in this build.
          </Text>
        )}

        <Pressable
          onPress={startSession}
          disabled={!canStart}
          style={{
            backgroundColor: canStart ? MODE_COPY[selectedMode].tint : `${MODE_COPY[selectedMode].tint}55`,
            paddingVertical: 16,
            borderRadius: 16,
            alignItems: 'center',
          }}
        >
          <Text className="text-white font-bold" style={{ fontSize: 14.5 }}>
            Start {selectedDuration} min session
          </Text>
        </Pressable>

        {justEnded && burstXp === null && (
          <Text className="text-textMuted text-center" style={{ fontSize: 12.5, marginTop: 14 }}>
            {justEnded === 'natural' ? 'Session complete.' : 'Session ended early.'}
          </Text>
        )}
      </ScrollView>
      {burstXp !== null && <QuestCompleteBurst xp={burstXp} onDone={() => setBurstXp(null)} />}
    </View>
  );
}
