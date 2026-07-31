import { ScrollView, Text, View, Pressable, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '../../navigation/OnboardingStack';
import { useOnboarding } from '../../state/OnboardingContext';
import { useSwapTemplate } from '../../api/programs';
import PrimaryButton from '../../components/PrimaryButton';
import GlassCard from '../../components/GlassCard';
import { colors } from '../../theme/colors';
import { useState } from 'react';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'ProgramPreview'>;

export default function ProgramPreviewScreen({ navigation }: Props) {
  const onboarding = useOnboarding();
  const swap = useSwapTemplate();
  const [swappingIndex, setSwappingIndex] = useState<number | null>(null);

  const handleSwap = async (index: number) => {
    const quest = onboarding.quests[index];
    setSwappingIndex(index);
    try {
      const replacement = await swap.mutateAsync({
        category: quest.category,
        excludeTemplateId: quest.templateId,
        baseline: onboarding.baseline as Required<typeof onboarding.baseline>,
      });
      onboarding.replaceQuest(index, {
        ...replacement,
        isMainQuest: quest.isMainQuest,
      });
    } finally {
      setSwappingIndex(null);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <LinearGradient
        colors={[`${colors.primary}33`, colors.background]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '60%' }}
      />
      <ScrollView className="flex-1 px-6 pt-16" contentContainerClassName="pb-6">
        <Text className="font-display text-2xl text-text mb-1">Your program</Text>
        <Text className="text-textMuted mb-6">
          Generated from your answers. Swap anything before you confirm.
        </Text>

        {onboarding.quests.map((quest, index) => (
          <View key={quest.templateId} className="mb-3">
            <GlassCard>
              {quest.isMainQuest && (
                <Text className="text-primary font-bold text-xs mb-1.5 tracking-wide">
                  MAIN QUEST
                </Text>
              )}
              <View className="flex-row justify-between items-start mb-1">
                <Text className="text-base font-semibold text-text flex-1 pr-2">
                  {quest.title}
                </Text>
                <Text className="text-primary font-semibold">+{quest.baseXp} XP</Text>
              </View>
              <Text className="text-textMuted mb-2">{quest.description}</Text>
              <Text className="text-textMuted text-xs mb-3">
                feeds <Text style={{ color: colors.focus }}>{quest.primaryStat}</Text>
                {quest.secondaryStat ? (
                  <>
                    {' '}
                    + <Text style={{ color: colors.wisdom }}>{quest.secondaryStat}</Text>
                  </>
                ) : null}
                {quest.target ? ` · ${quest.target}` : ''}
              </Text>
              <Pressable
                onPress={() => handleSwap(index)}
                disabled={swappingIndex !== null}
                className="self-start"
              >
                {swappingIndex === index ? (
                  <ActivityIndicator color={colors.primary} />
                ) : (
                  <Text className="text-primary font-semibold text-xs">
                    ↻ swap for another
                  </Text>
                )}
              </Pressable>
            </GlassCard>
          </View>
        ))}
      </ScrollView>

      <View className="px-6 pb-20 pt-2">
        <PrimaryButton
          label="Confirm plan"
          onPress={() => navigation.navigate('Account')}
        />
      </View>
    </View>
  );
}
