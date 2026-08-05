import { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function QuestCompleteBurst({
  xp,
  onDone,
}: {
  xp: number;
  onDone: () => void;
}) {
  const scale = useRef(new Animated.Value(0.6)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 18, bounciness: 14 }),
        Animated.timing(opacity, { toValue: 1, duration: 150, useNativeDriver: true }),
      ]),
      Animated.delay(600),
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 250, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1.15, duration: 250, useNativeDriver: true }),
      ]),
    ]).start(({ finished }) => {
      if (finished) onDone();
    });
  }, [scale, opacity, onDone]);

  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        alignItems: 'center', justifyContent: 'center', zIndex: 40,
      }}
    >
      <Animated.View
        style={{
          opacity,
          transform: [{ scale }],
          backgroundColor: colors.surface,
          borderWidth: 1.5,
          borderColor: `${colors.success}66`,
          borderRadius: 24,
          paddingVertical: 20,
          paddingHorizontal: 28,
          alignItems: 'center',
          gap: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.4,
          shadowRadius: 22,
          elevation: 8,
        }}
      >
        <View
          style={{
            width: 48, height: 48, borderRadius: 24,
            backgroundColor: `${colors.success}22`,
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Ionicons name="checkmark" size={26} color={colors.success} />
        </View>
        <Text className="font-display" style={{ color: colors.success, fontSize: 20 }}>
          +{xp} XP
        </Text>
      </Animated.View>
    </View>
  );
}
