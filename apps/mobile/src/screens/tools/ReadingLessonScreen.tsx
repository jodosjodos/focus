import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ToolsStackParamList } from '../../navigation/ToolsStack';
import { useSession } from '../../state/SessionContext';
import { useCompleteReadingEntry, useReadingLibrary } from '../../api/reading';
import QuestCompleteBurst from '../../components/QuestCompleteBurst';
import BackButton from '../../components/BackButton';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<ToolsStackParamList, 'ReadingLesson'>;

export default function ReadingLessonScreen({ route, navigation }: Props) {
  const { entryId } = route.params;
  const { programId } = useSession();
  const library = useReadingLibrary(programId);
  const complete = useCompleteReadingEntry(programId);
  const [burstXp, setBurstXp] = useState<number | null>(null);
  const [justCompleted, setJustCompleted] = useState(false);

  const entry = useMemo(
    () => library.data?.find((e) => e.id === entryId) ?? null,
    [library.data, entryId],
  );

  if (library.isPending || !entry) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  const alreadyDone = entry.completed || justCompleted;

  const markComplete = () => {
    complete.mutate(entry.id, {
      onSuccess: (result) => {
        setJustCompleted(true);
        if (result.xpAwarded > 0) {
          setBurstXp(result.xpAwarded);
        }
      },
    });
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: 64 }}>
      <View className="px-6" style={{ flex: 1 }}>
        <BackButton label="Reading Library" onPress={() => navigation.goBack()} style={{ marginBottom: 14 }} />
        <Text className="font-display text-text" style={{ fontSize: 19 }}>
          {entry.title}
        </Text>
        <Text className="text-textMuted" style={{ fontSize: 11.5, marginTop: 4, marginBottom: 14 }}>
          {entry.estimatedMinutes} min · {entry.isOriginal ? 'Original' : entry.author ?? 'Public domain'}
        </Text>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20 }}>
          <Text style={{ fontSize: 14.5, lineHeight: 24.5, color: colors.text }}>{entry.content}</Text>
        </ScrollView>
        <Pressable
          onPress={markComplete}
          disabled={alreadyDone || complete.isPending}
          style={{
            backgroundColor: alreadyDone ? colors.surface : colors.success,
            borderWidth: alreadyDone ? 1.5 : 0,
            borderColor: colors.border,
            paddingVertical: 14,
            borderRadius: 14,
            alignItems: 'center',
            marginTop: 14,
            marginBottom: 24,
          }}
        >
          <Text
            style={{
              color: alreadyDone ? colors.textMuted : '#fff',
              fontWeight: '700',
              fontSize: 14.5,
            }}
          >
            {alreadyDone ? '✓ Read' : entry.assigned ? 'Mark complete · earns XP' : 'Mark as read'}
          </Text>
        </Pressable>
      </View>
      {burstXp !== null && <QuestCompleteBurst xp={burstXp} onDone={() => setBurstXp(null)} />}
    </View>
  );
}
