import { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AnimatedPressable from './AnimatedPressable';
import { colors } from '../theme/colors';

export default function OptionButton({
  label,
  selected,
  onPress,
  disabled,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
}) {
  const pop = useRef(new Animated.Value(selected ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(pop, {
      toValue: selected ? 1 : 0,
      useNativeDriver: true,
      speed: 30,
      bounciness: 10,
    }).start();
  }, [selected, pop]);

  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={disabled}
      style={{
        borderRadius: 16,
        paddingVertical: 14,
        paddingHorizontal: 16,
        marginBottom: 10,
        borderWidth: 1.5,
        borderColor: selected ? colors.primary : colors.border,
        backgroundColor: selected ? `${colors.primary}22` : colors.surface,
        opacity: disabled && !selected ? 0.4 : 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Text
        style={{
          color: selected ? colors.text : colors.textMuted,
          fontWeight: '700',
          fontSize: 15,
        }}
      >
        {label}
      </Text>
      <Animated.View style={{ transform: [{ scale: pop }], opacity: pop }}>
        <View
          style={{
            width: 22,
            height: 22,
            borderRadius: 11,
            backgroundColor: colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="checkmark" size={14} color="#fff" />
        </View>
      </Animated.View>
    </AnimatedPressable>
  );
}
