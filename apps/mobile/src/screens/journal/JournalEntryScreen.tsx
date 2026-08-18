import { useMemo, useRef, useState } from 'react';
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
import BackButton from '../../components/BackButton';
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
  const inputRef = useRef<TextInput>(null);
  const selectionRef = useRef({ start: 0, end: 0 });

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

  const wrapSelection = (marker: string) => {
    const { start, end } = selectionRef.current;
    const before = text.slice(0, start);
    const selected = text.slice(start, end);
    const after = text.slice(end);
    const newText = `${before}${marker}${selected}${marker}${after}`;
    setText(newText);
    const cursor = start + marker.length + selected.length + marker.length;
    requestAnimationFrame(() => {
      inputRef.current?.setNativeProps({ selection: { start: cursor, end: cursor } });
    });
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
          <BackButton label="Journal" onPress={() => navigation.goBack()} />
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

        <View
          className="flex-row items-center bg-surface border border-border"
          style={{ borderRadius: 12, marginBottom: 8, paddingHorizontal: 4, alignSelf: 'flex-start' }}
        >
          <Pressable onPress={() => wrapSelection('**')} hitSlop={6} style={{ padding: 9 }}>
            <Text style={{ color: colors.text, fontWeight: '800', fontSize: 13 }}>B</Text>
          </Pressable>
          <View style={{ width: 1, height: 16, backgroundColor: colors.border }} />
          <Pressable onPress={() => wrapSelection('==')} hitSlop={6} style={{ padding: 9 }}>
            <Ionicons name="color-fill" size={15} color={colors.confidence} />
          </Pressable>
        </View>

        <TextInput
          ref={inputRef}
          value={text}
          onChangeText={setText}
          onSelectionChange={(e) => {
            selectionRef.current = e.nativeEvent.selection;
          }}
          placeholder="Write two lines about today... (select text, then B or highlight)"
          placeholderTextColor={colors.textMuted}
          multiline
          className="bg-surface rounded-2xl border border-border px-4 py-4 text-text"
          style={{ minHeight: 140, textAlignVertical: 'top', fontSize: 14 }}
        />

        <Pressable
          onPress={pickPhoto}
          style={{
            marginTop: 14,
            height: photoUri ? 170 : 84,
            borderRadius: 16,
            borderWidth: photoUri ? 0 : 1.5,
            borderColor: colors.border,
            borderStyle: photoUri ? 'solid' : 'dashed',
            backgroundColor: colors.surface,
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {photoUri ? (
            <>
              <Image
                source={{ uri: photoUri }}
                resizeMode="cover"
                style={{ width: '100%', height: '100%' }}
              />
              <View
                pointerEvents="none"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 50,
                  backgroundColor: 'rgba(3,6,13,0.55)',
                }}
              />
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  setPhotoUri(null);
                }}
                hitSlop={8}
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: 'rgba(3,6,13,0.6)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="close" size={16} color="#FFFFFF" />
              </Pressable>
              <View
                pointerEvents="none"
                className="flex-row items-center"
                style={{ position: 'absolute', bottom: 10, left: 12, gap: 6 }}
              >
                <Ionicons name="image" size={13} color="#FFFFFF" />
                <Text style={{ color: '#FFFFFF', fontSize: 11.5, fontWeight: '600' }}>
                  Tap to change
                </Text>
              </View>
            </>
          ) : (
            <View className="items-center" style={{ gap: 5 }}>
              <Ionicons name="image-outline" size={20} color={colors.textMuted} />
              <Text className="text-textMuted" style={{ fontSize: 12.5 }}>
                Attach a photo
              </Text>
            </View>
          )}
        </Pressable>

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
