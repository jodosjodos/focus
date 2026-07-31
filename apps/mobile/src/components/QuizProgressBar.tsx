import { View } from 'react-native';

export default function QuizProgressBar({
  step,
  totalSteps,
}: {
  step: number;
  totalSteps: number;
}) {
  return (
    <View className="flex-row gap-1 px-6 pt-2">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <View
          key={i}
          className={`flex-1 h-1.5 rounded-full ${
            i <= step ? 'bg-primary' : 'bg-white/10'
          }`}
        />
      ))}
    </View>
  );
}
