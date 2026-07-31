import { Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '../../navigation/OnboardingStack';
import { useOnboarding } from '../../state/OnboardingContext';
import { usePreviewProgram } from '../../api/programs';
import PrimaryButton from '../../components/PrimaryButton';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'QuoteStack'>;

export default function QuoteStackScreen({ navigation }: Props) {
  const onboarding = useOnboarding();
  const preview = usePreviewProgram();

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

  return (
    <View className="flex-1 bg-background items-center justify-center px-7" style={{ gap: 26 }}>
      <View style={{ width: 210, height: 140, position: 'relative' }}>
        <View
          style={{
            position: 'absolute', top: 14, left: -14, width: 180, height: 120,
            borderRadius: 16, backgroundColor: `${colors.wisdom}33`,
            borderWidth: 1, borderColor: colors.border, transform: [{ rotate: '-8deg' }],
          }}
        />
        <View
          style={{
            position: 'absolute', top: 14, right: -14, width: 180, height: 120,
            borderRadius: 16, backgroundColor: `${colors.focus}33`,
            borderWidth: 1, borderColor: colors.border, transform: [{ rotate: '7deg' }],
          }}
        />
        <View
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            borderRadius: 16, backgroundColor: colors.surface,
            borderWidth: 1, borderColor: colors.border,
            alignItems: 'center', justifyContent: 'center', padding: 16,
          }}
        >
          <Text className="font-display text-text text-center" style={{ fontSize: 15 }}>
            "You have one life. Stop rehearsing for it."
          </Text>
        </View>
      </View>

      <Text className="font-display text-text" style={{ fontSize: 24 }}>Let's build it.</Text>
      <Text className="text-textMuted text-center" style={{ fontSize: 13.5, lineHeight: 19 }}>
        Focus turns distractions into reminders of who you're becoming.
      </Text>

      {preview.isError && (
        <Text className="text-strength text-center">
          Something went wrong building your plan. Try again.
        </Text>
      )}

      <PrimaryButton label="I'm ready" onPress={handleReady} loading={preview.isPending} />
    </View>
  );
}
