import { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { JournalStackParamList } from '../../navigation/JournalStack';
import { useSession } from '../../state/SessionContext';
import {
  useCreateJournalEntry,
  useDeleteJournalEntry,
  useJournalEntries,
  useUpdateJournalEntry,
} from '../../api/journal';
import { JournalMood, MOOD_EMOJI, MOOD_ORDER } from '../../types/journal';
import PrimaryButton from '../../components/PrimaryButton';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<JournalStackParamList, 'JournalEntry'>;

export default function JournalEntryScreen({ route, navigation }: Props) {
  const entryId = route.params?.entryId;
  const { programId } = useSession();
  const entries = useJournalEntries(programId);
  const existing = useMemo(
    () => entries.data?.find((e) => e.id === entryId) ?? null,
    [entries.data, entryId],
  );

  const [mood, setMood] = useState<JournalMood>(existing?.mood ?? JournalMood.GOOD);
  const [text, setText] = useState(existing?.text ?? '');
  const [photoUri, setPhotoUri] = useState<string | null>(existing?.photoUri ?? null);

  const createEntry = useCreateJournalEntry(programId);
  const updateEntry = useUpdateJournalEntry(programId);
  const deleteEntry = useDeleteJournalEntry(programId);
  const saving = createEntry.isPending || updateEntry.isPending;

  const confirmDelete = () => {
    Alert.alert('Delete entry?', 'This can\'t be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          if (!entryId) return;
          await deleteEntry.mutateAsync(entryId);
          navigation.goBack();
        },
      },
    ]);
  };

  const pickPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const save = async () => {
    if (!text.trim()) {
      return;
    }
    if (entryId) {
      await updateEntry.mutateAsync({ id: entryId, mood, text: text.trim(), photoUri });
    } else {
      await createEntry.mutateAsync({ mood, text: text.trim(), photoUri: photoUri ?? undefined });
    }
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerClassName="px-6 pt-16 pb-10"
        keyboardShouldPersistTaps="handled"
        style={{ flex: 1 }}
      >
        <View className="flex-row justify-between items-center" style={{ marginBottom: 14 }}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
            <Text className="text-textMuted" style={{ fontSize: 13 }}>‹ Journal</Text>
          </Pressable>
          {entryId && (
            <Pressable onPress={confirmDelete} hitSlop={8}>
              <Text style={{ color: colors.strength, fontSize: 13 }}>Delete</Text>
            </Pressable>
          )}
        </View>
        <Text className="font-display text-text" style={{ fontSize: 19, marginBottom: 16 }}>
          How did today feel?
        </Text>

        <View className="flex-row" style={{ gap: 8, marginBottom: 20 }}>
          {MOOD_ORDER.map((m) => {
            const selected = mood === m;
            return (
              <Pressable
                key={m}
                onPress={() => setMood(m)}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  paddingVertical: 10,
                  borderRadius: 12,
                  backgroundColor: selected ? `${colors.primary}33` : colors.surface,
                  borderWidth: 1.5,
                  borderColor: selected ? colors.primary : colors.border,
                }}
              >
                <Text style={{ fontSize: 22 }}>{MOOD_EMOJI[m]}</Text>
              </Pressable>
            );
          })}
        </View>

        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Write two lines about today..."
          placeholderTextColor={colors.textMuted}
          multiline
          className="bg-surface rounded-2xl border border-border px-4 py-4 text-text"
          style={{ minHeight: 140, textAlignVertical: 'top', fontSize: 14 }}
        />

        <View className="flex-row" style={{ gap: 10, marginTop: 14 }}>
          <Pressable
            onPress={pickPhoto}
            style={{
              flex: 1,
              height: 64,
              borderRadius: 12,
              borderWidth: 1.5,
              borderColor: colors.border,
              backgroundColor: colors.surface,
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={{ width: '100%', height: '100%' }} />
            ) : (
              <View className="flex-row items-center" style={{ gap: 6 }}>
                <Ionicons name="image-outline" size={16} color={colors.textMuted} />
                <Text className="text-textMuted" style={{ fontSize: 12.5 }}>
                  Attach photo
                </Text>
              </View>
            )}
          </Pressable>
        </View>

        <View style={{ marginTop: 20 }}>
          <PrimaryButton
            label="Save entry"
            onPress={save}
            loading={saving}
            disabled={!text.trim()}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
