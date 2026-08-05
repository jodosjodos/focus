import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/profile/ProfileScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import AchievementsScreen from '../screens/profile/AchievementsScreen';
import AchievementDetailScreen from '../screens/profile/AchievementDetailScreen';
import type { AchievementGridItem } from '../types/achievement';

export type ProfileStackParamList = {
  Profile: undefined;
  Settings: undefined;
  EditProfile: undefined;
  Achievements: undefined;
  AchievementDetail: { item: AchievementGridItem };
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Achievements" component={AchievementsScreen} />
      <Stack.Screen name="AchievementDetail" component={AchievementDetailScreen} />
    </Stack.Navigator>
  );
}
