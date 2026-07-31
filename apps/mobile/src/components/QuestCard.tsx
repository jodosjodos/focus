import { useEffect, useRef } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { QuestStatus } from '../types/quest';
import GlassCard from './GlassCard';
import { colors } from '../theme/colors';

export interface QuestCardData {
  id: string;
  title: string;
  description: string;
  isMainQuest: boolean;
  status: QuestStatus;
  resolvedDifficulty: string;
  resolvedTarget: string | null;
  primaryStat: string;
  secondaryStat: string | null;
  xpAwarded: number;
}

// Mirrors apps/backend/src/modules/quests/xp.constants.ts XP_BY_DIFFICULTY —
// used to preview the reward before a pending quest is completed (the
// today-quests response only returns xpAwarded once it's actually earned).
const XP_BY_DIFFICULTY: Record<string, number> = { easy: 10, medium: 20, hard: 35 };

export const STAT_COLOR: Record<string, string> = {
  Discipline: colors.discipline,
  Focus: colors.focus,
  Strength: colors.strength,
  Confidence: colors.confidence,
  Wisdom: colors.wisdom,
  Custom: colors.primary,
};

export default function QuestCard({
  quest,
  onPress,
  onSkip,
}: {
  quest: QuestCardData;
  onPress: () => void;
  onSkip: () => void;
}) {
  const isDone = quest.status !== QuestStatus.PENDING;
  const isComplete = quest.status === QuestStatus.COMPLETE;
  const statColor = STAT_COLOR[quest.primaryStat] ?? colors.primary;
  const displayXp = isComplete
    ? quest.xpAwarded
    : (XP_BY_DIFFICULTY[quest.resolvedDifficulty] ?? 0);

  const pop = useRef(new Animated.Value(isComplete ? 1 : 0)).current;
  useEffect(() => {
    if (isComplete) {
      Animated.sequence([
        Animated.spring(pop, { toValue: 1.15, useNativeDriver: true, speed: 40, bounciness: 12 }),
        Animated.spring(pop, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 4 }),
      ]).start();
    }
  }, [isComplete, pop]);

  return (
    <View style={{ opacity: isDone ? 0.55 : 1, marginBottom: 12 }}>
      <GlassCard
        style={[
          {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.35,
            shadowRadius: 18,
            elevation: 6,
          },
          quest.isMainQuest ? { borderColor: colors.primary, borderWidth: 1.5 } : undefined,
        ]}
      >
        {quest.isMainQuest && (
          <Text className="text-primary font-bold text-xs mb-2 tracking-wide">
            MAIN QUEST
          </Text>
        )}
        <View className="flex-row" style={{ gap: 12 }}>
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 13,
              backgroundColor: `${statColor}22`,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View
              style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: statColor,
              }}
            />
          </View>
          <View className="flex-1">
            <View className="flex-row justify-between items-start" style={{ gap: 10 }}>
              <Text
                className="text-text font-semibold flex-1"
                style={{
                  fontSize: 15,
                  textDecorationLine: isComplete ? 'line-through' : 'none',
                }}
              >
                {quest.title}
              </Text>
              <Pressable onPress={onPress} disabled={isDone} hitSlop={8}>
                <Animated.View
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    borderWidth: 2,
                    borderColor: isComplete ? colors.success : colors.border,
                    backgroundColor: isComplete ? colors.success : 'transparent',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: [{ scale: pop }],
                  }}
                >
                  {isComplete && <Ionicons name="checkmark" size={14} color="#03060d" />}
                </Animated.View>
              </Pressable>
            </View>
            <Text className="text-textMuted" style={{ fontSize: 11.5, marginTop: 4 }}>
              {quest.resolvedDifficulty} · +{displayXp} XP · feeds{' '}
              <Text style={{ color: statColor, fontWeight: '600' }}>{quest.primaryStat}</Text>
            </Text>
          </View>
        </View>

        {quest.status === QuestStatus.SKIPPED && (
          <Text className="text-textMuted font-semibold mt-3">Skipped</Text>
        )}
        {quest.status === QuestStatus.PENDING && (
          <Pressable onPress={onSkip} className="self-start mt-3">
            <Text className="text-textMuted font-semibold text-xs">Skip</Text>
          </Pressable>
        )}
      </GlassCard>
    </View>
  );
}
