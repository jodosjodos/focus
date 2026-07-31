import { useEffect, useRef, useState } from 'react';
import { Animated, Image, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '../../navigation/OnboardingStack';
import { useSession } from '../../state/SessionContext';
import { useLogin } from '../../api/auth';
import { getUserPrograms } from '../../api/programs';
import { session } from '../../api/session';
import { ProgramStatus } from '../../types/program';
import FormField from '../../components/FormField';
import PasswordField from '../../components/PasswordField';
import PrimaryButton from '../../components/PrimaryButton';
import SocialAuthButtons from '../../components/SocialAuthButtons';
import GlassCard from '../../components/GlassCard';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const appSession = useSession();
  const login = useLogin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [resolving, setResolving] = useState(false);

  const enter = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(enter, { toValue: 1, duration: 480, useNativeDriver: true }).start();
  }, [enter]);

  const canSubmit = email.length > 3 && password.length > 0;

  const handleSubmit = async () => {
    setError(null);
    try {
      await login.mutateAsync({ email, password });
      setResolving(true);
      const programs = await getUserPrograms();
      const active = programs.find((p) => p.status === ProgramStatus.ACTIVE) ?? programs[0];
      if (!active) {
        setError("This account doesn't have a program yet — start a new one below.");
        setResolving(false);
        return;
      }
      await session.setProgramId(active.id);
      appSession.establishSession(active.id);
    } catch {
      setError('Wrong email or password.');
      setResolving(false);
    }
  };

  const isLoading = login.isPending || resolving;

  return (
    <View className="flex-1 bg-background px-6 pt-16">
      <LinearGradient
        colors={[`${colors.primary}33`, colors.background]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '60%' }}
      />

      <Animated.View
        style={{
          alignItems: 'center',
          marginBottom: 20,
          opacity: enter,
          transform: [
            { translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) },
          ],
        }}
      >
        <Image
          source={require('../../../assets/focus-mark.png')}
          style={{ width: 52, height: 52 }}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.View
        style={{
          opacity: enter,
          transform: [
            { translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) },
          ],
        }}
      >
        <GlassCard
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.4,
            shadowRadius: 22,
            elevation: 8,
          }}
        >
          <Text className="font-display text-2xl text-text mb-1">Welcome back</Text>
          <Text className="text-textMuted mb-5">Log in to pick up where you left off.</Text>

          <FormField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
          />
          <PasswordField
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Your password"
          />

          {error && <Text className="text-strength mb-3">{error}</Text>}

          <PrimaryButton
            label="Log In"
            onPress={handleSubmit}
            disabled={!canSubmit}
            loading={isLoading}
          />

          <View className="flex-row items-center my-5" style={{ gap: 10 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
            <Text className="text-textMuted" style={{ fontSize: 11.5 }}>or continue with</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
          </View>

          <SocialAuthButtons />
        </GlassCard>
      </Animated.View>

      <Text
        className="text-center text-textMuted mt-6"
        onPress={() => navigation.goBack()}
      >
        Don't have an account? <Text className="text-primary font-semibold">Get started</Text>
      </Text>
    </View>
  );
}
