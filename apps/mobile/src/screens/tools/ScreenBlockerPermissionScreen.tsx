import { useState } from 'react';
import { Linking, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ToolsStackParamList } from '../../navigation/ToolsStack';
import { requestAuthorization, isDevStubActive } from 'expo-screen-shield';
import { ShieldAuthorizationStatus } from '../../types/screenBlocker';
import GlassCard from '../../components/GlassCard';
import PrimaryButton from '../../components/PrimaryButton';
import { colors } from '../../theme/colors';
import { CARD_SHADOW } from '../../theme/shadows';

type Props = NativeStackScreenProps<ToolsStackParamList, 'ScreenBlockerPermission'>;

const REASONS = [
  { icon: 'shield-checkmark' as const, text: "You choose exactly which apps get shielded — nothing else changes." },
  { icon: 'eye-off' as const, text: 'Focus never sees which apps you picked. Apple keeps that private.' },
  { icon: 'lock-open' as const, text: "End a session early any time — it's never a dead end." },
];

export default function ScreenBlockerPermissionScreen({ navigation }: Props) {
  const [status, setStatus] = useState<ShieldAuthorizationStatus | null>(null);
  const [requesting, setRequesting] = useState(false);

  const handleAllow = async () => {
    setRequesting(true);
    const result = await requestAuthorization();
    setRequesting(false);
    setStatus(result as ShieldAuthorizationStatus);
    if (result === 'approved') {
      navigation.replace('ScreenBlockerAppPicker');
    }
  };

  return (
    <View className="flex-1 bg-background items-center justify-center" style={{ padding: 28, gap: 20 }}>
      <Pressable
        onPress={() => navigation.goBack()}
        style={{ position: 'absolute', top: 64, left: 24 }}
        hitSlop={8}
      >
        <Text className="text-textMuted" style={{ fontSize: 13 }}>‹ Back</Text>
      </Pressable>

      <View
        style={{
          width: 72,
          height: 72,
          borderRadius: 36,
          backgroundColor: `${colors.discipline}22`,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name="shield-checkmark" size={30} color={colors.discipline} />
      </View>

      <View style={{ alignItems: 'center', gap: 6 }}>
        <Text className="font-display text-text" style={{ fontSize: 19, textAlign: 'center' }}>
          Block Mode needs Screen Time access
        </Text>
        <Text className="text-textMuted" style={{ fontSize: 13, textAlign: 'center', lineHeight: 18 }}>
          iOS asks once — a single system prompt, nothing hidden.
        </Text>
      </View>

      <View style={{ width: '100%', gap: 8 }}>
        {REASONS.map((reason) => (
          <GlassCard key={reason.text} style={[CARD_SHADOW, { flexDirection: 'row', gap: 10, alignItems: 'center' }]}>
            <Ionicons name={reason.icon} size={16} color={colors.textMuted} />
            <Text className="text-textMuted" style={{ fontSize: 12.5, flex: 1, lineHeight: 17 }}>
              {reason.text}
            </Text>
          </GlassCard>
        ))}
      </View>

      {status === 'unavailable' && (
        <View style={{ width: '100%', alignItems: 'center', gap: 6 }}>
          <Text style={{ color: colors.textMuted, fontSize: 12.5, textAlign: 'center', lineHeight: 17 }}>
            {isDevStubActive
              ? "Dev preview only — the real Screen Time module isn't linked in this build yet."
              : "Screen Time access isn't set up yet on this device. This needs an Apple Developer entitlement that hasn't been approved yet."}
          </Text>
        </View>
      )}

      {status === 'denied' && (
        <View style={{ width: '100%', alignItems: 'center', gap: 10 }}>
          <Text style={{ color: colors.textMuted, fontSize: 12.5, textAlign: 'center' }}>
            Screen Time access was declined. You can turn it on any time in Settings.
          </Text>
          <Pressable onPress={() => Linking.openURL('app-settings:')} hitSlop={8}>
            <Text style={{ color: colors.primary, fontSize: 13, fontWeight: '600' }}>Open Settings</Text>
          </Pressable>
        </View>
      )}

      <View style={{ width: '100%' }}>
        <PrimaryButton label="Allow Screen Time Access" onPress={handleAllow} loading={requesting} />
      </View>
    </View>
  );
}
