import { Modal, Text, TextInput, View } from 'react-native';
import { QuestType } from '../../types/quest';
import PrimaryButton from '../../components/PrimaryButton';
import { colors } from '../../theme/colors';

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
  difficulty,
  statColor,
  primaryStat,
  secondaryStat,
  statGain,
  xp,
  isLowestStat,
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
  difficulty: string;
  statColor: string;
  primaryStat: string;
  secondaryStat: string | null;
  statGain: { primary: number; secondary: number };
  xp: number;
  isLowestStat: boolean;
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
          <View
            style={{
              width: 40,
              height: 4,
              borderRadius: 2,
              backgroundColor: colors.border,
              alignSelf: 'center',
              marginBottom: 16,
            }}
          />

          <Text className="font-display text-xl text-text mb-1">{title}</Text>
          <Text className="mb-4" style={{ fontSize: 13, textTransform: 'capitalize' }}>
            <Text style={{ color: colors.textMuted }}>{difficulty} · feeds </Text>
            <Text style={{ color: statColor, fontWeight: '600' }}>{primaryStat}</Text>
            {secondaryStat && (
              <>
                <Text style={{ color: colors.textMuted }}> + </Text>
                <Text style={{ color: colors.wisdom, fontWeight: '600' }}>{secondaryStat}</Text>
              </>
            )}
          </Text>

          {isLowestStat && (
            <View
              style={{
                backgroundColor: `${statColor}14`,
                borderWidth: 1,
                borderColor: `${statColor}33`,
                borderRadius: 14,
                padding: 12,
                marginBottom: 14,
              }}
            >
              <Text style={{ color: colors.text, fontSize: 13.5, lineHeight: 19 }}>
                Your baseline <Text style={{ color: statColor, fontWeight: '700' }}>{primaryStat}</Text> is your lowest stat. Small, consistent effort here closes that gap fastest.
              </Text>
            </View>
          )}

          <Text className="text-textMuted mb-4">{description}</Text>
          {target && (
            <Text className="text-textMuted mb-4">Target: {target}</Text>
          )}

          <TextInput
            value={loggedValue}
            onChangeText={onChangeLoggedValue}
            placeholder={PLACEHOLDER_BY_TYPE[questType] ?? 'Notes (optional)'}
            placeholderTextColor="#7C8AA6"
            className="bg-background rounded-2xl border border-border p-4 text-text mb-4"
          />

          <Text className="text-textMuted mb-6" style={{ fontSize: 12 }}>
            Stat gain preview: +{statGain.primary} {primaryStat}
            {secondaryStat ? `, +${statGain.secondary} ${secondaryStat}` : ''}
          </Text>

          <PrimaryButton
            label={`Mark complete · +${xp} XP`}
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
