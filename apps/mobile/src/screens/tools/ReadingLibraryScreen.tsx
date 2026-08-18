import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ToolsStackParamList } from '../../navigation/ToolsStack';
import { useSession } from '../../state/SessionContext';
import { useReadingLibrary } from '../../api/reading';
import { ReadingLibraryItem } from '../../types/reading';
import { STAT_COLOR } from '../../components/QuestCard';
import BackButton from '../../components/BackButton';
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

function BookCover({ category, statColor }: { category: string; statColor: string }) {
  return (
    <LinearGradient
      colors={[`${statColor}66`, `${statColor}1a`]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        width: 52,
        height: 68,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: `${statColor}55`,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <View
        style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, backgroundColor: `${statColor}88` }}
      />
      <Text style={{ color: statColor, fontSize: 20, fontWeight: '800' }}>{category.charAt(0)}</Text>
    </LinearGradient>
  );
}

export default function ReadingLibraryScreen({ navigation }: Props) {
  const { programId } = useSession();
  const library = useReadingLibrary(programId);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

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

  const data = library.data ?? [];
  const allSections = useMemo(() => groupByCategory(data), [data]);
  const categories = allSections.map(([category]) => category);
  const sections = activeCategory ? allSections.filter(([c]) => c === activeCategory) : allSections;

  return (
    <View className="flex-1 bg-background">
      <LinearGradient
        colors={[`${colors.primary}33`, colors.background]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '60%' }}
      />
      <View className="px-6" style={{ paddingTop: 64 }}>
        <BackButton label="Tools" onPress={() => navigation.goBack()} style={{ marginBottom: 14 }} />
        <Text className="font-display text-text" style={{ fontSize: 20, marginBottom: 4 }}>
          Reading Library
        </Text>
        <Text className="text-textMuted" style={{ fontSize: 12.5, marginBottom: 14 }}>
          {data.length} entries · browse or read ahead
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 14, alignItems: 'center' }}
        style={{ flexGrow: 0, height: 75 }}
      >
        <Pressable
          onPress={() => setActiveCategory(null)}
          style={{
            flexShrink: 0,
            marginRight: 8,
            height: 34,
            paddingHorizontal: 14,
            borderRadius: 20,
            backgroundColor: !activeCategory ? colors.primary : colors.surface,
            borderWidth: 1,
            borderColor: !activeCategory ? colors.primary : colors.border,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            numberOfLines={1}
            style={{ color: !activeCategory ? '#fff' : colors.textMuted, fontSize: 12.5, fontWeight: '700' }}
          >
            All
          </Text>
        </Pressable>
        {categories.map((category, i) => {
          const statColor = STAT_COLOR[category] ?? colors.primary;
          const selected = activeCategory === category;
          return (
            <Pressable
              key={category}
              onPress={() => setActiveCategory(category)}
              style={{
                flexShrink: 0,
                marginRight: i === categories.length - 1 ? 0 : 8,
                height: 34,
                paddingHorizontal: 14,
                borderRadius: 20,
                backgroundColor: selected ? statColor : colors.surface,
                borderWidth: 1,
                borderColor: selected ? statColor : colors.border,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                numberOfLines={1}
                style={{ color: selected ? '#fff' : colors.textMuted, fontSize: 12.5, fontWeight: '700' }}
              >
                {category}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView contentContainerClassName="px-6 pb-6">
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
                  style={{ marginBottom: 10 }}
                >
                  <GlassCard style={[CARD_SHADOW, { flexDirection: 'row', gap: 13, alignItems: 'center' }]}>
                    <BookCover category={entry.category} statColor={statColor} />
                    <View style={{ flex: 1 }}>
                      <Text
                        className="font-semibold"
                        style={{ color: colors.text, fontSize: 14 }}
                        numberOfLines={2}
                      >
                        {entry.title}
                      </Text>
                      <Text className="text-textMuted" style={{ fontSize: 11, marginTop: 4 }}>
                        {entry.isOriginal ? 'Original' : entry.author ?? 'Public domain'}
                      </Text>
                      <View className="flex-row items-center" style={{ gap: 6, marginTop: 6 }}>
                        <View className="flex-row items-center" style={{ gap: 3 }}>
                          <Ionicons name="time-outline" size={11} color={colors.textMuted} />
                          <Text className="text-textMuted" style={{ fontSize: 10.5 }}>
                            {entry.estimatedMinutes} min
                          </Text>
                        </View>
                        {entry.assigned ? (
                          <View style={{ backgroundColor: `${colors.primary}22`, borderRadius: 5, paddingHorizontal: 6, paddingVertical: 2 }}>
                            <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 9.5 }}>
                              TODAY'S QUEST
                            </Text>
                          </View>
                        ) : entry.completed ? (
                          <View className="flex-row items-center" style={{ gap: 3 }}>
                            <Ionicons name="checkmark-circle" size={11} color={colors.success} />
                            <Text style={{ color: colors.success, fontSize: 10.5 }}>Read</Text>
                          </View>
                        ) : null}
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
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
