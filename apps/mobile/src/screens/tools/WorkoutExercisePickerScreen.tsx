import { useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ToolsStackParamList } from '../../navigation/ToolsStack';
import { useExerciseCategories, useExercisesByCategory } from '../../api/wger';
import BackButton from '../../components/BackButton';
import GlassCard from '../../components/GlassCard';
import { colors } from '../../theme/colors';
import { CARD_SHADOW } from '../../theme/shadows';

type Props = NativeStackScreenProps<ToolsStackParamList, 'WorkoutExercisePicker'>;

export default function WorkoutExercisePickerScreen({ navigation, route }: Props) {
  const addedNames = new Set((route.params?.addedNames ?? []).map((n) => n.toLowerCase()));
  const categories = useExerciseCategories();
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const exercises = useExercisesByCategory(activeCategoryId);

  const pick = (name: string, imageUrl: string | null) => {
    navigation.navigate('WorkoutLogger', { pickedExercise: { name, imageUrl } });
  };

  return (
    <View className="flex-1 bg-background">
      <View className="px-6" style={{ paddingTop: 64 }}>
        <BackButton label="Workout" onPress={() => navigation.goBack()} style={{ marginBottom: 14 }} />
        <Text className="font-display text-text" style={{ fontSize: 20, marginBottom: 4 }}>
          Exercise Library
        </Text>
        <Text className="text-textMuted" style={{ fontSize: 12.5, marginBottom: 14 }}>
          Pulled live from wger's free exercise database
        </Text>
      </View>

      {categories.isPending ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: 20 }} />
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 14, alignItems: 'center' }}
          style={{ flexGrow: 0, height: 48 }}
        >
          {(categories.data ?? []).map((category, i) => {
            const selected = activeCategoryId === category.id;
            return (
              <Pressable
                key={category.id}
                onPress={() => setActiveCategoryId(category.id)}
                style={{
                  flexShrink: 0,
                  marginLeft: i === 0 ? 0 : 8,
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor: selected ? colors.strength : colors.surface,
                  borderWidth: 1,
                  borderColor: selected ? colors.strength : colors.border,
                }}
              >
                <Text
                  numberOfLines={1}
                  style={{ color: selected ? '#FFFFFF' : colors.textMuted, fontSize: 12.5, fontWeight: '700' }}
                >
                  {category.name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      )}

      <ScrollView contentContainerClassName="px-6 pb-10">
        {activeCategoryId === null ? (
          <View style={{ paddingVertical: 50, alignItems: 'center', gap: 8 }}>
            <Ionicons name="barbell-outline" size={26} color={colors.textMuted} />
            <Text className="text-textMuted text-center">Pick a muscle group above to browse exercises.</Text>
          </View>
        ) : exercises.isPending ? (
          <ActivityIndicator color={colors.strength} style={{ marginTop: 30 }} />
        ) : exercises.isError ? (
          <Text className="text-strength text-center" style={{ marginTop: 30 }}>
            Couldn't reach the exercise library.
          </Text>
        ) : (
          <View className="flex-row flex-wrap" style={{ gap: 10 }}>
            {(exercises.data ?? []).map((ex) => {
              const added = addedNames.has(ex.name.toLowerCase());
              return (
              <Pressable key={ex.id} onPress={() => pick(ex.name, ex.imageUrl)} style={{ width: '47%' }}>
                <GlassCard style={CARD_SHADOW} contentStyle={{ padding: 0 }}>
                  <View style={{ width: '100%', height: 100, backgroundColor: colors.background }}>
                    {ex.imageUrl ? (
                      <Image source={{ uri: ex.imageUrl }} resizeMode="cover" style={{ width: '100%', height: '100%', opacity: added ? 0.5 : 1 }} />
                    ) : (
                      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Ionicons name="barbell-outline" size={22} color={colors.textMuted} />
                      </View>
                    )}
                    {added && (
                      <View
                        style={{
                          position: 'absolute',
                          top: 6,
                          right: 6,
                          backgroundColor: colors.success,
                          borderRadius: 5,
                          paddingHorizontal: 6,
                          paddingVertical: 3,
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 3,
                        }}
                      >
                        <Ionicons name="checkmark" size={10} color="#03060d" />
                        <Text style={{ color: '#03060d', fontSize: 9.5, fontWeight: '800' }}>Added</Text>
                      </View>
                    )}
                  </View>
                  <Text
                    className="font-semibold"
                    style={{ color: added ? colors.textMuted : colors.text, fontSize: 12, padding: 10 }}
                    numberOfLines={2}
                  >
                    {ex.name}
                  </Text>
                </GlassCard>
              </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
