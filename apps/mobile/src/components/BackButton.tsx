import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AnimatedPressable from './AnimatedPressable';
import { colors } from '../theme/colors';

/** Shared back affordance — a real tappable circle (not just small text), used
 * across every Tools/Journal/Profile sub-screen instead of each one rolling
 * its own tiny `‹ Label` link. */
export default function BackButton({
  label,
  onPress,
  light,
  style,
}: {
  label?: string;
  onPress: () => void;
  /** Use on screens with a light/photo background where the default dark
   * glass circle would disappear. */
  light?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <AnimatedPressable
      onPress={onPress}
      scaleTo={0.94}
      hitSlop={12}
      style={[
        { flexDirection: 'row', alignItems: 'center', gap: 9, alignSelf: 'flex-start' },
        style,
      ]}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: light ? 'rgba(0,0,0,0.35)' : colors.surface,
          borderWidth: 1,
          borderColor: light ? 'rgba(255,255,255,0.25)' : colors.border,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name="chevron-back" size={19} color={light ? '#FFFFFF' : colors.text} />
      </View>
      {label && (
        <Text
          style={{
            color: light ? '#FFFFFF' : colors.textMuted,
            fontSize: 13.5,
            fontWeight: '600',
          }}
        >
          {label}
        </Text>
      )}
    </AnimatedPressable>
  );
}
