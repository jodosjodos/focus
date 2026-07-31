import { Image, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '../../navigation/OnboardingStack';
import PrimaryButton from '../../components/PrimaryButton';
import WordFadeText from '../../components/WordFadeText';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Welcome'>;

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <View className="flex-1 bg-background">
      <LinearGradient
        colors={[`${colors.primary}33`, colors.background]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '60%' }}
      />
      <View className="flex-1 px-6 justify-between py-16">
        <View style={{ alignItems: 'center', marginTop: 24 }}>
          <Image
            source={require('../../../assets/focus-mark.png')}
            style={{ width: 72, height: 72 }}
            resizeMode="contain"
          />
        </View>
        <View>
          <WordFadeText
            text="Build a life you don't need to escape from."
            boldWords={['Build', 'escape', 'from']}
            style={{
              fontSize: 30,
              color: colors.text,
              lineHeight: 36,
            }}
          />
          <View style={{ marginTop: 16 }}>
            <WordFadeText
              text="21 to 66 days. A plan built from your real answers, not a template."
              startDelayMs={1250}
              staggerMs={45}
              style={{
                fontSize: 16,
                color: colors.textMuted,
                lineHeight: 24,
              }}
            />
          </View>
        </View>
        <View>
          <PrimaryButton
            label="Get started"
            onPress={() => navigation.navigate('Intro')}
          />
          <Text
            className="text-center text-textMuted mt-5"
            onPress={() => navigation.navigate('Login')}
          >
            Already have an account?{' '}
            <Text className="text-primary font-semibold">Log in</Text>
          </Text>
        </View>
      </View>
    </View>
  );
}
