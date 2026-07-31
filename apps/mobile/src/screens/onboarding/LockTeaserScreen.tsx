import { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '../../navigation/OnboardingStack';
import PrimaryButton from '../../components/PrimaryButton';
import WordFadeText from '../../components/WordFadeText';
import GlassCard from '../../components/GlassCard';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'LockTeaser'>;

export default function LockTeaserScreen({ navigation }: Props) {
  const blocks = useRef([0, 1, 2, 3].map(() => new Animated.Value(0))).current;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(
      160,
      blocks.map((v) =>
        Animated.timing(v, {
          toValue: 1,
          duration: 460,
          useNativeDriver: true,
        }),
      ),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 1000, useNativeDriver: true }),
      ]),
    ).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const enter = (v: Animated.Value) => ({
    opacity: v,
    transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [18, 0] }) }],
  });

  const glowScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] });
  const glowOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0.7] });

  return (
    <View className="flex-1 bg-background items-center justify-center px-7" style={{ gap: 30 }}>
      <LinearGradient
        colors={[`${colors.primary}33`, colors.background]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '60%' }}
      />

      <Animated.View style={[{ alignItems: 'center' }, enter(blocks[0])]}>
        <Animated.View
          style={{
            position: 'absolute',
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: colors.primary,
            opacity: glowOpacity,
            transform: [{ scale: glowScale }],
          }}
        />
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: `${colors.primary}22`,
            borderWidth: 1,
            borderColor: `${colors.primary}55`,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 14,
          }}
        >
          <Ionicons name="lock-closed" size={22} color={colors.primary} />
        </View>
        <Text className="font-display text-text" style={{ fontSize: 52 }}>9:41</Text>
        <Text className="text-textMuted mt-1">Monday, June 6</Text>
      </Animated.View>

      <Animated.View style={[{ width: '100%' }, enter(blocks[1])]}>
        <GlassCard style={{ width: '100%' }}>
          <View className="flex-row gap-3">
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 9,
                backgroundColor: colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="flash" size={16} color="#FFFFFF" />
            </View>
            <View className="flex-1">
              <View className="flex-row justify-between">
                <Text className="text-text font-bold" style={{ fontSize: 12.5 }}>Focus</Text>
                <Text className="text-textMuted" style={{ fontSize: 11 }}>now</Text>
              </View>
              <Text className="text-text mt-0.5" style={{ fontSize: 13 }}>
                You'll run out of "one days" eventually.
              </Text>
            </View>
          </View>
        </GlassCard>
      </Animated.View>

      <Animated.View style={[{ alignItems: 'center' }, enter(blocks[2])]}>
        <WordFadeText
          text="This could be your day 66."
          boldWords={['day', '66.']}
          staggerMs={70}
          startDelayMs={0}
          style={{ fontSize: 24, color: colors.text, textAlign: 'center' }}
        />
      </Animated.View>

      <Animated.View style={[{ width: '100%' }, enter(blocks[3])]}>
        <PrimaryButton label="Continue" onPress={() => navigation.navigate('QuoteStack')} />
      </Animated.View>
    </View>
  );
}
