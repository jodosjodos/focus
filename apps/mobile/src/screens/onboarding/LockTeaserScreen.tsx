import { Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '../../navigation/OnboardingStack';
import PrimaryButton from '../../components/PrimaryButton';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'LockTeaser'>;

export default function LockTeaserScreen({ navigation }: Props) {
  return (
    <View className="flex-1 bg-background items-center justify-center px-7" style={{ gap: 34 }}>
      <View className="items-center">
        <Text className="font-display text-text" style={{ fontSize: 56 }}>9:41</Text>
        <Text className="text-textMuted mt-1">Monday, June 6</Text>
      </View>

      <View
        className="w-full flex-row gap-3"
        style={{
          backgroundColor: 'rgba(255,255,255,0.06)',
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 16,
          padding: 14,
        }}
      >
        <View style={{ width: 32, height: 32, borderRadius: 9, backgroundColor: colors.primary }} />
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

      <Text className="font-display text-text text-center" style={{ fontSize: 22 }}>
        This could be your day 66.
      </Text>

      <PrimaryButton label="Continue" onPress={() => navigation.navigate('QuoteStack')} />
    </View>
  );
}
