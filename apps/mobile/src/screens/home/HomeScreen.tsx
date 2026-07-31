import { useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSession } from '../../state/SessionContext';
import { useProgramStats, useTodayQuests } from '../../api/programs';
import { useCompleteQuest, useSkipQuest } from '../../api/quests';
import { QuestStatus, QuestType } from '../../types/quest';
import QuestCard from '../../components/QuestCard';
import QuestDetailModal from './QuestDetailModal';
import { colors } from '../../theme/colors';

type Filter = 'todos' | 'done' | 'skipped';

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
  const complete = useCompleteQuest(programId);
  const skip = useSkipQuest(programId);

  const [filter, setFilter] = useState<Filter>('todos');
  const [modalQuestId, setModalQuestId] = useState<string | null>(null);
  const [loggedValue, setLoggedValue] = useState('');

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
      complete.mutate({ questId: quest.id });
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
            height: 10, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.05)',
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

        <View className="flex-row" style={{ gap: 16, marginBottom: 14 }}>
          {(['todos', 'done', 'skipped'] as Filter[]).map((f) => (
            <Pressable key={f} onPress={() => setFilter(f)}>
              <Text
                style={{
                  fontSize: 12.5,
                  fontWeight: filter === f ? '700' : '500',
                  color: filter === f ? colors.primary : colors.textMuted,
                  textTransform: 'capitalize',
                }}
              >
                {f}
              </Text>
            </Pressable>
          ))}
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
          loggedValue={loggedValue}
          onChangeLoggedValue={setLoggedValue}
          loading={complete.isPending}
          onCancel={() => setModalQuestId(null)}
          onConfirm={() => {
            complete.mutate(
              { questId: modalQuest.id, loggedValue: loggedValue || undefined },
              { onSuccess: () => setModalQuestId(null) },
            );
          }}
        />
      )}
    </View>
  );
}
