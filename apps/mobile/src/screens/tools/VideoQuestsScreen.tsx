import { useState } from 'react';
import { ActivityIndicator, Image, Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ToolsStackParamList } from '../../navigation/ToolsStack';
import { useSession } from '../../state/SessionContext';
import { useCompleteVideoLink, useVideoQuests } from '../../api/videoQuests';
import { STAT_COLOR } from '../../components/QuestCard';
import BackButton from '../../components/BackButton';
import GlassCard from '../../components/GlassCard';
import QuestCompleteBurst from '../../components/QuestCompleteBurst';
import { colors } from '../../theme/colors';
import { CARD_SHADOW } from '../../theme/shadows';

type Props = NativeStackScreenProps<ToolsStackParamList, 'VideoQuests'>;

function youtubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/);
  return match ? match[1] : null;
}

export default function VideoQuestsScreen({ navigation }: Props) {
  const { programId } = useSession();
  const videos = useVideoQuests(programId);
  const complete = useCompleteVideoLink(programId);
  const [burstXp, setBurstXp] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
        <BackButton label="Tools" onPress={() => navigation.goBack()} style={{ marginBottom: 14 }} />
        <Text className="font-display text-text" style={{ fontSize: 20, marginBottom: 4 }}>
          Video Quests
        </Text>
        <Text className="text-textMuted" style={{ fontSize: 12.5, marginBottom: 16 }}>
          {(videos.data ?? []).length} curated · tap to watch
        </Text>

        {(videos.data ?? []).map((video) => {
          const statColor = STAT_COLOR[video.category] ?? colors.primary;
          const done = video.completed;
          const vid = youtubeId(video.url);
          const isExpanded = expandedId === video.id;

          return (
            <GlassCard
              key={video.id}
              style={[CARD_SHADOW, { marginBottom: 12 }]}
              contentStyle={{ padding: 0 }}
            >
              <View style={{ width: '100%', height: 195, backgroundColor: '#000' }}>
                {isExpanded && vid ? (
                  <>
                    <WebView
                      source={{ uri: `https://www.youtube.com/embed/${vid}?playsinline=1&autoplay=1&rel=0` }}
                      style={{ flex: 1, backgroundColor: '#000' }}
                      allowsInlineMediaPlayback
                      mediaPlaybackRequiresUserAction={false}
                    />
                    <Pressable
                      onPress={() => setExpandedId(null)}
                      hitSlop={8}
                      style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        width: 28,
                        height: 28,
                        borderRadius: 14,
                        backgroundColor: 'rgba(3,6,13,0.65)',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Ionicons name="close" size={16} color="#FFFFFF" />
                    </Pressable>
                    {/* Some video owners disable embedding on YouTube — that's their
                     * setting, not something an embed can override. This escape hatch
                     * means a video with embedding disabled never leaves someone stuck
                     * looking at YouTube's in-player error with no way out. */}
                    <Pressable
                      onPress={() => Linking.openURL(video.url)}
                      hitSlop={6}
                      style={{
                        position: 'absolute',
                        bottom: 8,
                        left: 8,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 5,
                        backgroundColor: 'rgba(3,6,13,0.65)',
                        borderRadius: 8,
                        paddingHorizontal: 8,
                        paddingVertical: 5,
                      }}
                    >
                      <Ionicons name="open-outline" size={12} color="#FFFFFF" />
                      <Text style={{ color: '#FFFFFF', fontSize: 10.5, fontWeight: '600' }}>
                        Trouble playing? Open in YouTube
                      </Text>
                    </Pressable>
                  </>
                ) : (
                  <Pressable onPress={() => setExpandedId(video.id)} style={{ flex: 1 }}>
                    {vid ? (
                      <Image
                        source={{ uri: `https://img.youtube.com/vi/${vid}/hqdefault.jpg` }}
                        resizeMode="cover"
                        style={{ width: '100%', height: '100%' }}
                      />
                    ) : (
                      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: `${statColor}18` }}>
                        <Ionicons name="videocam" size={28} color={statColor} />
                      </View>
                    )}
                    <View
                      pointerEvents="none"
                      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(3,6,13,0.18)' }}
                    />
                    <View
                      pointerEvents="none"
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        marginTop: -26,
                        marginLeft: -26,
                        width: 52,
                        height: 52,
                        borderRadius: 26,
                        backgroundColor: 'rgba(3,6,13,0.55)',
                        borderWidth: 1.5,
                        borderColor: 'rgba(255,255,255,0.3)',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Ionicons name="play" size={21} color="#FFFFFF" style={{ marginLeft: 2 }} />
                    </View>
                    {video.assigned && (
                      <View
                        pointerEvents="none"
                        style={{
                          position: 'absolute',
                          top: 10,
                          left: 10,
                          backgroundColor: colors.primary,
                          borderRadius: 6,
                          paddingHorizontal: 7,
                          paddingVertical: 3,
                        }}
                      >
                        <Text style={{ color: '#fff', fontSize: 9.5, fontWeight: '800', letterSpacing: 0.3 }}>
                          TODAY'S QUEST
                        </Text>
                      </View>
                    )}
                  </Pressable>
                )}
              </View>

              <View className="flex-row items-center" style={{ padding: 14, gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text className="font-semibold" style={{ color: colors.text, fontSize: 13.5 }} numberOfLines={2}>
                    {video.title}
                  </Text>
                  <View className="flex-row items-center" style={{ gap: 6, marginTop: 5 }}>
                    <View
                      style={{
                        backgroundColor: `${statColor}22`,
                        borderRadius: 5,
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                      }}
                    >
                      <Text style={{ color: statColor, fontSize: 10, fontWeight: '700' }}>{video.category}</Text>
                    </View>
                    {video.estimatedMinutes ? (
                      <Text className="text-textMuted" style={{ fontSize: 11 }}>{video.estimatedMinutes} min</Text>
                    ) : null}
                  </View>
                </View>
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
                  style={{
                    paddingVertical: 7,
                    paddingHorizontal: 12,
                    borderRadius: 10,
                    backgroundColor: done ? `${colors.success}1a` : `${colors.primary}22`,
                  }}
                >
                  <Text style={{ fontSize: 11, fontWeight: '700', color: done ? colors.success : colors.primary }}>
                    {done ? '✓ Done' : 'Mark done'}
                  </Text>
                </Pressable>
              </View>
            </GlassCard>
          );
        })}
      </ScrollView>
      {burstXp !== null && <QuestCompleteBurst xp={burstXp} onDone={() => setBurstXp(null)} />}
    </View>
  );
}
