import { useState } from 'react';
import { ActivityIndicator, Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ToolsStackParamList } from '../../navigation/ToolsStack';
import { useSession } from '../../state/SessionContext';
import { useCompleteVideoLink, useVideoQuests } from '../../api/videoQuests';
import { STAT_COLOR } from '../../components/QuestCard';
import GlassCard from '../../components/GlassCard';
import QuestCompleteBurst from '../../components/QuestCompleteBurst';
import { colors } from '../../theme/colors';
import { CARD_SHADOW } from '../../theme/shadows';

type Props = NativeStackScreenProps<ToolsStackParamList, 'VideoQuests'>;

export default function VideoQuestsScreen({ navigation }: Props) {
  const { programId } = useSession();
  const videos = useVideoQuests(programId);
  const complete = useCompleteVideoLink(programId);
  const [burstXp, setBurstXp] = useState<number | null>(null);

  if (videos.isPending) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (videos.isError) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-6">
        <Text className="text-strength text-center">Couldn't load video quests.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <LinearGradient
        colors={[`${colors.primary}33`, colors.background]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '60%' }}
      />
      <ScrollView contentContainerClassName="px-6 pt-16 pb-6">
        <Pressable onPress={() => navigation.goBack()} style={{ marginBottom: 14 }} hitSlop={8}>
          <Text className="text-textMuted" style={{ fontSize: 13 }}>‹ Tools</Text>
        </Pressable>
        <Text className="font-display text-text" style={{ fontSize: 20, marginBottom: 16 }}>
          Video Quests
        </Text>

        {(videos.data ?? []).map((video) => {
          const statColor = STAT_COLOR[video.category] ?? colors.primary;
          const done = video.completed;
          return (
            <GlassCard
              key={video.id}
              style={[CARD_SHADOW, { flexDirection: 'row', gap: 12, alignItems: 'center', marginBottom: 8 }]}
            >
              <Pressable
                onPress={() => Linking.openURL(video.url)}
                className="flex-row"
                style={{ flex: 1, gap: 12, alignItems: 'center' }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    backgroundColor: `${statColor}22`,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name="play" size={16} color={statColor} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    className="font-semibold"
                    style={{ color: colors.text, fontSize: 13.5 }}
                    numberOfLines={1}
                  >
                    {video.title}
                  </Text>
                  <Text className="text-textMuted" style={{ fontSize: 11, marginTop: 3 }}>
                    {video.category}
                    {video.estimatedMinutes ? ` · ${video.estimatedMinutes} min` : ''}
                    {video.assigned ? ' · TODAY\'S QUEST' : ''}
                  </Text>
                </View>
              </Pressable>
              <Pressable
                onPress={() =>
                  complete.mutate(video.id, {
                    onSuccess: (result) => {
                      if (result.xpAwarded > 0) setBurstXp(result.xpAwarded);
                    },
                  })
                }
                disabled={done}
                hitSlop={8}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: '700',
                    color: done ? colors.success : colors.primary,
                  }}
                >
                  {done ? '✓ Done' : 'Mark done'}
                </Text>
              </Pressable>
            </GlassCard>
          );
        })}
      </ScrollView>
      {burstXp !== null && <QuestCompleteBurst xp={burstXp} onDone={() => setBurstXp(null)} />}
    </View>
  );
}
