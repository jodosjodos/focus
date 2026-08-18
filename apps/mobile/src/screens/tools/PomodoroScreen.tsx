import { useEffect, useRef, useState } from 'react';
import { ImageBackground, Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ToolsStackParamList } from '../../navigation/ToolsStack';
import { useSession } from '../../state/SessionContext';
import { useTodayQuests } from '../../api/programs';
import { useCompleteQuest } from '../../api/quests';
import { QuestStatus, QuestType } from '../../types/quest';
import QuestCompleteBurst from '../../components/QuestCompleteBurst';
import BackButton from '../../components/BackButton';
import BlockerShieldRing from '../../components/BlockerShieldRing';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<ToolsStackParamList, 'Pomodoro'>;

const WORK_SECONDS = 25 * 60;
const SHORT_BREAK_SECONDS = 5 * 60;
const LONG_BREAK_SECONDS = 15 * 60;
const SESSIONS_PER_CYCLE = 4;

type Phase = 'work' | 'break';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function PomodoroScreen({ navigation }: Props) {
  const { programId } = useSession();
  const today = useTodayQuests(programId);
  const completeQuest = useCompleteQuest(programId);

  const [phase, setPhase] = useState<Phase>('work');
  const [session, setSession] = useState(1);
  const [secondsLeft, setSecondsLeft] = useState(WORK_SECONDS);
  const [running, setRunning] = useState(false);
  const [burstXp, setBurstXp] = useState<number | null>(null);
  const [justFinishedWork, setJustFinishedWork] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const durationFor = (p: Phase, s: number) =>
    p === 'work' ? WORK_SECONDS : s === SESSIONS_PER_CYCLE ? LONG_BREAK_SECONDS : SHORT_BREAK_SECONDS;

  const awardWorkXp = () => {
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

  const advancePhase = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRunning(false);

    if (phase === 'work') {
      awardWorkXp();
      setJustFinishedWork(true);
      setPhase('break');
      setSecondsLeft(durationFor('break', session));
    } else {
      setJustFinishedWork(false);
      const nextSession = session === SESSIONS_PER_CYCLE ? 1 : session + 1;
      setSession(nextSession);
      setPhase('work');
      setSecondsLeft(durationFor('work', nextSession));
    }
  };

  const start = () => {
    setJustFinishedWork(false);
    setRunning(true);
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          advancePhase();
          return prev;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pause = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRunning(false);
  };

  const skipToNext = () => advancePhase();

  const isBreak = phase === 'break';
  const tint = isBreak ? colors.wisdom : colors.focus;
  const totalSeconds = durationFor(phase, session);

  return (
    <ImageBackground
      source={require('../../../assets/images/pomodoro-bg.jpg')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['rgba(3,6,13,0.6)', 'rgba(3,6,13,0.8)', 'rgba(3,6,13,0.94)']}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <View className="flex-1 items-center justify-center" style={{ padding: 24, gap: 18 }}>
        <View style={{ position: 'absolute', top: 64, left: 24 }}>
          <BackButton label="Tools" onPress={() => navigation.goBack()} light />
        </View>

        <View
          className="flex-row items-center"
          style={{ gap: 6, position: 'absolute', top: 68, alignSelf: 'center' }}
        >
          {Array.from({ length: SESSIONS_PER_CYCLE }).map((_, i) => (
            <View
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: i < session - (phase === 'work' ? 0 : 1) ? colors.focus : 'rgba(255,255,255,0.25)',
              }}
            />
          ))}
        </View>

        <BlockerShieldRing
          progress={secondsLeft / totalSeconds}
          label={formatTime(secondsLeft)}
          sublabel={isBreak ? `Break · session ${session} of ${SESSIONS_PER_CYCLE} done` : `Focus block · session ${session} of ${SESSIONS_PER_CYCLE}`}
          tint={tint}
          active={running}
        />

        <Pressable
          onPress={running ? pause : start}
          style={{
            backgroundColor: tint,
            paddingVertical: 14,
            paddingHorizontal: 40,
            borderRadius: 20,
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14.5 }}>
            {running ? 'Pause' : isBreak ? 'Start break' : 'Start'}
          </Text>
        </Pressable>

        {!running && (
          <Pressable onPress={skipToNext} hitSlop={8}>
            <Text style={{ color: colors.textMuted, fontSize: 12.5, fontWeight: '600' }}>
              {isBreak ? 'Skip break' : 'Skip to break'}
            </Text>
          </Pressable>
        )}

        {justFinishedWork && burstXp === null && (
          <Text className="text-success" style={{ fontSize: 12.5, marginTop: 2 }}>
            Nice work — take your break.
          </Text>
        )}
        {burstXp !== null && <QuestCompleteBurst xp={burstXp} onDone={() => setBurstXp(null)} />}
      </View>
    </ImageBackground>
  );
}
