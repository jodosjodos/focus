import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '../../navigation/ProfileStack';
import { useSession } from '../../state/SessionContext';
import { useProgramStats, useTodayQuests } from '../../api/programs';
import { session, type StoredUser } from '../../api/session';
import GlassCard from '../../components/GlassCard';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Profile'>;

export default function ProfileScreen({ navigation }: Props) {
  const { programId } = useSession();
  const stats = useProgramStats(programId);
  const today = useTodayQuests(programId);
  const [user, setUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    session.getUser().then(setUser);
  }, []);

  if (stats.isPending || today.isPending) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background px-6 pt-16">
      <LinearGradient
        colors={[`${colors.primary}33`, colors.background]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '60%' }}
      />
      <View className="items-center" style={{ marginBottom: 20 }}>
        <View
          style={{
            width: 84, height: 84, borderRadius: 42,
            backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
            alignItems: 'center', justifyContent: 'center', marginBottom: 12,
          }}
        >
          <Ionicons name="person" size={34} color={colors.textMuted} />
        </View>
        <Text className="font-display text-text" style={{ fontSize: 19 }}>
          {user?.displayName ?? '—'}
        </Text>
        <Text className="text-textMuted" style={{ fontSize: 12.5, marginTop: 2 }}>
          Level {stats.data?.currentLevel ?? 1} · Day {today.data?.day ?? 1}/
          {today.data?.lengthDays ?? '—'}
        </Text>
      </View>

      <View className="flex-row" style={{ gap: 8, marginBottom: 20 }}>
        <GlassCard style={{ flex: 1 }}>
          <Text className="font-display text-text text-center" style={{ fontSize: 16 }}>
            {stats.data?.streakCount ?? 0}
          </Text>
          <Text className="text-textMuted text-center" style={{ fontSize: 10, marginTop: 2 }}>
            day streak
          </Text>
        </GlassCard>
        <GlassCard style={{ flex: 1 }}>
          <Text className="font-display text-text text-center" style={{ fontSize: 16 }}>
            {stats.data?.totalQuestsCompleted ?? 0}
          </Text>
          <Text className="text-textMuted text-center" style={{ fontSize: 10, marginTop: 2 }}>
            quests done
          </Text>
        </GlassCard>
      </View>

      <Pressable onPress={() => navigation.navigate('Settings')}>
        <View
          className="flex-row items-center justify-between"
          style={{
            backgroundColor: colors.surface, borderRadius: 14, padding: 16,
            borderWidth: 1, borderColor: colors.border,
          }}
        >
          <View className="flex-row items-center" style={{ gap: 10 }}>
            <Ionicons name="settings-outline" size={18} color={colors.textMuted} />
            <Text className="text-text font-semibold" style={{ fontSize: 14 }}>Settings</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </View>
      </Pressable>
    </View>
  );
}
