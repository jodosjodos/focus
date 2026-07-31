import { Text, View } from 'react-native';
import { colors } from '../theme/colors';

const STAT_COLOR: Record<string, string> = {
  discipline: colors.discipline,
  focus: colors.focus,
  strength: colors.strength,
  confidence: colors.confidence,
  wisdom: colors.wisdom,
};

export default function StatBar({
  label,
  value,
  potential,
  max = 100,
}: {
  label: string;
  value: number;
  potential?: number;
  max?: number;
}) {
  const barColor = STAT_COLOR[label.toLowerCase()] ?? colors.primary;
  const pct = Math.min(100, (value / max) * 100);
  const potentialPct = potential ? Math.min(100, (potential / max) * 100) : null;

  return (
    <View className="flex-row items-center mb-4" style={{ gap: 12 }}>
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 11,
          backgroundColor: `${barColor}22`,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            width: 11,
            height: 11,
            borderRadius: 6,
            backgroundColor: barColor,
          }}
        />
      </View>
      <View className="flex-1">
        <View className="flex-row justify-between mb-1.5">
          <Text className="text-text font-semibold capitalize">{label}</Text>
          <Text className="font-display" style={{ color: barColor, fontSize: 14 }}>
            {value}
            {potential ? ` → ${potential}` : ''}
          </Text>
        </View>
        <View
          style={{
            height: 10,
            borderRadius: 6,
            backgroundColor: 'rgba(255,255,255,0.10)',
            overflow: 'hidden',
          }}
        >
          {potentialPct !== null && (
            <View
              style={{
                position: 'absolute',
                inset: 0,
                width: `${potentialPct}%`,
                backgroundColor: barColor,
                opacity: 0.22,
              }}
            />
          )}
          <View
            style={{
              position: 'absolute',
              inset: 0,
              width: `${pct}%`,
              backgroundColor: barColor,
              borderRadius: 6,
            }}
          />
        </View>
      </View>
    </View>
  );
}
