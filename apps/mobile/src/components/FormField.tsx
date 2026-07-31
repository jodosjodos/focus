import { Text, TextInput, View, type TextInputProps } from 'react-native';

export default function FormField({
  label,
  ...inputProps
}: { label: string } & TextInputProps) {
  return (
    <View className="mb-4">
      <Text className="text-sm text-textMuted mb-1.5">{label}</Text>
      <TextInput
        placeholderTextColor="#7C8AA6"
        className="bg-surface rounded-2xl border border-border px-4 py-4 text-text"
        {...inputProps}
      />
    </View>
  );
}
