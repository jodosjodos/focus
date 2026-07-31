import { useEffect, useRef, useState } from 'react';
import { Animated, ScrollView, Text, View, Pressable, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '../../navigation/OnboardingStack';
import { useOnboarding } from '../../state/OnboardingContext';
import { useSwapTemplate } from '../../api/programs';
import PrimaryButton from '../../components/PrimaryButton';
import GlassCard from '../../components/GlassCard';
import { STAT_COLOR } from '../../components/QuestCard';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'ProgramPreview'>;

function PreviewCard({
  quest,
  index,
  swapping,
  onSwap,
}: {
  quest: ReturnType<typeof useOnboarding>['quests'][number];
  index: number;
  swapping: boolean;
  onSwap: () => void;
}) {
  const enter = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(enter, {
      toValue: 1,
      duration: 420,
      delay: index * 110,
      useNativeDriver: true,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const statColor = STAT_COLOR[quest.primaryStat] ?? colors.primary;

  return (
    <Animated.View
      style={{
        marginBottom: 14,
        opacity: enter,
        transform: [
          { translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [22, 0] }) },
        ],
      }}
    >
      <GlassCard
        style={[
          {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.35,
            shadowRadius: 18,
            elevation: 6,
          },
          quest.isMainQuest ? { borderColor: colors.primary, borderWidth: 1.5 } : undefined,
        ]}
      >
        {quest.isMainQuest && (
          <Text className="text-primary font-bold text-xs mb-2 tracking-wide">
            MAIN QUEST
          </Text>
        )}
        <View className="flex-row" style={{ gap: 12 }}>
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 13,
              backgroundColor: `${statColor}22`,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: statColor }} />
          </View>
          <View className="flex-1">
            <View className="flex-row justify-between items-start" style={{ gap: 10 }}>
              <Text className="text-base font-semibold text-text flex-1">{quest.title}</Text>
              <Text className="text-primary font-semibold">+{quest.baseXp} XP</Text>
            </View>
            <Text className="text-textMuted mt-1" style={{ fontSize: 13 }}>
              {quest.description}
            </Text>
            <Text className="text-textMuted text-xs mt-2">
              feeds <Text style={{ color: statColor, fontWeight: '600' }}>{quest.primaryStat}</Text>
              {quest.secondaryStat ? (
                <>
                  {' '}
                  + <Text style={{ color: colors.wisdom, fontWeight: '600' }}>{quest.secondaryStat}</Text>
                </>
              ) : null}
              {quest.target ? ` · ${quest.target}` : ''}
            </Text>
          </View>
        </View>

        <Pressable
          onPress={onSwap}
          disabled={swapping}
          className="self-start flex-row items-center mt-3"
          style={{
            gap: 5,
            borderRadius: 20,
            paddingVertical: 6,
            paddingHorizontal: 12,
            backgroundColor: `${colors.primary}14`,
            borderWidth: 1,
            borderColor: `${colors.primary}33`,
          }}
        >
          {swapping ? (
            <ActivityIndicator color={colors.primary} size="small" />
          ) : (
            <>
              <Ionicons name="shuffle" size={13} color={colors.primary} />
              <Text className="text-primary font-semibold text-xs">Swap for another</Text>
            </>
          )}
        </Pressable>
      </GlassCard>
    </Animated.View>
  );
}

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
          <PreviewCard
            key={quest.templateId}
            quest={quest}
            index={index}
            swapping={swappingIndex === index}
            onSwap={() => handleSwap(index)}
          />
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
