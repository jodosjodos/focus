import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PasswordField({
  label,
  value,
  onChangeText,
  placeholder,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <View className="mb-4">
      <Text className="text-sm text-textMuted mb-1.5">{label}</Text>
      <View className="flex-row items-center bg-surface rounded-2xl border border-border px-4">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#7C8AA6"
          secureTextEntry={!visible}
          autoCapitalize="none"
          autoCorrect={false}
          className="flex-1 py-4 text-text"
        />
        <Pressable onPress={() => setVisible((v) => !v)} hitSlop={8}>
          <Ionicons
            name={visible ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color="#7C8AA6"
          />
        </Pressable>
      </View>
    </View>
  );
}
