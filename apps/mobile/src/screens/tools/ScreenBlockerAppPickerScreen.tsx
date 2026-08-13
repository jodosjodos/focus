import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ToolsStackParamList } from '../../navigation/ToolsStack';
import { ExpoScreenShieldPickerView, isDevStubActive } from 'expo-screen-shield';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<ToolsStackParamList, 'ScreenBlockerAppPicker'>;

export default function ScreenBlockerAppPickerScreen({ navigation }: Props) {
  const [token, setToken] = useState<string | null>(null);
  const [appCount, setAppCount] = useState(0);

  const handleDone = () => {
    if (token) {
      navigation.navigate('ScreenBlocker', { selectionToken: token });
    } else {
      navigation.goBack();
    }
  };

  return (
    <View className="flex-1 bg-background">
      <View
        className="flex-row justify-between items-center"
        style={{ paddingTop: 64, paddingHorizontal: 20, paddingBottom: 12 }}
      >
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <Text className="text-textMuted" style={{ fontSize: 13 }}>Cancel</Text>
        </Pressable>
        <View style={{ alignItems: 'center' }}>
          <Text className="font-semibold text-text" style={{ fontSize: 14.5 }}>Select Apps</Text>
          {appCount > 0 && (
            <Text className="text-textMuted" style={{ fontSize: 10.5, marginTop: 1 }}>
              {appCount} selected
            </Text>
          )}
        </View>
        <Pressable onPress={handleDone} hitSlop={8}>
          <Text style={{ color: colors.primary, fontSize: 13, fontWeight: '700' }}>Done</Text>
        </Pressable>
      </View>

      {isDevStubActive ? (
        <View className="flex-1 items-center justify-center" style={{ paddingHorizontal: 32 }}>
          <Text className="text-textMuted" style={{ fontSize: 13, textAlign: 'center', lineHeight: 19 }}>
            Dev preview — the real iOS app picker isn't linked in this build. On a real device with
            Screen Time access, Apple's own picker renders here.
          </Text>
        </View>
      ) : (
        <ExpoScreenShieldPickerView
          style={{ flex: 1 }}
          onSelectionChange={(e) => {
            setToken(e.nativeEvent.token);
            setAppCount(e.nativeEvent.applicationCount);
          }}
        />
      )}
    </View>
  );
}
