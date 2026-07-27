import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { useHealth } from '../../api/useHealth';

export default function HomeScreen() {
  const { data, isPending, isError, error } = useHealth();

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="flex-1 items-center justify-center p-6"
    >
      <Text className="text-3xl font-bold text-text mb-2">Focus</Text>
      <Text className="text-base text-text/70 mb-8">Phase 0 proof of life</Text>

      {isPending && <ActivityIndicator color="#F97316" />}

      {isError && (
        <View className="bg-surface rounded-2xl p-4 shadow">
          <Text className="text-strength font-semibold">
            Couldn't reach the backend
          </Text>
          <Text className="text-text/70 mt-1">{(error as Error).message}</Text>
        </View>
      )}

      {data && (
        <View className="bg-surface rounded-2xl p-4 shadow w-full">
          <Text className="text-success font-semibold mb-1">
            Backend + Postgres connected
          </Text>
          <Text className="text-text/70">status: {data.status}</Text>
          <Text className="text-text/70">db: {data.db}</Text>
          <Text className="text-text/70">dbTime: {data.dbTime}</Text>
        </View>
      )}
    </ScrollView>
  );
}
