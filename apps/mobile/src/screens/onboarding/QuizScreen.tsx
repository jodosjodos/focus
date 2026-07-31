import { useState } from 'react';
import { ScrollView, Text, TextInput, View, Pressable } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '../../navigation/OnboardingStack';
import QuizProgressBar from '../../components/QuizProgressBar';
import OptionButton from '../../components/OptionButton';
import PrimaryButton from '../../components/PrimaryButton';
import { useOnboarding } from '../../state/OnboardingContext';
import {
  ExerciseFrequencyTier,
  ImprovementArea,
  ScreenTimeHoursTier,
  SleepHoursTier,
  WaterLitersTier,
} from '../../types/onboarding';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Quiz'>;

const TOTAL_STEPS = 7;

const AREA_OPTIONS = Object.values(ImprovementArea);

const SLEEP_OPTIONS: [string, SleepHoursTier][] = [
  ['Under 5h', SleepHoursTier.UNDER_5],
  ['5–6h', SleepHoursTier.FIVE_TO_SIX],
  ['6–7h', SleepHoursTier.SIX_TO_SEVEN],
  ['7–8h', SleepHoursTier.SEVEN_TO_EIGHT],
  ['8+h', SleepHoursTier.EIGHT_PLUS],
];

const WATER_OPTIONS: [string, WaterLitersTier][] = [
  ['Under 1L', WaterLitersTier.UNDER_1L],
  ['1–2L', WaterLitersTier.ONE_TO_TWO_L],
  ['2–3L', WaterLitersTier.TWO_TO_THREE_L],
  ['3L+', WaterLitersTier.THREE_PLUS_L],
];

const EXERCISE_OPTIONS: [string, ExerciseFrequencyTier][] = [
  ['Never', ExerciseFrequencyTier.NEVER],
  ['1–2x a week', ExerciseFrequencyTier.ONE_TO_TWO],
  ['3+ times a week', ExerciseFrequencyTier.THREE_PLUS],
];

const SCREEN_TIME_OPTIONS: [string, ScreenTimeHoursTier][] = [
  ['Under 2h', ScreenTimeHoursTier.UNDER_2],
  ['2–4h', ScreenTimeHoursTier.TWO_TO_FOUR],
  ['4–6h', ScreenTimeHoursTier.FOUR_TO_SIX],
  ['6+h', ScreenTimeHoursTier.SIX_PLUS],
];

const LENGTH_OPTIONS = [21, 33, 50, 66];

export default function QuizScreen({ navigation }: Props) {
  const [step, setStep] = useState(0);
  const onboarding = useOnboarding();

  const goBack = () => {
    if (step === 0) {
      navigation.goBack();
    } else {
      setStep((s) => s - 1);
    }
  };

  const goNext = () => {
    if (step < TOTAL_STEPS - 1) {
      setStep((s) => s + 1);
      return;
    }
    navigation.navigate('Distraction');
  };

  const toggleArea = (area: ImprovementArea) => {
    const current = onboarding.improvementAreas;
    if (current.includes(area)) {
      onboarding.setImprovementAreas(current.filter((a) => a !== area));
    } else if (current.length < 5) {
      onboarding.setImprovementAreas([...current, area]);
    }
  };

  const canContinue = (): boolean => {
    switch (step) {
      case 0:
        return onboarding.improvementAreas.length >= 3;
      case 1:
        return !!onboarding.baseline.sleepHours;
      case 2:
        return !!onboarding.baseline.waterLiters;
      case 3:
        return !!onboarding.baseline.exerciseFrequency;
      case 4:
        return !!onboarding.baseline.screenTimeHours;
      case 5:
        return !!onboarding.programLength;
      case 6:
        return true;
      default:
        return false;
    }
  };

  return (
    <View className="flex-1 bg-background">
          <LinearGradient
        colors={[`${colors.primary}33`, colors.background]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '60%' }}
      />
      <View className="flex-row items-center px-4 pt-4">
        <Pressable onPress={goBack} className="p-2">
          <Text className="text-text text-lg">{'<'}</Text>
        </Pressable>
      </View>
      <QuizProgressBar step={step} totalSteps={TOTAL_STEPS} />

      <ScrollView className="flex-1 px-6 pt-6" contentContainerClassName="pb-6">
        {step === 0 && (
          <>
            <Text className="text-2xl font-bold text-text mb-1">
              What do you want to improve?
            </Text>
            <Text className="text-textMuted mb-6">
              Pick 3 to 5. This shapes your whole plan.
            </Text>
            <View className="flex-row flex-wrap justify-between">
              {AREA_OPTIONS.map((area) => (
                <View key={area} style={{ width: '48%' }}>
                  <OptionButton
                    label={area}
                    selected={onboarding.improvementAreas.includes(area)}
                    onPress={() => toggleArea(area)}
                    disabled={
                      onboarding.improvementAreas.length >= 5 &&
                      !onboarding.improvementAreas.includes(area)
                    }
                  />
                </View>
              ))}
            </View>
          </>
        )}

        {step === 1 && (
          <>
            <Text className="text-2xl font-bold text-text mb-6">
              How much do you usually sleep?
            </Text>
            {SLEEP_OPTIONS.map(([label, value]) => (
              <OptionButton
                key={value}
                label={label}
                selected={onboarding.baseline.sleepHours === value}
                onPress={() => onboarding.setBaselineAnswer('sleepHours', value)}
              />
            ))}
          </>
        )}

        {step === 2 && (
          <>
            <Text className="text-2xl font-bold text-text mb-6">
              How much water do you drink on a normal day?
            </Text>
            {WATER_OPTIONS.map(([label, value]) => (
              <OptionButton
                key={value}
                label={label}
                selected={onboarding.baseline.waterLiters === value}
                onPress={() => onboarding.setBaselineAnswer('waterLiters', value)}
              />
            ))}
          </>
        )}

        {step === 3 && (
          <>
            <Text className="text-2xl font-bold text-text mb-6">
              How often do you currently exercise?
            </Text>
            {EXERCISE_OPTIONS.map(([label, value]) => (
              <OptionButton
                key={value}
                label={label}
                selected={onboarding.baseline.exerciseFrequency === value}
                onPress={() =>
                  onboarding.setBaselineAnswer('exerciseFrequency', value)
                }
              />
            ))}
          </>
        )}

        {step === 4 && (
          <>
            <Text className="text-2xl font-bold text-text mb-6">
              About how much screen time do you get in a day?
            </Text>
            {SCREEN_TIME_OPTIONS.map(([label, value]) => (
              <OptionButton
                key={value}
                label={label}
                selected={onboarding.baseline.screenTimeHours === value}
                onPress={() =>
                  onboarding.setBaselineAnswer('screenTimeHours', value)
                }
              />
            ))}
          </>
        )}

        {step === 5 && (
          <>
            <Text className="text-2xl font-bold text-text mb-1">
              How long do you want to commit?
            </Text>
            <Text className="text-textMuted mb-6">
              66 days is the full program. You can start shorter — 21 days
              minimum.
            </Text>
            {LENGTH_OPTIONS.map((length) => (
              <OptionButton
                key={length}
                label={`${length} days${length === 66 ? ' (recommended)' : ''}`}
                selected={onboarding.programLength === length}
                onPress={() => onboarding.setProgramLength(length)}
              />
            ))}
          </>
        )}

        {step === 6 && (
          <>
            <Text className="text-2xl font-bold text-text mb-1">
              Anything specific that's not working right now?
            </Text>
            <Text className="text-textMuted mb-6">
              Totally optional — skip if you'd rather just start.
            </Text>
            <TextInput
              multiline
              value={onboarding.notWorkingText}
              onChangeText={onboarding.setNotWorkingText}
              placeholder="Type here..."
              placeholderTextColor="#7C8AA6"
              className="bg-surface rounded-2xl border border-border p-4 text-text min-h-[120px]"
              textAlignVertical="top"
            />
          </>
        )}

      </ScrollView>

      <View className="px-6 pb-16 pt-2">
        <PrimaryButton
          label={
            step === TOTAL_STEPS - 1
              ? onboarding.notWorkingText
                ? 'Continue'
                : 'Skip & Continue'
              : 'Continue'
          }
          onPress={goNext}
          disabled={!canContinue()}
        />
      </View>
    </View>
  );
}
