import { Pressable, ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ToolsStackParamList } from '../../navigation/ToolsStack';
import { useSession } from '../../state/SessionContext';
import { useReadingLibrary } from '../../api/reading';
import { useVideoQuests } from '../../api/videoQuests';
import GlassCard from '../../components/GlassCard';
import { colors } from '../../theme/colors';
import { CARD_SHADOW } from '../../theme/shadows';

type Props = NativeStackScreenProps<ToolsStackParamList, 'Tools'>;

interface Tile {
  key: string;
  label: string;
  tag: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress?: () => void;
  disabled?: boolean;
}

function ToolTile({ tile }: { tile: Tile }) {
  return (
    <Pressable onPress={tile.onPress} disabled={tile.disabled} style={{ width: '48%' }}>
      <GlassCard
        style={[
          CARD_SHADOW,
          { aspectRatio: 1.1, justifyContent: 'space-between' },
          tile.disabled ? { opacity: 0.45 } : undefined,
        ]}
      >
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            backgroundColor: tile.color,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name={tile.icon} size={18} color="#fff" />
        </View>
        <View>
          <Text className="font-semibold" style={{ color: colors.text, fontSize: 13.5 }}>
            {tile.label}
          </Text>
          <Text className="text-textMuted" style={{ fontSize: 11, marginTop: 2 }}>
            {tile.tag}
          </Text>
        </View>
      </GlassCard>
    </Pressable>
  );
}

export default function ToolsScreen({ navigation }: Props) {
  const { programId } = useSession();
  const reading = useReadingLibrary(programId);
  const videos = useVideoQuests(programId);

  const tiles: Tile[] = [
    {
      key: 'reading',
      label: 'Reading',
      tag: reading.data ? `${reading.data.length} entries` : '···',
      icon: 'book',
      color: colors.wisdom,
      onPress: () => navigation.navigate('ReadingLibrary'),
    },
    {
      key: 'video',
      label: 'Video Quests',
      tag: videos.data ? `${videos.data.length} curated` : '···',
      icon: 'play',
      color: colors.focus,
      onPress: () => navigation.navigate('VideoQuests'),
    },
    {
      key: 'meditation',
      label: 'Meditation',
      tag: 'Guided',
      icon: 'sparkles',
      color: colors.wisdom,
      onPress: () => navigation.navigate('Meditation'),
    },
    {
      key: 'pomodoro',
      label: 'Pomodoro',
      tag: 'Focus timer',
      icon: 'timer',
      color: colors.focus,
      onPress: () => navigation.navigate('Pomodoro'),
    },
    {
      key: 'workout',
      label: 'Workout',
      tag: 'Sets & reps',
      icon: 'barbell',
      color: colors.strength,
      onPress: () => navigation.navigate('WorkoutLogger'),
    },
    {
      key: 'blocker',
      label: 'Screen Blocker',
      tag: 'Reminder or real block',
      icon: 'shield',
      color: colors.discipline,
      onPress: () => navigation.navigate('ScreenBlocker'),
    },
  ];

  return (
    <View className="flex-1 bg-background">
      <LinearGradient
        colors={[`${colors.primary}33`, colors.background]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '60%' }}
      />
      <ScrollView contentContainerClassName="px-6 pt-16 pb-6">
        <Text className="font-display text-text" style={{ fontSize: 22, marginBottom: 16 }}>
          Tools
        </Text>
        <View className="flex-row flex-wrap justify-between" style={{ gap: 12 }}>
          {tiles.map((tile) => (
            <ToolTile key={tile.key} tile={tile} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
