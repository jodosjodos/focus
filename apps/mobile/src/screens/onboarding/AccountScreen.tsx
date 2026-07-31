import { useState } from 'react';
import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../state/OnboardingContext';
import { useSession } from '../../state/SessionContext';
import { useRegister } from '../../api/auth';
import { useCreateProgram } from '../../api/programs';
import PrimaryButton from '../../components/PrimaryButton';
import FormField from '../../components/FormField';
import PasswordField from '../../components/PasswordField';
import { colors } from '../../theme/colors';

function getDeviceTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'UTC';
  }
}

export default function AccountScreen() {
  const onboarding = useOnboarding();
  const session = useSession();
  const register = useRegister();
  const createProgram = useCreateProgram();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const isLoading = register.isPending || createProgram.isPending;
  const canSubmit = email.length > 3 && password.length >= 8 && displayName.length > 0;

  const handleSubmit = async () => {
    setError(null);
    try {
      await register.mutateAsync({ email, password, displayName });
      const program = await createProgram.mutateAsync({
        improvementAreas: onboarding.improvementAreas,
        baseline: onboarding.baseline as Required<typeof onboarding.baseline>,
        lengthDays: onboarding.programLength,
        notWorkingText: onboarding.notWorkingText || undefined,
        timezone: getDeviceTimezone(),
        quests: onboarding.quests.map((q) => ({
          templateId: q.templateId,
          isMainQuest: q.isMainQuest,
        })),
      });
      session.establishSession(program.id);
    } catch {
      setError("Couldn't create your account. Check your details and try again.");
    }
  };

  return (
    <View className="flex-1 bg-background px-6 pt-20">
      <LinearGradient
        colors={[`${colors.primary}33`, colors.background]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '60%' }}
      />
      <Text className="font-display text-2xl text-text mb-1">Save your progress</Text>
      <Text className="text-textMuted mb-8">
        Mostly so your data backs up. It's your app, your call.
      </Text>

      <View className="flex-row items-center justify-center gap-2 bg-surface rounded-2xl border border-border p-4 mb-3 opacity-40">
        <Ionicons name="logo-apple" size={17} color="#F3F6FB" />
        <Text className="text-text font-semibold">Sign in with Apple — coming soon</Text>
      </View>
      <View className="flex-row items-center justify-center gap-2 bg-surface rounded-2xl border border-border p-4 mb-6 opacity-40">
        <Ionicons name="logo-google" size={16} color="#F3F6FB" />
        <Text className="text-text font-semibold">Sign in with Google — coming soon</Text>
      </View>

      <FormField
        label="Name"
        value={displayName}
        onChangeText={setDisplayName}
        placeholder="Your name"
        autoCapitalize="words"
      />
      <FormField
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        autoCapitalize="none"
        autoCorrect={false}
        textContentType="none"
        keyboardType="email-address"
      />
      <PasswordField
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="8+ characters"
      />

      {error && <Text className="text-strength mb-4">{error}</Text>}

      <PrimaryButton
        label="Start Day 1"
        onPress={handleSubmit}
        disabled={!canSubmit}
        loading={isLoading}
      />
    </View>
  );
}
