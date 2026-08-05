import { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function LevelUpBurst({
  level,
  onDone,
}: {
  level: number;
  onDone: () => void;
}) {
  const translateY = useRef(new Animated.Value(-120)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, speed: 14, bounciness: 10 }),
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]),
      Animated.delay(1400),
      Animated.parallel([
        Animated.timing(translateY, { toValue: -120, duration: 300, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 250, useNativeDriver: true }),
      ]),
    ]).start(({ finished }) => {
      if (finished) onDone();
    });
  }, [translateY, opacity, onDone]);

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute', top: 56, left: 16, right: 16, zIndex: 45,
        opacity,
        transform: [{ translateY }],
      }}
    >
      <View
        style={{
          borderRadius: 20, overflow: 'hidden', borderWidth: 1.5, borderColor: `${colors.primary}66`,
          shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.4, shadowRadius: 22, elevation: 8,
        }}
      >
        <LinearGradient colors={[colors.primary, '#2563EB']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <View className="flex-row items-center" style={{ gap: 14, padding: 18 }}>
            <View
              style={{
                width: 48, height: 48, borderRadius: 24,
                backgroundColor: 'rgba(255,255,255,0.18)',
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Ionicons name="trophy" size={24} color="#FFFFFF" />
            </View>
            <View>
              <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11.5, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase' }}>
                Level Up
              </Text>
              <Text className="font-display" style={{ color: '#FFFFFF', fontSize: 22, marginTop: 2 }}>
                Level {level}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    </Animated.View>
  );
}
