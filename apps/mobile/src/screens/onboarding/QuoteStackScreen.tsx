import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  PanResponder,
  Text,
  View,
  type GestureResponderEvent,
  type PanResponderGestureState,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '../../navigation/OnboardingStack';
import { useOnboarding } from '../../state/OnboardingContext';
import { usePreviewProgram } from '../../api/programs';
import PrimaryButton from '../../components/PrimaryButton';
import GlassCard from '../../components/GlassCard';
import WordFadeText from '../../components/WordFadeText';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'QuoteStack'>;

const QUOTES = [
  "You have one life. Stop rehearsing for it.",
  "Discipline is choosing what you want most over what you want now.",
  "The version of you that finishes this is waiting on the other side of today.",
];

const RANKS = [
  { scale: 1, translateY: 0, rotate: '0deg', opacity: 1 },
  { scale: 0.94, translateY: 16, rotate: '-6deg', opacity: 0.85 },
  { scale: 0.88, translateY: 30, rotate: '6deg', opacity: 0.6 },
];

export default function QuoteStackScreen({ navigation }: Props) {
  const onboarding = useOnboarding();
  const preview = usePreviewProgram();

  const cardIn = useRef(new Animated.Value(0)).current;
  const restIn = useRef(new Animated.Value(0)).current;

  const [order, setOrder] = useState([0, 1, 2]);
  // PanResponder below is created once via useRef, so its callbacks close over
  // whatever `order` was on the FIRST render forever. Route all reads/writes
  // through this ref (stable identity, always current) instead of the `order`
  // state var so taps after the first one operate on the real current stack.
  const orderRef = useRef(order);
  const pan = useRef(new Animated.ValueXY()).current;
  const scaleAnim = useRef(QUOTES.map((_, i) => new Animated.Value(RANKS[i].scale))).current;
  const translateYAnim = useRef(
    QUOTES.map((_, i) => new Animated.Value(RANKS[i].translateY)),
  ).current;
  const opacityAnim = useRef(QUOTES.map((_, i) => new Animated.Value(RANKS[i].opacity))).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(cardIn, {
        toValue: 1,
        useNativeDriver: true,
        speed: 10,
        bounciness: 9,
      }),
      Animated.timing(restIn, {
        toValue: 1,
        duration: 420,
        useNativeDriver: true,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const advance = (direction: 1 | -1) => {
    const currentOrder = orderRef.current;
    const frontIndex = currentOrder[0];
    Animated.parallel([
      Animated.timing(pan, {
        toValue: { x: direction * 420, y: direction * 30 },
        duration: 260,
        useNativeDriver: false,
      }),
      Animated.timing(opacityAnim[frontIndex], {
        toValue: 0,
        duration: 260,
        useNativeDriver: false,
      }),
    ]).start(() => {
      const newOrder = [...currentOrder.slice(1), frontIndex];
      // snap the outgoing card to its new back-of-stack slot while invisible,
      // so it reappears by fading/sliding in rather than popping in fully opaque
      scaleAnim[frontIndex].setValue(RANKS[2].scale);
      translateYAnim[frontIndex].setValue(RANKS[2].translateY);
      pan.setValue({ x: 0, y: 0 });
      orderRef.current = newOrder;
      setOrder(newOrder);

      newOrder.forEach((quoteIndex, rank) => {
        Animated.spring(scaleAnim[quoteIndex], {
          toValue: RANKS[rank].scale,
          useNativeDriver: false,
          speed: 14,
          bounciness: 6,
        }).start();
        Animated.spring(translateYAnim[quoteIndex], {
          toValue: RANKS[rank].translateY,
          useNativeDriver: false,
          speed: 14,
          bounciness: 6,
        }).start();
        Animated.timing(opacityAnim[quoteIndex], {
          toValue: RANKS[rank].opacity,
          duration: 280,
          useNativeDriver: false,
        }).start();
      });
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_e: GestureResponderEvent, g: PanResponderGestureState) => {
        const moved = Math.abs(g.dx) + Math.abs(g.dy);
        if (moved < 8) {
          advance(1);
          return;
        }
        if (Math.abs(g.dx) > 90) {
          advance(g.dx > 0 ? 1 : -1);
          return;
        }
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
          speed: 20,
          bounciness: 8,
        }).start();
      },
    }),
  ).current;

  const handleReady = async () => {
    const { improvementAreas, baseline, programLength, notWorkingText } = onboarding;
    const data = await preview.mutateAsync({
      improvementAreas,
      baseline: baseline as Required<typeof baseline>,
      programLength,
      notWorkingText: notWorkingText || undefined,
    });
    onboarding.setPreview(data);
    navigation.navigate('BaselineResult');
  };

  const cardOpacity = cardIn;
  const cardScale = cardIn.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] });
  const cardTranslate = cardIn.interpolate({ inputRange: [0, 1], outputRange: [24, 0] });
  const dragRotate = pan.x.interpolate({
    inputRange: [-250, 0, 250],
    outputRange: ['-14deg', '0deg', '14deg'],
  });

  const restStyle = {
    opacity: restIn,
    transform: [
      { translateY: restIn.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) },
    ],
  };

  return (
    <View className="flex-1 bg-background items-center justify-center px-7" style={{ gap: 28 }}>
      <LinearGradient
        colors={[`${colors.primary}33`, colors.background]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '60%' }}
      />
      <Animated.View
        style={{
          width: 230,
          height: 170,
          position: 'relative',
          opacity: cardOpacity,
          transform: [{ scale: cardScale }, { translateY: cardTranslate }],
        }}
      >
        {order
          .map((quoteIndex, rank) => ({ quoteIndex, rank }))
          .sort((a, b) => b.rank - a.rank)
          .map(({ quoteIndex, rank }) => {
          const isFront = rank === 0;
          const staticTransform = [
            { translateY: translateYAnim[quoteIndex] },
            { scale: scaleAnim[quoteIndex] },
            { rotate: RANKS[rank].rotate },
          ];
          const dragTransform = [
            { translateX: pan.x },
            { translateY: Animated.add(pan.y, translateYAnim[quoteIndex]) },
            { scale: scaleAnim[quoteIndex] },
            { rotate: dragRotate },
          ];
          return (
            <Animated.View
              key={quoteIndex}
              {...(isFront ? panResponder.panHandlers : {})}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 140,
                zIndex: 3 - rank,
                opacity: opacityAnim[quoteIndex],
                transform: isFront ? dragTransform : staticTransform,
              }}
            >
              <GlassCard
                style={{
                  flex: 1,
                  borderRadius: 16,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text
                  className="font-display text-text text-center"
                  style={{ fontSize: 15, paddingHorizontal: 4 }}
                >
                  "{QUOTES[quoteIndex]}"
                </Text>
              </GlassCard>
            </Animated.View>
          );
        })}
      </Animated.View>

      <Animated.View style={[{ alignItems: 'center' }, restStyle]}>
        <Text className="text-textMuted" style={{ fontSize: 12 }}>
          tap or swipe the card
        </Text>
      </Animated.View>

      <Animated.View style={[{ alignItems: 'center' }, restStyle]}>
        <WordFadeText
          text="Let's build it."
          boldWords={["Let's", 'build']}
          staggerMs={80}
          startDelayMs={0}
          style={{ fontSize: 24, color: colors.text, textAlign: 'center' }}
        />
      </Animated.View>

      <Animated.View style={[{ alignItems: 'center' }, restStyle]}>
        <WordFadeText
          text="Focus turns distractions into reminders of who you're becoming."
          staggerMs={40}
          startDelayMs={220}
          style={{ fontSize: 13.5, color: colors.textMuted, textAlign: 'center', lineHeight: 19 }}
        />
      </Animated.View>

      {preview.isError && (
        <Text className="text-strength text-center">
          Something went wrong building your plan. Try again.
        </Text>
      )}

      <Animated.View style={[{ width: '100%' }, restStyle]}>
        <PrimaryButton label="I'm ready" onPress={handleReady} loading={preview.isPending} />
      </Animated.View>
    </View>
  );
}
