import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '../../navigation/ProfileStack';
import { useSession } from '../../state/SessionContext';
import { useProgramStats, useTodayQuests } from '../../api/programs';
import { session, type StoredUser } from '../../api/session';
import GlassCard from '../../components/GlassCard';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Profile'>;

const CARD_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.35,
  shadowRadius: 18,
  elevation: 6,
};

function StatBox({ value, label }: { value: string; label: string }) {
  return (
    <View
      className="flex-1 items-center"
      style={{
        backgroundColor: colors.surface, borderRadius: 14, paddingVertical: 14,
        borderWidth: 1, borderColor: colors.border,
      }}
    >
      <Text className="font-display text-text" style={{ fontSize: 18 }}>{value}</Text>
      <Text className="text-textMuted" style={{ fontSize: 10.5, marginTop: 2 }}>{label}</Text>
    </View>
  );
}

function ListRow({
  icon,
  iconColor,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress}>
      <GlassCard style={CARD_SHADOW}>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center" style={{ gap: 10 }}>
            <Ionicons name={icon} size={18} color={iconColor} />
            <Text className="text-text font-semibold" style={{ fontSize: 14 }}>{label}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </View>
      </GlassCard>
    </Pressable>
  );
}

export default function ProfileScreen({ navigation }: Props) {
  const { programId } = useSession();
  const stats = useProgramStats(programId);
  const today = useTodayQuests(programId);
  const [user, setUser] = useState<StoredUser | null>(null);
  const [showPhotoNote, setShowPhotoNote] = useState(false);

  useFocusEffect(
    useCallback(() => {
      session.getUser().then(setUser);
    }, []),
  );

  useEffect(() => {
    if (!showPhotoNote) return;
    const t = setTimeout(() => setShowPhotoNote(false), 2600);
    return () => clearTimeout(t);
  }, [showPhotoNote]);

  if (stats.isPending || today.isPending) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  const day = today.data?.day ?? 1;

  return (
    <View className="flex-1 bg-background px-6 pt-16">
      <LinearGradient
        colors={[`${colors.primary}33`, colors.background]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '60%' }}
      />
      <View className="items-center" style={{ marginBottom: 18 }}>
        <Pressable onPress={() => setShowPhotoNote(true)}>
          <View
            style={{
              width: 92, height: 92, borderRadius: 46,
              borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.22)', borderStyle: 'dashed',
              alignItems: 'center', justifyContent: 'center', marginBottom: 12,
            }}
          >
            <Ionicons name="camera-outline" size={20} color={colors.textMuted} />
            <Text className="text-textMuted text-center" style={{ fontSize: 10.5, marginTop: 4, lineHeight: 13, paddingHorizontal: 10 }}>
              Add a photo
            </Text>
          </View>
        </Pressable>
        {showPhotoNote && (
          <View
            style={{
              backgroundColor: `${colors.primary}22`, borderWidth: 1, borderColor: `${colors.primary}44`,
              borderRadius: 10, paddingVertical: 6, paddingHorizontal: 12, marginBottom: 10,
            }}
          >
            <Text style={{ color: colors.primary, fontSize: 11.5, fontWeight: '600' }}>
              Photo uploads arrive in a later phase
            </Text>
          </View>
        )}
        <Text className="font-display text-text" style={{ fontSize: 20 }}>
          {user?.displayName ?? '—'}
        </Text>
        <Text className="text-textMuted" style={{ fontSize: 12.5, marginTop: 2 }}>
          Level {stats.data?.currentLevel ?? 1} · Day {day}/{today.data?.lengthDays ?? '—'}
        </Text>
        <Text style={{ color: colors.primary, fontSize: 12.5, fontWeight: '600', marginTop: 8 }}>
          Day {day} of becoming who you said you'd be.
        </Text>
      </View>

      <View className="flex-row" style={{ gap: 8, marginBottom: 20 }}>
        <StatBox value={String(stats.data?.streakCount ?? 0)} label="day streak" />
        <StatBox value={String(stats.data?.totalQuestsCompleted ?? 0)} label="quests done" />
        <StatBox value="–" label="entries" />
      </View>

      <View style={{ gap: 10 }}>
        <ListRow
          icon="person-outline"
          iconColor={colors.primary}
          label="Edit Profile"
          onPress={() => navigation.navigate('EditProfile')}
        />
        <ListRow
          icon="trophy-outline"
          iconColor={colors.wisdom}
          label="Achievements"
          onPress={() => navigation.navigate('Achievements')}
        />
        <ListRow
          icon="settings-outline"
          iconColor={colors.textMuted}
          label="Settings"
          onPress={() => navigation.navigate('Settings')}
        />
      </View>
    </View>
  );
}
