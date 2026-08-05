import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSession } from '../../state/SessionContext';
import { useProgramStats, useTodayQuests, useWeeklyQuest } from '../../api/programs';
import { useCompleteQuest, useSkipQuest, useRestoreQuest } from '../../api/quests';
import { QuestStatus, QuestType } from '../../types/quest';
import type { StatSnapshot } from '../../types/program';
import QuestCard, { STAT_COLOR, STAT_GAIN_BY_DIFFICULTY, XP_BY_DIFFICULTY } from '../../components/QuestCard';
import WeeklyQuestCard from '../../components/WeeklyQuestCard';
import QuestCompleteBurst from '../../components/QuestCompleteBurst';
import LevelUpBurst from '../../components/LevelUpBurst';
import QuestDetailModal from './QuestDetailModal';
import { colors } from '../../theme/colors';

type Filter = 'todos' | 'done' | 'skipped';

const STAT_KEYS = ['discipline', 'focus', 'strength', 'confidence', 'wisdom'] as const;

function isLowestStat(current: StatSnapshot, statLabel: string): boolean {
  const key = statLabel.toLowerCase() as (typeof STAT_KEYS)[number];
  if (!STAT_KEYS.includes(key)) return false;
  const min = Math.min(...STAT_KEYS.map((k) => current[k]));
  return current[key] === min;
}

function Pill({ icon, iconColor, value }: { icon: keyof typeof Ionicons.glyphMap; iconColor: string; value: string }) {
  return (
    <View
      className="flex-row items-center bg-surface border border-border"
      style={{ borderRadius: 20, paddingVertical: 6, paddingHorizontal: 12, gap: 5 }}
    >
      <Ionicons name={icon} size={14} color={iconColor} />
      <Text className="font-display text-text" style={{ fontSize: 12.5 }}>{value}</Text>
    </View>
  );
}

export default function HomeScreen() {
  const { programId } = useSession();
  const today = useTodayQuests(programId);
  const stats = useProgramStats(programId);
  const weeklyQuest = useWeeklyQuest(programId);
  const complete = useCompleteQuest(programId);
  const skip = useSkipQuest(programId);
  const restore = useRestoreQuest(programId);

  const [filter, setFilter] = useState<Filter>('todos');
  const [modalQuestId, setModalQuestId] = useState<string | null>(null);
  const [loggedValue, setLoggedValue] = useState('');
  const [burstXp, setBurstXp] = useState<number | null>(null);
  const [levelUp, setLevelUp] = useState<number | null>(null);
  const previousLevelRef = useRef<number | null>(null);

  useEffect(() => {
    const currentLevel = stats.data?.currentLevel;
    if (currentLevel === undefined) return;
    if (previousLevelRef.current !== null && currentLevel > previousLevelRef.current) {
      setLevelUp(currentLevel);
    }
    previousLevelRef.current = currentLevel;
  }, [stats.data?.currentLevel]);

  if (today.isPending || stats.isPending) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (today.isError || !today.data || !stats.data) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-6">
        <Text className="text-strength text-center">
          Couldn't load today's quests. Pull to refresh in a moment.
        </Text>
      </View>
    );
  }

  const modalQuest = today.data.quests.find((q) => q.id === modalQuestId) ?? null;
  const dayProgress = today.data.lengthDays > 0 ? today.data.day / today.data.lengthDays : 0;

  const handlePress = (quest: (typeof today.data.quests)[number]) => {
    if (quest.questType === QuestType.CHECKBOX) {
      complete.mutate(
        { questId: quest.id },
        { onSuccess: (result) => setBurstXp(result.xpAwarded) },
      );
    } else {
      setLoggedValue('');
      setModalQuestId(quest.id);
    }
  };

  const filteredQuests = today.data.quests.filter((q) => {
    if (filter === 'todos') return q.status === QuestStatus.PENDING;
    if (filter === 'done') return q.status === QuestStatus.COMPLETE;
    return q.status === QuestStatus.SKIPPED;
  });

  return (
    <View className="flex-1 bg-background">
      <LinearGradient
        colors={[`${colors.primary}33`, colors.background]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '60%' }}
      />
      <ScrollView className="flex-1" contentContainerClassName="px-6 pt-16 pb-6">
        <View className="flex-row items-center" style={{ gap: 10, marginBottom: 14 }}>
          <View
            style={{
              width: 36, height: 36, borderRadius: 18,
              backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Ionicons name="person" size={16} color={colors.textMuted} />
          </View>
          <Text className="text-textMuted" style={{ fontSize: 13 }}>Let's get after it.</Text>
        </View>

        <View className="flex-row" style={{ gap: 8, marginBottom: 14 }}>
          <Pill icon="flame" iconColor={colors.primary} value={String(stats.data.streakCount)} />
          <Pill icon="flash" iconColor={colors.confidence} value={`${stats.data.totalXp} XP`} />
          <Pill icon="trophy-outline" iconColor={colors.wisdom} value={`Lv ${stats.data.currentLevel}`} />
        </View>

        <Text className="font-display text-text" style={{ fontSize: 24 }}>
          Day {today.data.day} / {today.data.lengthDays}
        </Text>
        <View
          style={{
            height: 10, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.10)',
            overflow: 'hidden', marginTop: 8, marginBottom: 16,
          }}
        >
          <View
            style={{
              height: '100%', borderRadius: 6, backgroundColor: colors.primary,
              width: `${Math.min(100, dayProgress * 100)}%`,
            }}
          />
        </View>

        {weeklyQuest.data && <WeeklyQuestCard weeklyQuest={weeklyQuest.data} />}

        {today.data.programComplete && (
          <View
            className="mb-4"
            style={{
              backgroundColor: `${colors.success}18`, borderRadius: 16, padding: 14,
              borderWidth: 1, borderColor: colors.success,
            }}
          >
            <Text style={{ color: colors.success, fontWeight: '600' }}>
              Program complete — nice work! (Full recap coming in a later phase)
            </Text>
          </View>
        )}

        <View
          className="flex-row bg-surface border border-border"
          style={{ borderRadius: 14, padding: 4, gap: 4, marginBottom: 16 }}
        >
          {(['todos', 'done', 'skipped'] as Filter[]).map((f) => {
            const count = today.data.quests.filter((q) =>
              f === 'todos'
                ? q.status === QuestStatus.PENDING
                : f === 'done'
                  ? q.status === QuestStatus.COMPLETE
                  : q.status === QuestStatus.SKIPPED,
            ).length;
            const active = filter === f;
            return (
              <Pressable
                key={f}
                onPress={() => setFilter(f)}
                style={{
                  flex: 1,
                  paddingVertical: 9,
                  borderRadius: 10,
                  alignItems: 'center',
                  backgroundColor: active ? colors.primary : 'transparent',
                }}
              >
                <Text
                  style={{
                    fontSize: 12.5,
                    fontWeight: '700',
                    color: active ? '#FFFFFF' : colors.textMuted,
                    textTransform: 'capitalize',
                  }}
                >
                  {f} · {count}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {filteredQuests.length === 0 && (
          <Text className="text-textMuted text-center mt-8">Nothing here yet.</Text>
        )}
        {filteredQuests.map((quest) => (
          <QuestCard
            key={quest.id}
            quest={quest}
            onPress={() => handlePress(quest)}
            onSkip={() => skip.mutate(quest.id)}
            onRestore={() => restore.mutate(quest.id)}
          />
        ))}
      </ScrollView>

      {modalQuest && (
        <QuestDetailModal
          visible
          title={modalQuest.title}
          description={modalQuest.description}
          target={modalQuest.resolvedTarget}
          questType={modalQuest.questType}
          difficulty={modalQuest.resolvedDifficulty}
          statColor={STAT_COLOR[modalQuest.primaryStat] ?? colors.primary}
          primaryStat={modalQuest.primaryStat}
          secondaryStat={modalQuest.secondaryStat}
          statGain={STAT_GAIN_BY_DIFFICULTY[modalQuest.resolvedDifficulty] ?? { primary: 0, secondary: 0 }}
          xp={
            modalQuest.isBonusQuest
              ? Math.round((XP_BY_DIFFICULTY[modalQuest.resolvedDifficulty] ?? 0) * 1.5)
              : (XP_BY_DIFFICULTY[modalQuest.resolvedDifficulty] ?? 0)
          }
          isLowestStat={isLowestStat(stats.data.current, modalQuest.primaryStat)}
          loggedValue={loggedValue}
          onChangeLoggedValue={setLoggedValue}
          loading={complete.isPending}
          onCancel={() => setModalQuestId(null)}
          onConfirm={() => {
            complete.mutate(
              { questId: modalQuest.id, loggedValue: loggedValue || undefined },
              {
                onSuccess: (result) => {
                  setModalQuestId(null);
                  setBurstXp(result.xpAwarded);
                },
              },
            );
          }}
        />
      )}

      {burstXp !== null && (
        <QuestCompleteBurst xp={burstXp} onDone={() => setBurstXp(null)} />
      )}
      {levelUp !== null && (
        <LevelUpBurst level={levelUp} onDone={() => setLevelUp(null)} />
      )}
    </View>
  );
}
