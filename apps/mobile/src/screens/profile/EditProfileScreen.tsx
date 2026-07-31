import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '../../navigation/ProfileStack';
import { useUpdateProfile } from '../../api/users';
import { ApiError } from '../../api/client';
import { session, type StoredUser } from '../../api/session';
import FormField from '../../components/FormField';
import PasswordField from '../../components/PasswordField';
import PrimaryButton from '../../components/PrimaryButton';
import GlassCard from '../../components/GlassCard';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<ProfileStackParamList, 'EditProfile'>;

const CARD_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.35,
  shadowRadius: 18,
  elevation: 6,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function SectionLabel({ label }: { label: string }) {
  return (
    <Text
      className="text-textMuted"
      style={{ fontSize: 11.5, fontWeight: '700', letterSpacing: 0.6, marginBottom: 8, marginTop: 22, textTransform: 'uppercase' }}
    >
      {label}
    </Text>
  );
}

function parseErrorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    try {
      const body = JSON.parse(err.message);
      if (typeof body.message === 'string') return body.message;
    } catch {
      // fall through to generic message
    }
  }
  return 'Something went wrong. Try again.';
}

export default function EditProfileScreen({ navigation }: Props) {
  const updateProfile = useUpdateProfile();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');

  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [currentPasswordError, setCurrentPasswordError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    session.getUser().then((u) => {
      setUser(u);
      setDisplayName(u?.displayName ?? '');
      setEmail(u?.email ?? '');
      setLoadingUser(false);
    });
  }, []);

  if (loadingUser) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  const nameDirty = displayName.trim() !== (user?.displayName ?? '');
  const emailDirty = email.trim() !== (user?.email ?? '');
  const passwordDirty = newPassword.length > 0;
  const needsCurrentPassword = emailDirty || passwordDirty;
  const isDirty = nameDirty || emailDirty || passwordDirty;

  const clearFieldErrors = () => {
    setNameError(null);
    setEmailError(null);
    setPasswordError(null);
    setCurrentPasswordError(null);
    setFormError(null);
  };

  const validate = (): boolean => {
    clearFieldErrors();
    let ok = true;

    if (nameDirty && displayName.trim().length === 0) {
      setNameError('Name cannot be empty.');
      ok = false;
    }
    if (emailDirty && !EMAIL_RE.test(email.trim())) {
      setEmailError('Enter a valid email.');
      ok = false;
    }
    if (passwordDirty && newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters.');
      ok = false;
    }
    if (passwordDirty && newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      ok = false;
    }
    if (needsCurrentPassword && currentPassword.length === 0) {
      setCurrentPasswordError('Enter your current password to confirm this change.');
      ok = false;
    }
    return ok;
  };

  const handleSave = async () => {
    if (!user || !isDirty) return;
    if (!validate()) return;

    try {
      const updated = await updateProfile.mutateAsync({
        userId: user.id,
        displayName: nameDirty ? displayName.trim() : undefined,
        email: emailDirty ? email.trim() : undefined,
        newPassword: passwordDirty ? newPassword : undefined,
        currentPassword: needsCurrentPassword ? currentPassword : undefined,
      });
      await session.setUser({
        id: updated.id,
        email: updated.email,
        displayName: updated.displayName,
      });
      navigation.goBack();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setCurrentPasswordError('Current password is incorrect.');
      } else if (err instanceof ApiError && err.status === 409) {
        setEmailError('That email is already in use.');
      } else {
        setFormError(parseErrorMessage(err));
      }
    }
  };

  return (
    <View className="flex-1 bg-background">
      <LinearGradient
        colors={[`${colors.primary}33`, colors.background]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '60%' }}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-6 pt-16 pb-10"
          keyboardShouldPersistTaps="handled"
        >
          <Pressable onPress={() => navigation.goBack()} style={{ marginBottom: 14 }} hitSlop={8}>
            <Text className="text-textMuted" style={{ fontSize: 13 }}>‹ Profile</Text>
          </Pressable>
          <Text className="font-display text-text" style={{ fontSize: 22 }}>
            Edit Profile
          </Text>

          <SectionLabel label="Your Info" />
      <GlassCard style={CARD_SHADOW}>
        <FormField
          label="Name"
          value={displayName}
          onChangeText={(t) => {
            setDisplayName(t);
            if (nameError) setNameError(null);
          }}
          placeholder="Your name"
          autoCapitalize="words"
        />
        {nameError && (
          <Text style={{ color: colors.strength, fontSize: 12, marginTop: -10, marginBottom: 12 }}>
            {nameError}
          </Text>
        )}
        <View style={{ marginBottom: 0 }}>
          <FormField
            label="Email"
            value={email}
            onChangeText={(t) => {
              setEmail(t);
              if (emailError) setEmailError(null);
            }}
            placeholder="you@example.com"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
          />
        </View>
        {emailError && (
          <Text style={{ color: colors.strength, fontSize: 12, marginTop: -10, marginBottom: 4 }}>
            {emailError}
          </Text>
        )}
      </GlassCard>

      <SectionLabel label="Password" />
      <GlassCard style={CARD_SHADOW}>
        <PasswordField
          label="New Password"
          value={newPassword}
          onChangeText={(t) => {
            setNewPassword(t);
            if (passwordError) setPasswordError(null);
          }}
          placeholder="Leave blank to keep current password"
        />
        <PasswordField
          label="Confirm New Password"
          value={confirmPassword}
          onChangeText={(t) => {
            setConfirmPassword(t);
            if (passwordError) setPasswordError(null);
          }}
          placeholder="Re-enter new password"
        />
        {passwordError && (
          <Text style={{ color: colors.strength, fontSize: 12, marginTop: -10, marginBottom: 4 }}>
            {passwordError}
          </Text>
        )}
      </GlassCard>

      {needsCurrentPassword && (
        <>
          <SectionLabel label="Confirm It's You" />
          <GlassCard style={CARD_SHADOW}>
            <Text className="text-textMuted" style={{ fontSize: 12.5, marginBottom: 12, lineHeight: 17 }}>
              Changing your email or password needs your current password for security.
            </Text>
            <View style={{ marginBottom: 0 }}>
              <PasswordField
                label="Current Password"
                value={currentPassword}
                onChangeText={(t) => {
                  setCurrentPassword(t);
                  if (currentPasswordError) setCurrentPasswordError(null);
                }}
                placeholder="Your current password"
              />
            </View>
            {currentPasswordError && (
              <Text style={{ color: colors.strength, fontSize: 12, marginTop: -10 }}>
                {currentPasswordError}
              </Text>
            )}
          </GlassCard>
        </>
      )}

      {formError && (
        <Text style={{ color: colors.strength, fontSize: 13, marginTop: 16, textAlign: 'center' }}>
          {formError}
        </Text>
      )}

          <View style={{ marginTop: 24 }}>
            <PrimaryButton
              label="Save Changes"
              onPress={handleSave}
              disabled={!isDirty}
              loading={updateProfile.isPending}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
