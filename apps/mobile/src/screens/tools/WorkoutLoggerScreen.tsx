import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ToolsStackParamList } from '../../navigation/ToolsStack';
import { useSession } from '../../state/SessionContext';
import { useTodayQuests } from '../../api/programs';
import { useCompleteQuest } from '../../api/quests';
import { QuestStatus, QuestType } from '../../types/quest';
import GlassCard from '../../components/GlassCard';
import BackButton from '../../components/BackButton';
import QuestCompleteBurst from '../../components/QuestCompleteBurst';
import { colors } from '../../theme/colors';
import { CARD_SHADOW } from '../../theme/shadows';

type Props = NativeStackScreenProps<ToolsStackParamList, 'WorkoutLogger'>;

interface WorkoutSet {
  reps: string;
  weight: string;
}

interface Exercise {
  name: string;
  imageUrl?: string | null;
  sets: WorkoutSet[];
}

export default function WorkoutLoggerScreen({ navigation, route }: Props) {
  const { programId } = useSession();
  const today = useTodayQuests(programId);
  const completeQuest = useCompleteQuest(programId);

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [newExerciseName, setNewExerciseName] = useState('');
  const [repsInput, setRepsInput] = useState<Record<number, string>>({});
  const [weightInput, setWeightInput] = useState<Record<number, string>>({});
  const [burstXp, setBurstXp] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const picked = route.params?.pickedExercise;
    if (picked) {
      setExercises((prev) => [...prev, { name: picked.name, imageUrl: picked.imageUrl, sets: [] }]);
      navigation.setParams({ pickedExercise: undefined });
    }
  }, [route.params?.pickedExercise, navigation]);

  const addExercise = () => {
    if (!newExerciseName.trim()) return;
    setExercises((prev) => [...prev, { name: newExerciseName.trim(), sets: [] }]);
    setNewExerciseName('');
  };

  const addSet = (index: number) => {
    const reps = repsInput[index]?.trim();
    const weight = weightInput[index]?.trim();
    if (!reps) return;
    setExercises((prev) =>
      prev.map((ex, i) =>
        i === index ? { ...ex, sets: [...ex.sets, { reps, weight: weight || '—' }] } : ex,
      ),
    );
    setRepsInput((prev) => ({ ...prev, [index]: '' }));
    setWeightInput((prev) => ({ ...prev, [index]: '' }));
  };

  const finishWorkout = () => {
    const summary = exercises
      .filter((ex) => ex.sets.length > 0)
      .map((ex) => `${ex.name} ${ex.sets.length}x${ex.sets[0]?.reps ?? ''}`)
      .join(', ');

    setFinished(true);
    setExercises([]);

    const workoutQuest = today.data?.quests.find(
      (q) => q.status === QuestStatus.PENDING && q.questType === QuestType.WORKOUT,
    );
    if (workoutQuest) {
      completeQuest.mutate(
        { questId: workoutQuest.id, loggedValue: summary || undefined },
        { onSuccess: (result) => setBurstXp(result.xpAwarded) },
      );
    }
  };

  const hasLoggedSets = exercises.some((ex) => ex.sets.length > 0);

  return (
    <View className="flex-1 bg-background">
      <LinearGradient
        colors={[`${colors.primary}33`, colors.background]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '60%' }}
      />
      <ScrollView contentContainerClassName="px-6 pt-16 pb-10">
        <BackButton label="Tools" onPress={() => navigation.goBack()} style={{ marginBottom: 14 }} />
        <Text className="font-display text-text" style={{ fontSize: 20, marginBottom: 16 }}>
          Workout Logger
        </Text>

        {exercises.map((exercise, index) => (
          <GlassCard key={`${exercise.name}-${index}`} style={[CARD_SHADOW, { marginBottom: 10 }]}>
            <View className="flex-row items-center" style={{ gap: 10, marginBottom: 8 }}>
              {exercise.imageUrl ? (
                <Image
                  source={{ uri: exercise.imageUrl }}
                  resizeMode="cover"
                  style={{ width: 40, height: 40, borderRadius: 8 }}
                />
              ) : (
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 8,
                    backgroundColor: `${colors.strength}22`,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name="barbell-outline" size={17} color={colors.strength} />
                </View>
              )}
              <Text className="font-semibold" style={{ color: colors.text, fontSize: 14, flex: 1 }}>
                {exercise.name}
              </Text>
            </View>
            {exercise.sets.map((set, setIndex) => (
              <View key={setIndex} className="flex-row" style={{ gap: 8, marginBottom: 4 }}>
                <Text className="text-textMuted" style={{ fontSize: 12.5, width: 50 }}>
                  Set {setIndex + 1}
                </Text>
                <Text className="text-textMuted" style={{ fontSize: 12.5 }}>{set.reps} reps</Text>
                <Text className="text-textMuted" style={{ fontSize: 12.5 }}>·</Text>
                <Text className="text-textMuted" style={{ fontSize: 12.5 }}>{set.weight}</Text>
              </View>
            ))}
            <View className="flex-row" style={{ gap: 8, marginTop: 6 }}>
              <TextInput
                value={repsInput[index] ?? ''}
                onChangeText={(v) => setRepsInput((prev) => ({ ...prev, [index]: v }))}
                placeholder="reps"
                placeholderTextColor={colors.textMuted}
                keyboardType="number-pad"
                style={{
                  flex: 1,
                  backgroundColor: colors.surface,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: colors.border,
                  color: colors.text,
                  paddingHorizontal: 10,
                  paddingVertical: 8,
                  fontSize: 12.5,
                }}
              />
              <TextInput
                value={weightInput[index] ?? ''}
                onChangeText={(v) => setWeightInput((prev) => ({ ...prev, [index]: v }))}
                placeholder="weight (kg)"
                placeholderTextColor={colors.textMuted}
                style={{
                  flex: 1,
                  backgroundColor: colors.surface,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: colors.border,
                  color: colors.text,
                  paddingHorizontal: 10,
                  paddingVertical: 8,
                  fontSize: 12.5,
                }}
              />
              <Pressable onPress={() => addSet(index)} style={{ justifyContent: 'center', paddingHorizontal: 4 }}>
                <Text style={{ color: colors.strength, fontWeight: '600', fontSize: 11.5 }}>+ add set</Text>
              </Pressable>
            </View>
          </GlassCard>
        ))}

        <Pressable
          onPress={() =>
            navigation.navigate('WorkoutExercisePicker', {
              addedNames: exercises.map((ex) => ex.name),
            })
          }
          style={{ marginTop: 4, marginBottom: 10 }}
        >
          <GlassCard
            style={CARD_SHADOW}
            contentStyle={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 13 }}
          >
            <View
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                backgroundColor: `${colors.strength}22`,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="images" size={16} color={colors.strength} />
            </View>
            <View style={{ flex: 1 }}>
              <Text className="font-semibold" style={{ color: colors.text, fontSize: 13.5 }}>
                Browse exercise library
              </Text>
              <Text className="text-textMuted" style={{ fontSize: 11, marginTop: 2 }}>
                Real exercises with photos, by muscle group
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </GlassCard>
        </Pressable>

        <Text
          className="text-textMuted"
          style={{ fontSize: 11, marginBottom: 8, textAlign: 'center' }}
        >
          or add one manually
        </Text>

        <View className="flex-row" style={{ gap: 8, marginTop: 4, marginBottom: 16 }}>
          <TextInput
            value={newExerciseName}
            onChangeText={setNewExerciseName}
            placeholder="Add an exercise..."
            placeholderTextColor={colors.textMuted}
            onSubmitEditing={addExercise}
            style={{
              flex: 1,
              backgroundColor: colors.surface,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              color: colors.text,
              paddingHorizontal: 12,
              paddingVertical: 10,
              fontSize: 13,
            }}
          />
          <Pressable
            onPress={addExercise}
            style={{
              paddingHorizontal: 16,
              justifyContent: 'center',
              borderRadius: 12,
              backgroundColor: `${colors.strength}22`,
              borderWidth: 1,
              borderColor: `${colors.strength}55`,
            }}
          >
            <Text style={{ color: colors.strength, fontWeight: '700', fontSize: 13 }}>Add</Text>
          </Pressable>
        </View>

        <Pressable
          onPress={finishWorkout}
          disabled={!hasLoggedSets}
          style={{
            backgroundColor: hasLoggedSets ? colors.strength : `${colors.strength}66`,
            paddingVertical: 16,
            borderRadius: 16,
            alignItems: 'center',
          }}
        >
          <Text className="text-white font-bold" style={{ fontSize: 14.5 }}>Finish workout</Text>
        </Pressable>
        {finished && burstXp === null && (
          <Text className="text-success text-center" style={{ fontSize: 12.5, marginTop: 10 }}>
            Workout logged
          </Text>
        )}
      </ScrollView>
      {burstXp !== null && <QuestCompleteBurst xp={burstXp} onDone={() => setBurstXp(null)} />}
    </View>
  );
}
