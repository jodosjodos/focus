import { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import * as Speech from 'expo-speech';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ToolsStackParamList } from '../../navigation/ToolsStack';
import { useSession } from '../../state/SessionContext';
import { useTodayQuests } from '../../api/programs';
import { useCompleteQuest } from '../../api/quests';
import { QuestStatus, QuestType } from '../../types/quest';
import QuestCompleteBurst from '../../components/QuestCompleteBurst';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<ToolsStackParamList, 'Meditation'>;

const SESSION_SECONDS = 5 * 60;

const SCRIPTS = [
  "Find a comfortable position and let your shoulders drop. Close your eyes if that feels right. Take a slow breath in through your nose, and let it out even slower. There's nothing to fix right now, nothing to plan. Just notice the weight of your body, the sounds around you, the air moving in and out. If your mind wanders, that's fine — just come back to the breath, gently, without judging yourself for leaving.",
  "Settle in and let your breathing find its own rhythm. Bring your attention to the top of your head, and slowly move it downward — forehead, jaw, shoulders, chest — releasing tension as you go. You don't need to force calm. Just keep noticing, keep breathing, and let the next few minutes be exactly as unremarkable as they need to be.",
  "Take a breath in, and as you let it out, let your attention drop from your head into your chest. Notice the rise and fall. There's no goal here except to be here. Thoughts will come — let them pass like clouds, without chasing any of them. Just breath, in and out, for as long as this lasts.",
];

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function MeditationScreen({ navigation }: Props) {
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
      Speech.stop();
    };
  }, []);

  const finishSession = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    Speech.stop();
    setRunning(false);
    setSessionDone(true);

    const meditationQuest = today.data?.quests.find(
      (q) =>
        q.status === QuestStatus.PENDING &&
        q.questType === QuestType.DURATION &&
        q.title.toLowerCase().includes('meditat'),
    );
    if (meditationQuest) {
      completeQuest.mutate(
        { questId: meditationQuest.id, loggedValue: '5 min' },
        { onSuccess: (result) => setBurstXp(result.xpAwarded) },
      );
    }
  };

  const start = () => {
    setSessionDone(false);
    const script = SCRIPTS[Math.floor(Math.random() * SCRIPTS.length)];
    Speech.speak(script, { rate: 0.85, pitch: 1.0 });
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
    Speech.stop();
    setRunning(false);
  };

  return (
    <View className="flex-1 bg-background items-center justify-center" style={{ padding: 24, gap: 22 }}>
      <Pressable
        onPress={() => navigation.goBack()}
        style={{ position: 'absolute', top: 64, left: 24 }}
        hitSlop={8}
      >
        <Text className="text-textMuted" style={{ fontSize: 13 }}>‹ Tools</Text>
      </Pressable>

      <View
        style={{
          width: 160,
          height: 160,
          borderRadius: 80,
          backgroundColor: colors.wisdom,
          opacity: 0.15,
          position: 'absolute',
        }}
      />
      <Text className="font-display text-text" style={{ fontSize: 40 }}>
        {formatTime(secondsLeft)}
      </Text>
      <Text className="text-textMuted" style={{ fontSize: 13 }}>
        Guided session · voice narration
      </Text>
      <Pressable
        onPress={running ? pause : start}
        style={{
          backgroundColor: colors.wisdom,
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
        <Text className="text-success" style={{ fontSize: 12.5 }}>
          Session complete
        </Text>
      )}
      {burstXp !== null && <QuestCompleteBurst xp={burstXp} onDone={() => setBurstXp(null)} />}
    </View>
  );
}
