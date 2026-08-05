import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { WeeklyQuest } from '../types/weekly-quest';
import { WeeklyQuestStatus } from '../types/weekly-quest';
import { STAT_COLOR } from './QuestCard';
import GlassCard from './GlassCard';
import { colors } from '../theme/colors';

const CATEGORY_ICON: Record<string, keyof typeof Ionicons.glyphMap> = {
  Strength: 'barbell-outline',
  Discipline: 'shield-checkmark-outline',
  Focus: 'radio-outline',
  Wisdom: 'book-outline',
  Confidence: 'flash-outline',
  Custom: 'star-outline',
};

export default function WeeklyQuestCard({ weeklyQuest }: { weeklyQuest: WeeklyQuest }) {
  const color = STAT_COLOR[weeklyQuest.category] ?? colors.primary;
  const icon = CATEGORY_ICON[weeklyQuest.category] ?? 'star-outline';
  const isComplete = weeklyQuest.status === WeeklyQuestStatus.COMPLETE;
  const isFailed = weeklyQuest.status === WeeklyQuestStatus.FAILED;
  const progress = Math.min(1, weeklyQuest.progressCount / weeklyQuest.targetCount);

  return (
    <View style={{ marginBottom: 16 }}>
      <GlassCard
        style={[
          {
            shadowColor: '#000', shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.35, shadowRadius: 18, elevation: 6,
          },
          isComplete ? { borderColor: colors.success, borderWidth: 1.5 } : undefined,
        ]}
      >
        <View className="flex-row items-center" style={{ gap: 10, marginBottom: 10 }}>
          <View
            style={{
              width: 34, height: 34, borderRadius: 10,
              backgroundColor: `${color}22`, alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Ionicons name={icon} size={16} color={color} />
          </View>
          <Text className="text-textMuted" style={{ fontSize: 11, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase' }}>
            Weekly Quest
          </Text>
          {isComplete && (
            <Ionicons name="checkmark-circle" size={16} color={colors.success} style={{ marginLeft: 'auto' }} />
          )}
        </View>

        <Text className="text-text" style={{ fontSize: 15, fontWeight: '600', marginBottom: 10 }}>
          Complete {weeklyQuest.targetCount} <Text style={{ color }}>{weeklyQuest.category}</Text> quests this week
        </Text>

        <View
          style={{
            height: 8, borderRadius: 5, backgroundColor: 'rgba(255,255,255,0.10)',
            overflow: 'hidden', marginBottom: 6,
          }}
        >
          <View
            style={{
              height: '100%', borderRadius: 5,
              backgroundColor: isFailed ? colors.strength : isComplete ? colors.success : color,
              width: `${progress * 100}%`,
            }}
          />
        </View>
        <Text className="text-textMuted" style={{ fontSize: 11.5 }}>
          {isFailed
            ? `${weeklyQuest.progressCount} / ${weeklyQuest.targetCount} — week over`
            : `${weeklyQuest.progressCount} / ${weeklyQuest.targetCount} this week`}
        </Text>
      </GlassCard>
    </View>
  );
}
