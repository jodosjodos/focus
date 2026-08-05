import { Modal, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { AchievementUnlock } from '../types/achievement';
import PrimaryButton from './PrimaryButton';
import { colors } from '../theme/colors';

export default function MilestoneCelebrationOverlay({
  unlock,
  onContinue,
  loading,
}: {
  unlock: AchievementUnlock;
  onContinue: () => void;
  loading: boolean;
}) {
  const { achievement, statsSnapshot } = unlock;
  const color = achievement.colorKey;

  return (
    <Modal visible transparent animationType="fade">
      <View className="flex-1 bg-background">
        <LinearGradient
          colors={[`${color}44`, colors.background]}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '55%' }}
        />
        <View className="flex-1 px-6 pt-24 items-center">
          <View
            style={{
              width: 100, height: 100, borderRadius: 50,
              backgroundColor: `${color}22`, borderWidth: 1.5, borderColor: `${color}66`,
              alignItems: 'center', justifyContent: 'center', marginBottom: 20,
            }}
          >
            <Ionicons name={achievement.iconKey as keyof typeof Ionicons.glyphMap} size={44} color={color} />
          </View>

          <Text className="text-textMuted" style={{ fontSize: 12.5, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' }}>
            Milestone Reached
          </Text>
          <Text className="font-display text-text text-center" style={{ fontSize: 26, marginTop: 8 }}>
            {achievement.title}
          </Text>
          <Text
            className="text-center"
            style={{ color: colors.text, fontSize: 15, lineHeight: 22, marginTop: 14, fontStyle: 'italic' }}
          >
            "{achievement.quoteOrDescription}"
          </Text>

          {statsSnapshot && (
            <View className="w-full" style={{ marginTop: 28, gap: 10 }}>
              <Text className="text-textMuted" style={{ fontSize: 11, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase' }}>
                Day 1 vs Now
              </Text>
              {Object.keys(statsSnapshot.baseline).map((key) => (
                <View
                  key={key}
                  className="flex-row items-center justify-between"
                  style={{
                    backgroundColor: colors.surface, borderRadius: 12, padding: 12,
                    borderWidth: 1, borderColor: colors.border,
                  }}
                >
                  <Text style={{ color: colors.text, fontSize: 13.5, textTransform: 'capitalize' }}>{key}</Text>
                  <Text style={{ fontSize: 13.5 }}>
                    <Text style={{ color: colors.textMuted }}>{statsSnapshot.baseline[key]}</Text>
                    <Text style={{ color: colors.textMuted }}> → </Text>
                    <Text style={{ color, fontWeight: '700' }}>{statsSnapshot.current[key]}</Text>
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View className="px-6" style={{ paddingBottom: 40 }}>
          <PrimaryButton label="Continue" onPress={onContinue} loading={loading} />
        </View>
      </View>
    </Modal>
  );
}
