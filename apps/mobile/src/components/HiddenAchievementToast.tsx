import { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { AchievementUnlock } from '../types/achievement';
import { colors } from '../theme/colors';

export default function HiddenAchievementToast({
  unlock,
  onDone,
}: {
  unlock: AchievementUnlock;
  onDone: () => void;
}) {
  const { achievement } = unlock;
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(anim, { toValue: 1, useNativeDriver: true, speed: 16, bounciness: 8 }),
      Animated.delay(2600),
      Animated.timing(anim, { toValue: 0, duration: 250, useNativeDriver: true }),
    ]).start(({ finished }) => {
      if (finished) onDone();
    });
  }, [anim, onDone]);

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute', top: 60, left: 20, right: 20, zIndex: 50,
        opacity: anim,
        transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [-24, 0] }) }],
      }}
    >
      <View
        className="flex-row items-center"
        style={{
          backgroundColor: colors.surface, borderRadius: 16, padding: 14, gap: 12,
          borderWidth: 1, borderColor: `${achievement.colorKey}55`,
          shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 16, elevation: 6,
        }}
      >
        <View
          style={{
            width: 40, height: 40, borderRadius: 20,
            backgroundColor: `${achievement.colorKey}22`,
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Ionicons name={achievement.iconKey as keyof typeof Ionicons.glyphMap} size={18} color={achievement.colorKey} />
        </View>
        <View className="flex-1">
          <Text style={{ color: colors.textMuted, fontSize: 10.5, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase' }}>
            Achievement Unlocked
          </Text>
          <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600', marginTop: 1 }}>
            {achievement.title}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}
