import { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ToolsStackParamList } from '../../navigation/ToolsStack';
import { useSession } from '../../state/SessionContext';
import { useTodayQuests } from '../../api/programs';
import { useCompleteQuest } from '../../api/quests';
import { QuestStatus, QuestType } from '../../types/quest';
import QuestCompleteBurst from '../../components/QuestCompleteBurst';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<ToolsStackParamList, 'Pomodoro'>;

const SESSION_SECONDS = 25 * 60;

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function PomodoroScreen({ navigation }: Props) {
  const { programId } = useSession();
  const today = useTodayQuests(programId);
  const completeQuest = useCompleteQuest(programId);

  const [secondsLeft, setSecondsLeft] = useState(SESSION_SECONDS);
  const [running, setRunning] = useState(false);
  const [burstXp, setBurstXp] = useState<number | null>(null);
  const [sessionDone, setSessionDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const finishSession = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRunning(false);
    setSessionDone(true);
    setSecondsLeft(SESSION_SECONDS);

    const pomodoroQuest = today.data?.quests.find(
      (q) =>
        q.status === QuestStatus.PENDING &&
        q.questType === QuestType.DURATION &&
        q.title.toLowerCase().includes('pomodoro'),
    );
    if (pomodoroQuest) {
      completeQuest.mutate(
        { questId: pomodoroQuest.id, loggedValue: '25 min' },
        { onSuccess: (result) => setBurstXp(result.xpAwarded) },
      );
    }
  };

  const start = () => {
    setSessionDone(false);
    setRunning(true);
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          finishSession();
          return SESSION_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pause = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRunning(false);
  };

  return (
    <View className="flex-1 bg-background items-center justify-center" style={{ padding: 24, gap: 18 }}>
      <Pressable
        onPress={() => navigation.goBack()}
        style={{ position: 'absolute', top: 64, left: 24 }}
        hitSlop={8}
      >
        <Text className="text-textMuted" style={{ fontSize: 13 }}>‹ Tools</Text>
      </Pressable>

      <Text className="font-display text-text" style={{ fontSize: 52 }}>
        {formatTime(secondsLeft)}
      </Text>
      <Text className="text-textMuted" style={{ fontSize: 13 }}>
        Focus block · feeds Focus quest
      </Text>
      <Pressable
        onPress={running ? pause : start}
        style={{
          backgroundColor: colors.focus,
          paddingVertical: 14,
          paddingHorizontal: 40,
          borderRadius: 20,
        }}
      >
        <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14.5 }}>
          {running ? 'Pause' : 'Start'}
        </Text>
      </Pressable>
      {sessionDone && burstXp === null && (
        <Text className="text-success" style={{ fontSize: 12.5, marginTop: 4 }}>
          Session complete
        </Text>
      )}
      {burstXp !== null && <QuestCompleteBurst xp={burstXp} onDone={() => setBurstXp(null)} />}
    </View>
  );
}
