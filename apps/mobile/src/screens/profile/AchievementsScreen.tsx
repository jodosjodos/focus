import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '../../navigation/ProfileStack';
import { useSession } from '../../state/SessionContext';
import { useAchievementsGrid } from '../../api/achievements';
import { AchievementGridItem, AchievementType } from '../../types/achievement';
import GlassCard from '../../components/GlassCard';
import BackButton from '../../components/BackButton';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Achievements'>;

const CARD_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.35,
  shadowRadius: 18,
  elevation: 6,
};

function AchievementTile({
  item,
  onPress,
}: {
  item: AchievementGridItem;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} disabled={!item.unlocked} style={{ width: '48%' }}>
      <GlassCard
        style={[
          CARD_SHADOW,
          { alignItems: 'center', paddingVertical: 22 },
          item.unlocked ? { borderColor: `${item.colorKey}55`, borderWidth: 1.5 } : undefined,
        ]}
      >
        <View
          style={{
            width: 52, height: 52, borderRadius: 26,
            backgroundColor: item.unlocked ? `${item.colorKey}22` : 'rgba(255,255,255,0.05)',
            alignItems: 'center', justifyContent: 'center', marginBottom: 10,
          }}
        >
          {item.unlocked ? (
            <Ionicons name={item.iconKey as keyof typeof Ionicons.glyphMap} size={24} color={item.colorKey} />
          ) : (
            <Text style={{ color: colors.textMuted, fontSize: 20, fontWeight: '700' }}>?</Text>
          )}
        </View>
        <Text
          className="text-center"
          style={{
            fontSize: 12.5, fontWeight: '600', paddingHorizontal: 6,
            color: item.unlocked ? colors.text : colors.textMuted,
          }}
          numberOfLines={2}
        >
          {item.title ?? (item.type === AchievementType.MILESTONE ? '???' : 'Hidden')}
        </Text>
        {!item.unlocked && item.unlockConditionText && (
          <Text
            className="text-center"
            style={{ fontSize: 10.5, color: colors.textMuted, marginTop: 4, paddingHorizontal: 8 }}
            numberOfLines={2}
          >
            {item.unlockConditionText}
          </Text>
        )}
      </GlassCard>
    </Pressable>
  );
}

export default function AchievementsScreen({ navigation }: Props) {
  const { programId } = useSession();
  const grid = useAchievementsGrid(programId);

  if (grid.isPending) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  const items = grid.data ?? [];
  const unlockedCount = items.filter((i) => i.unlocked).length;

  return (
    <View className="flex-1 bg-background px-6 pt-16">
      <LinearGradient
        colors={[`${colors.primary}33`, colors.background]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '60%' }}
      />
      <BackButton label="Profile" onPress={() => navigation.goBack()} style={{ marginBottom: 14 }} />
      <Text className="font-display text-text" style={{ fontSize: 22 }}>
        Achievements
      </Text>
      <Text className="text-textMuted" style={{ fontSize: 12.5, marginTop: 2, marginBottom: 18 }}>
        {unlockedCount} of {items.length} unlocked
      </Text>

      <View className="flex-row flex-wrap justify-between" style={{ gap: 12, paddingBottom: 24 }}>
        {items.map((item) => (
          <AchievementTile
            key={item.id}
            item={item}
            onPress={() => navigation.navigate('AchievementDetail', { item })}
          />
        ))}
      </View>
    </View>
  );
}
