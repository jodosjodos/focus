import { Modal, Text, TextInput, View } from 'react-native';
import { QuestType } from '../../types/quest';
import PrimaryButton from '../../components/PrimaryButton';

const PLACEHOLDER_BY_TYPE: Partial<Record<QuestType, string>> = {
  [QuestType.QUANTITY]: 'e.g. 2.5L',
  [QuestType.DURATION]: 'e.g. 25 min',
  [QuestType.WORKOUT]: 'e.g. 3x10 @ 40kg',
};

export default function QuestDetailModal({
  visible,
  title,
  description,
  target,
  questType,
  loggedValue,
  onChangeLoggedValue,
  onConfirm,
  onCancel,
  loading,
}: {
  visible: boolean;
  title: string;
  description: string;
  target: string | null;
  questType: QuestType;
  loggedValue: string;
  onChangeLoggedValue: (value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 justify-end bg-black/60">
        <View className="bg-surface border-t border-border rounded-t-3xl p-6">
          <Text className="font-display text-xl text-text mb-1">{title}</Text>
          <Text className="text-textMuted mb-4">{description}</Text>
          {target && (
            <Text className="text-textMuted mb-4">Target: {target}</Text>
          )}

          <TextInput
            value={loggedValue}
            onChangeText={onChangeLoggedValue}
            placeholder={PLACEHOLDER_BY_TYPE[questType] ?? 'Notes (optional)'}
            placeholderTextColor="#7C8AA6"
            className="bg-background rounded-2xl border border-border p-4 text-text mb-6"
          />

          <PrimaryButton
            label="Mark Complete"
            onPress={onConfirm}
            loading={loading}
          />
          <Text
            className="text-center text-textMuted mt-4"
            onPress={onCancel}
          >
            Cancel
          </Text>
        </View>
      </View>
    </Modal>
  );
}
