import { ScrollView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '../../navigation/OnboardingStack';
import { useOnboarding } from '../../state/OnboardingContext';
import StatBar from '../../components/StatBar';
import PrimaryButton from '../../components/PrimaryButton';
import GlassCard from '../../components/GlassCard';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'BaselineResult'>;

export default function BaselineResultScreen({ navigation }: Props) {
  const { preview, notWorkingText } = useOnboarding();

  if (!preview) {
    return null;
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1 px-6 pt-16" contentContainerClassName="pb-6">
        <Text className="text-xs font-bold text-primary tracking-wide uppercase">
          Your Day 1 Rating
        </Text>
        <Text className="text-textMuted mt-1 mb-6">
          Built from what you just answered — not a random number.
        </Text>

        {notWorkingText ? (
          <View className="bg-surface rounded-2xl border border-border p-4 mb-6">
            <Text className="text-textMuted italic">
              You told us: "{notWorkingText}"
            </Text>
          </View>
        ) : null}

        <GlassCard>
          <StatBar
            label="Discipline"
            value={preview.baselineStats.discipline}
            potential={preview.potentialStats.discipline}
          />
          <StatBar
            label="Focus"
            value={preview.baselineStats.focus}
            potential={preview.potentialStats.focus}
          />
          <StatBar
            label="Strength"
            value={preview.baselineStats.strength}
            potential={preview.potentialStats.strength}
          />
          <StatBar
            label="Confidence"
            value={preview.baselineStats.confidence}
            potential={preview.potentialStats.confidence}
          />
          <StatBar
            label="Wisdom"
            value={preview.baselineStats.wisdom}
            potential={preview.potentialStats.wisdom}
          />
        </GlassCard>

        <Text className="text-xs text-textMuted mt-5">
          That gap isn't a promise — it's what your answers say is possible if
          you show up.
        </Text>
      </ScrollView>

      <View className="px-6 pb-8 pt-2">
        <PrimaryButton
          label="See my plan"
          onPress={() => navigation.navigate('ProgramPreview')}
        />
      </View>
    </View>
  );
}
