import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '../../navigation/ProfileStack';
import { useSession } from '../../state/SessionContext';
import { useUpdateHardMode } from '../../api/users';
import { session, type StoredUser } from '../../api/session';
import GlassCard from '../../components/GlassCard';
import BackButton from '../../components/BackButton';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Settings'>;

const CARD_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.35,
  shadowRadius: 18,
  elevation: 6,
};

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

function Row({
  icon,
  iconColor,
  label,
  sublabel,
  onPress,
  right,
  danger,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  label: string;
  sublabel?: string;
  onPress?: () => void;
  right?: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <Pressable onPress={onPress} disabled={!onPress}>
      <View className="flex-row items-center justify-between" style={{ paddingVertical: 4 }}>
        <View className="flex-row items-center flex-1" style={{ gap: 12 }}>
          <View
            style={{
              width: 34, height: 34, borderRadius: 10,
              backgroundColor: `${iconColor}1F`,
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Ionicons name={icon} size={16} color={iconColor} />
          </View>
          <View className="flex-1">
            <Text
              style={{ color: danger ? colors.strength : colors.text, fontWeight: '600', fontSize: 14 }}
            >
              {label}
            </Text>
            {sublabel && (
              <Text className="text-textMuted" style={{ fontSize: 11.5, marginTop: 1 }}>
                {sublabel}
              </Text>
            )}
          </View>
        </View>
        {right}
      </View>
    </Pressable>
  );
}

export default function SettingsScreen({ navigation }: Props) {
  const appSession = useSession();
  const updateHardMode = useUpdateHardMode();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [hardMode, setHardMode] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  useEffect(() => {
    session.getUser().then((u) => {
      setUser(u);
      setLoadingUser(false);
    });
  }, []);

  const toggleHardMode = () => {
    if (!user) return;
    const next = !hardMode;
    setHardMode(next);
    updateHardMode.mutate(
      { userId: user.id, hardModeEnabled: next },
      { onError: () => setHardMode(!next) },
    );
  };

  const handleLogout = () => {
    setLogoutModalVisible(false);
    appSession.logout();
  };

  if (loadingUser) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  const initial = (user?.displayName || user?.email || '?').charAt(0).toUpperCase();
  const appVersion = '1.0.0';

  return (
    <View className="flex-1 bg-background px-6 pt-16">
      <LinearGradient
        colors={[`${colors.primary}33`, colors.background]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '60%' }}
      />
      <BackButton label="Profile" onPress={() => navigation.goBack()} style={{ marginBottom: 14 }} />
      <Text className="font-display text-text" style={{ fontSize: 22 }}>
        Settings
      </Text>

      <SectionLabel label="Account" />
      <GlassCard style={CARD_SHADOW}>
        <View className="flex-row items-center" style={{ gap: 12 }}>
          <View
            style={{
              width: 44, height: 44, borderRadius: 22,
              backgroundColor: `${colors.primary}22`, borderWidth: 1, borderColor: `${colors.primary}44`,
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Text className="font-display" style={{ color: colors.primary, fontSize: 17 }}>
              {initial}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-text font-semibold" style={{ fontSize: 14.5 }}>
              {user?.displayName ?? 'Guest'}
            </Text>
            <Text className="text-textMuted" style={{ fontSize: 12, marginTop: 1 }}>
              {user?.email ?? 'Not signed in'}
            </Text>
          </View>
        </View>
      </GlassCard>

      <SectionLabel label="Program" />
      <GlassCard style={CARD_SHADOW}>
        <Row
          icon="flash-outline"
          iconColor={colors.confidence}
          label="Hard Mode"
          sublabel="Missed days cost a streak reset, not a full wipe"
          right={
            <Pressable
              onPress={toggleHardMode}
              hitSlop={8}
              style={{
                width: 44, height: 26, borderRadius: 13,
                backgroundColor: hardMode ? colors.primary : 'rgba(255,255,255,0.15)',
                justifyContent: 'center',
                paddingHorizontal: 2,
              }}
            >
              <View
                style={{
                  width: 22, height: 22, borderRadius: 11, backgroundColor: '#fff',
                  alignSelf: hardMode ? 'flex-end' : 'flex-start',
                }}
              />
            </Pressable>
          }
        />
      </GlassCard>

      <SectionLabel label="Session" />
      <GlassCard style={CARD_SHADOW}>
        <Row
          icon="log-out-outline"
          iconColor={colors.strength}
          label="Log Out"
          onPress={() => setLogoutModalVisible(true)}
          danger
        />
      </GlassCard>

      <Text className="text-textMuted text-center" style={{ fontSize: 11, marginTop: 26 }}>
        Focus · v{appVersion}
      </Text>

      <Modal visible={logoutModalVisible} transparent animationType="fade" onRequestClose={() => setLogoutModalVisible(false)}>
        <Pressable
          onPress={() => setLogoutModalVisible(false)}
          style={{ flex: 1, backgroundColor: 'rgba(3,6,13,0.7)', alignItems: 'center', justifyContent: 'center', padding: 32 }}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{
              width: '100%', backgroundColor: colors.surface, borderRadius: 20,
              borderWidth: 1, borderColor: colors.border, padding: 22,
              shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.4, shadowRadius: 22, elevation: 8,
            }}
          >
            <View
              style={{
                width: 44, height: 44, borderRadius: 14, backgroundColor: `${colors.strength}1F`,
                alignItems: 'center', justifyContent: 'center', marginBottom: 14,
              }}
            >
              <Ionicons name="log-out-outline" size={20} color={colors.strength} />
            </View>
            <Text className="font-display text-text" style={{ fontSize: 17, marginBottom: 6 }}>
              Log out?
            </Text>
            <Text className="text-textMuted" style={{ fontSize: 13, lineHeight: 18, marginBottom: 20 }}>
              You can log back in any time with your same account.
            </Text>
            <View className="flex-row" style={{ gap: 10 }}>
              <Pressable
                onPress={() => setLogoutModalVisible(false)}
                style={{
                  flex: 1, paddingVertical: 13, borderRadius: 14, alignItems: 'center',
                  backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: colors.border,
                }}
              >
                <Text className="text-text font-semibold" style={{ fontSize: 14 }}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleLogout}
                style={{
                  flex: 1, paddingVertical: 13, borderRadius: 14, alignItems: 'center',
                  backgroundColor: colors.strength,
                }}
              >
                <Text className="font-semibold" style={{ fontSize: 14, color: '#1a0505' }}>Log Out</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
