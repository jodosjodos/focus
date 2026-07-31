import { ActivityIndicator, Text } from 'react-native';
import AnimatedPressable from './AnimatedPressable';
import { colors } from '../theme/colors';

export default function PrimaryButton({
  label,
  onPress,
  disabled,
  loading,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}) {
  const isDisabled = disabled || loading;
  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={isDisabled}
      style={{
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
        backgroundColor: isDisabled ? `${colors.primary}66` : colors.primary,
      }}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text className="text-white font-bold text-base">{label}</Text>
      )}
    </AnimatedPressable>
  );
}
