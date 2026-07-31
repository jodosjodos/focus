import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '../../navigation/OnboardingStack';
import { useOnboarding } from '../../state/OnboardingContext';
import PrimaryButton from '../../components/PrimaryButton';
import AnimatedPressable from '../../components/AnimatedPressable';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Age'>;

const MIN_AGE = 13;
const MAX_AGE = 99;

export default function AgeScreen({ navigation }: Props) {
  const { age, setAge } = useOnboarding();

  const circleButtonStyle = {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  };

  return (
    <View className="flex-1 bg-background px-6 pt-20">
      <LinearGradient
        colors={[`${colors.primary}33`, colors.background]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '60%' }}
      />
      <Text className="font-display text-2xl text-text">How old are you?</Text>
      <Text className="text-textMuted mt-1.5">Helps us set a realistic baseline.</Text>

      <View className="flex-1 flex-row items-center justify-center gap-8">
        <AnimatedPressable
          onPress={() => setAge(Math.max(MIN_AGE, age - 1))}
          style={circleButtonStyle}
        >
          <Text className="text-text text-2xl">–</Text>
        </AnimatedPressable>

        <Text className="font-display text-text" style={{ fontSize: 64, minWidth: 110, textAlign: 'center' }}>
          {age}
        </Text>

        <AnimatedPressable
          onPress={() => setAge(Math.min(MAX_AGE, age + 1))}
          style={circleButtonStyle}
        >
          <Text className="text-text text-2xl">+</Text>
        </AnimatedPressable>
      </View>

      <View className="pb-20">
        <PrimaryButton label="Continue" onPress={() => navigation.navigate('Quiz')} />
      </View>
    </View>
  );
}
