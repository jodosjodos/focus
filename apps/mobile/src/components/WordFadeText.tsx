import { useEffect, useRef } from 'react';
import { Animated, type StyleProp, type TextStyle, View } from 'react-native';

// Splits text into words and fades each one in with a stagger, matching the
// "sentence builds up word by word" reveal used on the reference app's hook
// screens — reserved for the Landing headline (single use, not reused
// app-wide yet; see DEFERRED-IMPLEMENTATION.md).
//
// Words listed in `boldWords` render in the display font at full weight;
// everything else renders at normal weight — mirrors the reference's
// bold-first/bold-last-phrase emphasis instead of bolding the whole line.
export default function WordFadeText({
  text,
  style,
  boldWords = [],
  staggerMs = 90,
  startDelayMs = 150,
}: {
  text: string;
  style?: StyleProp<TextStyle>;
  boldWords?: string[];
  staggerMs?: number;
  startDelayMs?: number;
}) {
  const words = text.split(' ');
  const opacities = useRef(words.map(() => new Animated.Value(0))).current;
  const boldSet = new Set(boldWords.map((w) => w.toLowerCase()));

  useEffect(() => {
    Animated.stagger(
      staggerMs,
      opacities.map((value) =>
        Animated.timing(value, {
          toValue: 1,
          duration: 260,
          useNativeDriver: true,
          delay: startDelayMs,
        }),
      ),
    ).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
      {words.map((word, i) => {
        const clean = word.replace(/[^a-zA-Z']/g, '').toLowerCase();
        const isBold = boldSet.has(clean);
        return (
          <Animated.Text
            key={`${word}-${i}`}
            style={[
              style,
              {
                opacity: opacities[i],
                marginRight: 8,
                fontFamily: isBold ? 'Nunito_800ExtraBold' : 'Nunito_400Regular',
              },
            ]}
          >
            {word}
          </Animated.Text>
        );
      })}
    </View>
  );
}
