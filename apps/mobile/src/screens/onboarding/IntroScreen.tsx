import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '../../navigation/OnboardingStack';
import QuizProgressBar from '../../components/QuizProgressBar';
import WordFadeText from '../../components/WordFadeText';
import PrimaryButton from '../../components/PrimaryButton';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Intro'>;

const TOTAL_STEPS = 3;

// Headline word count × staggerMs(90) + its own startDelayMs(150) is when the
// headline's last word finishes fading in — subtext starts after that so the
// two lines read as one sequence, not two overlapping animations.
const STEPS: { headline: string; boldWords: string[]; subtext: string }[] = [
  {
    headline: "You already know what you should be doing.",
    boldWords: ['know', 'doing'],
    subtext: "Knowing isn't the problem. Nothing's held you to it — until now.",
  },
  {
    headline: 'Five stats. One you, rising every single day.',
    boldWords: ['Five', 'stats.', 'rising'],
    subtext:
      'Discipline, Focus, Strength, Confidence, Wisdom — a plan built from your real answers, not luck.',
  },
  {
    headline: "This isn't attempt number twelve. It's day one that sticks.",
    boldWords: ['day', 'one', 'sticks.'],
    subtext: '66 days. Real quests. A version of you worth becoming.',
  },
];

export default function IntroScreen({ navigation }: Props) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];

  const headlineWordCount = current.headline.split(' ').length;
  const subtextDelay = 150 + headlineWordCount * 90 + 260 + 120;

  const goNext = () => {
    if (step < TOTAL_STEPS - 1) {
      setStep((s) => s + 1);
    } else {
      navigation.navigate('Age');
    }
  };

  return (
    <View className="flex-1 bg-background">
      <LinearGradient
        colors={[`${colors.primary}33`, colors.background]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '60%' }}
      />
      <View className="flex-row items-center px-4 pt-4" style={{ height: 40 }}>
        {step > 0 && (
          <Pressable onPress={() => setStep((s) => s - 1)} className="p-2">
            <Text className="text-text text-lg">{'<'}</Text>
          </Pressable>
        )}
      </View>
      <QuizProgressBar step={step} totalSteps={TOTAL_STEPS} />

      <View className="flex-1 px-6 justify-center" key={step}>
        <WordFadeText
          text={current.headline}
          boldWords={current.boldWords}
          style={{ fontSize: 28, color: colors.text, lineHeight: 34 }}
        />
        <View style={{ marginTop: 16 }}>
          <WordFadeText
            text={current.subtext}
            startDelayMs={subtextDelay}
            staggerMs={45}
            style={{ fontSize: 16, color: colors.textMuted, lineHeight: 24 }}
          />
        </View>
      </View>

      <View className="px-6 pb-24">
        <PrimaryButton label="Next" onPress={goNext} />
      </View>
    </View>
  );
}
