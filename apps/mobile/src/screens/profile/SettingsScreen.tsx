import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '../../navigation/ProfileStack';
import { useSession } from '../../state/SessionContext';
import { useUpdateHardMode } from '../../api/users';
import { session, type StoredUser } from '../../api/session';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Settings'>;

export default function SettingsScreen({ navigation }: Props) {
  const appSession = useSession();
  const updateHardMode = useUpdateHardMode();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [hardMode, setHardMode] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

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

  const handleLogout = async () => {
    await appSession.logout();
  };

  if (loadingUser) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background px-6 pt-16">
      <Pressable onPress={() => navigation.goBack()} style={{ marginBottom: 14 }}>
        <Text className="text-textMuted" style={{ fontSize: 13 }}>‹ Profile</Text>
      </Pressable>
      <Text className="font-display text-text" style={{ fontSize: 20, marginBottom: 16 }}>
        Settings
      </Text>

      <View style={{ gap: 10 }}>
        <View
          className="flex-row items-center justify-between"
          style={{
            backgroundColor: colors.surface, borderRadius: 14, padding: 16,
            borderWidth: 1, borderColor: colors.border,
          }}
        >
          <View className="flex-row items-center" style={{ gap: 10 }}>
            <Ionicons name="flash-outline" size={17} color={colors.confidence} />
            <Text className="text-text font-semibold" style={{ fontSize: 14 }}>Hard Mode</Text>
          </View>
          <Pressable
            onPress={toggleHardMode}
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
        </View>

        <Pressable onPress={handleLogout}>
          <View
            className="flex-row items-center"
            style={{
              gap: 10, backgroundColor: colors.surface, borderRadius: 14, padding: 16,
              borderWidth: 1, borderColor: colors.border,
            }}
          >
            <Ionicons name="log-out-outline" size={18} color={colors.strength} />
            <Text style={{ color: colors.strength, fontWeight: '600', fontSize: 14 }}>
              Log Out
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}
