import { Modal, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { MotivationCardPullResponse } from '../types/motivation';
import { MotivationCardRarity } from '../types/motivation';
import PrimaryButton from './PrimaryButton';
import { colors } from '../theme/colors';

const RARITY_LABEL: Record<MotivationCardRarity, string> = {
  [MotivationCardRarity.COMMON]: 'Common',
  [MotivationCardRarity.RARE]: 'Rare',
  [MotivationCardRarity.MASTER_RARE]: 'Master-Rare',
  [MotivationCardRarity.X_RARE]: 'X-Rare',
};

const RARITY_COLOR: Record<MotivationCardRarity, string> = {
  [MotivationCardRarity.COMMON]: colors.textMuted,
  [MotivationCardRarity.RARE]: colors.focus,
  [MotivationCardRarity.MASTER_RARE]: colors.wisdom,
  [MotivationCardRarity.X_RARE]: colors.confidence,
};

export default function MotivationCardOverlay({
  pull,
  onDismiss,
  loading,
}: {
  pull: MotivationCardPullResponse;
  onDismiss: () => void;
  loading: boolean;
}) {
  const rarityColor = RARITY_COLOR[pull.rarity];

  return (
    <Modal visible transparent animationType="fade">
      <View className="flex-1 bg-background">
        <LinearGradient
          colors={[`${rarityColor}44`, colors.background]}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '55%' }}
        />
        <View className="flex-1 px-6 pt-24 items-center justify-center">
          <View
            style={{
              width: 60, height: 60, borderRadius: 30,
              backgroundColor: `${rarityColor}22`, borderWidth: 1.5, borderColor: `${rarityColor}66`,
              alignItems: 'center', justifyContent: 'center', marginBottom: 20,
            }}
          >
            <Ionicons name="sparkles-outline" size={26} color={rarityColor} />
          </View>

          <Text className="text-textMuted" style={{ fontSize: 12.5, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' }}>
            Today's Motivation Card
          </Text>

          <View
            className="w-full"
            style={{
              backgroundColor: colors.surface, borderRadius: 20, padding: 24, marginTop: 20,
              borderWidth: 1.5, borderColor: `${rarityColor}44`,
              shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.4, shadowRadius: 22, elevation: 8,
            }}
          >
            <Text
              className="text-center"
              style={{ color: colors.text, fontSize: 17, lineHeight: 25, fontStyle: 'italic', marginBottom: 18 }}
            >
              "{pull.quoteText}"
            </Text>
            <View className="flex-row items-center justify-center" style={{ gap: 8 }}>
              <Text style={{ color: rarityColor, fontSize: 12, fontWeight: '700', letterSpacing: 0.5 }}>
                {RARITY_LABEL[pull.rarity]}
              </Text>
              <Text style={{ color: colors.textMuted, fontSize: 12 }}>·</Text>
              <Text style={{ color: colors.textMuted, fontSize: 12, fontVariant: ['tabular-nums'] }}>
                {pull.serial}
              </Text>
            </View>
          </View>
        </View>

        <View className="px-6" style={{ paddingBottom: 40 }}>
          <PrimaryButton label="Dismiss" onPress={onDismiss} loading={loading} />
        </View>
      </View>
    </Modal>
  );
}
