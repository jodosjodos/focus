import { Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '../../navigation/ProfileStack';
import GlassCard from '../../components/GlassCard';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<ProfileStackParamList, 'AchievementDetail'>;

const CARD_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 12 },
  shadowOpacity: 0.4,
  shadowRadius: 22,
  elevation: 8,
};

export default function AchievementDetailScreen({ navigation, route }: Props) {
  const { item } = route.params;

  return (
    <View className="flex-1 bg-background px-6 pt-16">
      <LinearGradient
        colors={[`${item.colorKey}33`, colors.background]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '60%' }}
      />
      <Pressable onPress={() => navigation.goBack()} style={{ marginBottom: 14 }} hitSlop={8}>
        <Text className="text-textMuted" style={{ fontSize: 13 }}>‹ Achievements</Text>
      </Pressable>

      <View className="items-center" style={{ marginTop: 20, marginBottom: 24 }}>
        <View
          style={{
            width: 96, height: 96, borderRadius: 48,
            backgroundColor: `${item.colorKey}22`, borderWidth: 1.5, borderColor: `${item.colorKey}55`,
            alignItems: 'center', justifyContent: 'center', marginBottom: 16,
          }}
        >
          {item.iconKey && (
            <Ionicons name={item.iconKey as keyof typeof Ionicons.glyphMap} size={40} color={item.colorKey} />
          )}
        </View>
        <Text className="font-display text-text text-center" style={{ fontSize: 22 }}>
          {item.title}
        </Text>
        {item.unlockedAt && (
          <Text className="text-textMuted" style={{ fontSize: 12, marginTop: 4 }}>
            Unlocked {new Date(item.unlockedAt).toLocaleDateString()}
          </Text>
        )}
      </View>

      {item.quoteOrDescription && (
        <GlassCard style={[CARD_SHADOW, { marginBottom: 14 }]}>
          <Text style={{ color: colors.text, fontSize: 15, lineHeight: 22, fontStyle: 'italic' }}>
            "{item.quoteOrDescription}"
          </Text>
        </GlassCard>
      )}

      {item.unlockConditionText && (
        <GlassCard style={CARD_SHADOW}>
          <Text style={{ color: colors.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 0.5, marginBottom: 6, textTransform: 'uppercase' }}>
            How you unlocked it
          </Text>
          <Text style={{ color: colors.text, fontSize: 13.5, lineHeight: 19 }}>
            {item.unlockConditionText}
          </Text>
        </GlassCard>
      )}

      {item.statsSnapshot && (
        <GlassCard style={[CARD_SHADOW, { marginTop: 14 }]}>
          <Text style={{ color: colors.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 0.5, marginBottom: 10, textTransform: 'uppercase' }}>
            Day 1 vs Now
          </Text>
          {(() => {
            const snapshot = item.statsSnapshot;
            return Object.keys(snapshot.baseline).map((key) => (
              <View key={key} className="flex-row items-center justify-between" style={{ marginBottom: 6 }}>
                <Text style={{ color: colors.text, fontSize: 13, textTransform: 'capitalize' }}>{key}</Text>
                <Text style={{ color: colors.textMuted, fontSize: 13 }}>
                  {snapshot.baseline[key]} <Text style={{ color: item.colorKey }}>→ {snapshot.current[key]}</Text>
                </Text>
              </View>
            ));
          })()}
        </GlassCard>
      )}
    </View>
  );
}
