import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { JournalStackParamList } from '../../navigation/JournalStack';
import { useSession } from '../../state/SessionContext';
import { useJournalEntries } from '../../api/journal';
import { MOOD_EMOJI } from '../../types/journal';
import GlassCard from '../../components/GlassCard';
import { colors } from '../../theme/colors';
import { CARD_SHADOW } from '../../theme/shadows';

type Props = NativeStackScreenProps<JournalStackParamList, 'Journal'>;

export default function JournalScreen({ navigation }: Props) {
  const { programId } = useSession();
  const entries = useJournalEntries(programId);

  if (entries.isPending) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (entries.isError) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-6">
        <Text className="text-strength text-center">Couldn't load your journal.</Text>
      </View>
    );
  }

  const items = entries.data ?? [];

  return (
    <View className="flex-1 bg-background">
      <LinearGradient
        colors={[`${colors.primary}33`, colors.background]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '60%' }}
      />
      <ScrollView contentContainerClassName="px-6 pt-16 pb-6">
        <View className="flex-row justify-between items-center" style={{ marginBottom: 16 }}>
          <View>
            <Text className="font-display text-text" style={{ fontSize: 22 }}>
              Journal
            </Text>
            <Text className="text-textMuted" style={{ fontSize: 12, marginTop: 2 }}>
              {items.length} {items.length === 1 ? 'entry' : 'entries'} · your own record
            </Text>
          </View>
          <Pressable
            onPress={() => navigation.navigate('JournalEntry', undefined)}
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              backgroundColor: colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700', lineHeight: 22 }}>+</Text>
          </Pressable>
        </View>

        {items.length === 0 ? (
          <View style={{ paddingVertical: 40, alignItems: 'center' }}>
            <Text className="text-textMuted text-center">
              No entries yet — write about today.
            </Text>
          </View>
        ) : (
          items.map((entry) => (
            <Pressable
              key={entry.id}
              onPress={() => navigation.navigate('JournalEntry', { entryId: entry.id })}
              style={{ marginBottom: 10 }}
            >
              <GlassCard style={CARD_SHADOW}>
                <View className="flex-row justify-between items-start">
                  <Text className="font-semibold" style={{ color: colors.text, fontSize: 13 }}>
                    Day {entry.dayNumber}
                  </Text>
                  <Text style={{ fontSize: 18 }}>{MOOD_EMOJI[entry.mood]}</Text>
                </View>
                <Text
                  className="text-textMuted"
                  style={{ fontSize: 13, marginTop: 4, lineHeight: 18 }}
                  numberOfLines={2}
                >
                  {entry.text}
                </Text>
                {entry.photoUri && (
                  <Image
                    source={{ uri: entry.photoUri }}
                    style={{ width: '100%', height: 110, borderRadius: 10, marginTop: 8 }}
                  />
                )}
              </GlassCard>
            </Pressable>
          ))
        )}
      </ScrollView>
    </View>
  );
}
