import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSession } from '../../state/SessionContext';
import { useProgramStats } from '../../api/programs';
import StatBar from '../../components/StatBar';
import GlassCard from '../../components/GlassCard';
import RatingRing from '../../components/RatingRing';
import { colors } from '../../theme/colors';

type Mode = 'current' | 'potential';

const CARD_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.35,
  shadowRadius: 18,
  elevation: 6,
} as const;

export default function StatsScreen() {
  const { programId } = useSession();
  const stats = useProgramStats(programId);
  const [mode, setMode] = useState<Mode>('current');

  if (stats.isPending) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (stats.isError || !stats.data) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-6">
        <Text className="text-strength text-center">Couldn't load your stats.</Text>
      </View>
    );
  }

  const {
    current,
    potential,
    totalXp,
    currentLevel,
    streakCount,
    longestStreak,
    totalQuestsCompleted,
  } = stats.data;

  const activeSnapshot = mode === 'current' ? current : potential;
  const overallRating = Math.round(
    (activeSnapshot.discipline +
      activeSnapshot.focus +
      activeSnapshot.strength +
      activeSnapshot.confidence +
      activeSnapshot.wisdom) /
      5,
  );

  return (
    <View className="flex-1 bg-background">
      <LinearGradient
        colors={[`${colors.primary}33`, colors.background]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '60%' }}
      />
      <ScrollView className="flex-1" contentContainerClassName="px-6 pt-16 pb-6">
      <Text className="font-display text-2xl text-text mb-4">Stats</Text>

      <GlassCard style={[CARD_SHADOW, { marginBottom: 16 }]}>
        <View className="flex-row items-center" style={{ gap: 18 }}>
          <RatingRing value={overallRating} />
          <View className="flex-1">
            <Text className="text-textMuted" style={{ fontSize: 12.5, marginBottom: 8 }}>
              Level {currentLevel} · {totalQuestsCompleted} quests done
            </Text>
            <View className="flex-row" style={{ gap: 8 }}>
              {(['current', 'potential'] as Mode[]).map((m) => (
                <Pressable
                  key={m}
                  onPress={() => setMode(m)}
                  style={{
                    flex: 1,
                    paddingVertical: 8,
                    borderRadius: 10,
                    alignItems: 'center',
                    backgroundColor: mode === m ? colors.primary : 'transparent',
                    borderWidth: mode === m ? 0 : 1,
                    borderColor: colors.border,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '700',
                      textTransform: 'capitalize',
                      color: mode === m ? '#fff' : colors.textMuted,
                    }}
                  >
                    {m}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </GlassCard>

      <GlassCard style={[CARD_SHADOW, { marginBottom: 16 }]}>
        {(['discipline', 'focus', 'strength', 'confidence', 'wisdom'] as const).map(
          (stat) => (
            <StatBar
              key={stat}
              label={stat}
              value={mode === 'current' ? current[stat] : potential[stat]}
              potential={mode === 'current' ? potential[stat] : undefined}
            />
          ),
        )}
      </GlassCard>

      <View className="flex-row" style={{ gap: 10 }}>
        <GlassCard style={[CARD_SHADOW, { flex: 1 }]}>
          <Text className="font-display text-text text-center" style={{ fontSize: 18 }}>
            {totalXp}
          </Text>
          <Text className="text-textMuted text-center" style={{ fontSize: 10.5, marginTop: 3 }}>
            Total XP
          </Text>
        </GlassCard>
        <GlassCard style={[CARD_SHADOW, { flex: 1 }]}>
          <View className="flex-row items-center justify-center" style={{ gap: 4 }}>
            <Ionicons name="flame" size={15} color={colors.primary} />
            <Text className="font-display text-text" style={{ fontSize: 18 }}>{streakCount}</Text>
          </View>
          <Text className="text-textMuted text-center" style={{ fontSize: 10.5, marginTop: 3 }}>
            Day Streak
          </Text>
        </GlassCard>
        <GlassCard style={[CARD_SHADOW, { flex: 1 }]}>
          <Text className="font-display text-text text-center" style={{ fontSize: 18 }}>
            {longestStreak}
          </Text>
          <Text className="text-textMuted text-center" style={{ fontSize: 10.5, marginTop: 3 }}>
            Longest
          </Text>
        </GlassCard>
      </View>
      </ScrollView>
    </View>
  );
}
