import { Text, View } from 'react-native';

export default function PlaceholderScreen({ title }: { title: string }) {
  return (
    <View className="flex-1 items-center justify-center bg-background p-6">
      <Text className="text-2xl font-bold text-text mb-2">{title}</Text>
      <Text className="text-text/60 text-center">
        Coming in a later phase — see docs/FOCUS-development-plan.md
      </Text>
    </View>
  );
}
