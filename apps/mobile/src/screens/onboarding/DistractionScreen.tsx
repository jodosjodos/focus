import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '../../navigation/OnboardingStack';
import { useOnboarding } from '../../state/OnboardingContext';
import { ScreenTimeHoursTier } from '../../types/onboarding';
import PrimaryButton from '../../components/PrimaryButton';
import { colors } from '../../theme/colors';

// Illustrative pickups/day estimate from the screen-time tier they just
// answered — a reasonable real-world correlate, not a fabricated tracked
// metric (we have no access to actual device usage data).
const PICKUPS_ESTIMATE: Record<ScreenTimeHoursTier, number> = {
  [ScreenTimeHoursTier.UNDER_2]: 40,
  [ScreenTimeHoursTier.TWO_TO_FOUR]: 65,
  [ScreenTimeHoursTier.FOUR_TO_SIX]: 90,
  [ScreenTimeHoursTier.SIX_PLUS]: 120,
};

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Distraction'>;

export default function DistractionScreen({ navigation }: Props) {
  const { baseline } = useOnboarding();
  const estimate = baseline.screenTimeHours
    ? PICKUPS_ESTIMATE[baseline.screenTimeHours]
    : 80;

  return (
    <View className="flex-1 bg-background items-center justify-center px-7">
      <LinearGradient
        colors={[`${colors.primary}33`, colors.background]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '60%' }}
      />
      <Text className="text-xs font-bold text-textMuted tracking-wide uppercase">
        Based on your screen time
      </Text>
      <Text className="font-display text-text mt-2" style={{ fontSize: 88 }}>
        {estimate}
      </Text>
      <Text className="font-display text-2xl text-textMuted">pickups a day</Text>

      <View className="absolute bottom-20 left-7 right-7">
        <PrimaryButton
          label="Let's change that"
          onPress={() => navigation.navigate('LockTeaser')}
        />
      </View>
    </View>
  );
}
