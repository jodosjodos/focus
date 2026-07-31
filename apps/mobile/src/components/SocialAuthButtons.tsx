import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

function SocialRow({
  icon,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}) {
  return (
    <View
      className="flex-row items-center justify-between bg-surface rounded-2xl border border-border px-4 mb-3"
      style={{ height: 52 }}
    >
      <View className="flex-row items-center" style={{ gap: 10 }}>
        <Ionicons name={icon} size={18} color={colors.text} />
        <Text className="text-text font-semibold" style={{ fontSize: 14 }}>{label}</Text>
      </View>
      <View
        style={{
          backgroundColor: `${colors.primary}22`,
          borderRadius: 20,
          paddingVertical: 3,
          paddingHorizontal: 9,
        }}
      >
        <Text style={{ color: colors.primary, fontSize: 10.5, fontWeight: '700' }}>SOON</Text>
      </View>
    </View>
  );
}

export default function SocialAuthButtons() {
  return (
    <View>
      <SocialRow icon="logo-apple" label="Continue with Apple" />
      <SocialRow icon="logo-google" label="Continue with Google" />
    </View>
  );
}
