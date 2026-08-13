import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ToolsStackParamList } from '../../navigation/ToolsStack';
import { useSession } from '../../state/SessionContext';
import { useReadingLibrary } from '../../api/reading';
import { ReadingLibraryItem } from '../../types/reading';
import { STAT_COLOR } from '../../components/QuestCard';
import GlassCard from '../../components/GlassCard';
import { colors } from '../../theme/colors';
import { CARD_SHADOW } from '../../theme/shadows';

type Props = NativeStackScreenProps<ToolsStackParamList, 'ReadingLibrary'>;

function groupByCategory(items: ReadingLibraryItem[]) {
  const map = new Map<string, ReadingLibraryItem[]>();
  for (const item of items) {
    const list = map.get(item.category) ?? [];
    list.push(item);
    map.set(item.category, list);
  }
  return Array.from(map.entries());
}

export default function ReadingLibraryScreen({ navigation }: Props) {
  const { programId } = useSession();
  const library = useReadingLibrary(programId);

  if (library.isPending) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (library.isError) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-6">
        <Text className="text-strength text-center">Couldn't load the reading library.</Text>
      </View>
    );
  }

  const sections = groupByCategory(library.data ?? []);

  return (
    <View className="flex-1 bg-background">
      <LinearGradient
        colors={[`${colors.primary}33`, colors.background]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '60%' }}
      />
      <ScrollView contentContainerClassName="px-6 pt-16 pb-6">
        <Pressable onPress={() => navigation.goBack()} style={{ marginBottom: 14 }} hitSlop={8}>
          <Text className="text-textMuted" style={{ fontSize: 13 }}>‹ Tools</Text>
        </Pressable>
        <Text className="font-display text-text" style={{ fontSize: 20, marginBottom: 16 }}>
          Reading Library
        </Text>

        {sections.map(([category, items]) => (
          <View key={category} style={{ marginBottom: 16 }}>
            <Text
              className="text-textMuted"
              style={{
                fontSize: 12.5,
                fontWeight: '700',
                marginBottom: 8,
                textTransform: 'uppercase',
                letterSpacing: 0.4,
              }}
            >
              {category} ({items.length})
            </Text>
            {items.map((entry) => {
              const statColor = STAT_COLOR[entry.category] ?? colors.primary;
              return (
                <Pressable
                  key={entry.id}
                  onPress={() => navigation.navigate('ReadingLesson', { entryId: entry.id })}
                  style={{ marginBottom: 8 }}
                >
                  <GlassCard style={[CARD_SHADOW, { flexDirection: 'row', gap: 12, alignItems: 'center' }]}>
                    <View
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 10,
                        backgroundColor: `${statColor}22`,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Ionicons name="book" size={18} color={statColor} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        className="font-semibold"
                        style={{ color: colors.text, fontSize: 13.5 }}
                        numberOfLines={1}
                      >
                        {entry.title}
                      </Text>
                      <Text className="text-textMuted" style={{ fontSize: 11, marginTop: 3 }}>
                        {entry.estimatedMinutes} min · {entry.isOriginal ? 'Original' : entry.author ?? 'Public domain'}
                      </Text>
                      {entry.assigned ? (
                        <Text
                          style={{
                            color: colors.primary,
                            fontWeight: '700',
                            fontSize: 10,
                            marginTop: 4,
                            letterSpacing: 0.3,
                          }}
                        >
                          TODAY'S QUEST
                        </Text>
                      ) : entry.completed ? (
                        <Text className="text-textMuted" style={{ fontSize: 10, marginTop: 4 }}>
                          ✓ Read
                        </Text>
                      ) : null}
                    </View>
                  </GlassCard>
                </Pressable>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
