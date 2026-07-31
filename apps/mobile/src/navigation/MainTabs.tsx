import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeStack from './HomeStack';
import StatsStack from './StatsStack';
import JournalStack from './JournalStack';
import ToolsStack from './ToolsStack';
import ProfileStack from './ProfileStack';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();

const ICON_BY_ROUTE: Record<string, keyof typeof Ionicons.glyphMap> = {
  HomeTab: 'home',
  StatsTab: 'bar-chart',
  JournalTab: 'book',
  ToolsTab: 'construct',
  ProfileTab: 'person',
};

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarIcon: ({ color, size, focused }) => {
          const base = ICON_BY_ROUTE[route.name] ?? 'ellipse';
          const name = focused ? base : (`${base}-outline` as keyof typeof Ionicons.glyphMap);
          return <Ionicons name={name} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStack} options={{ title: 'Home' }} />
      <Tab.Screen name="StatsTab" component={StatsStack} options={{ title: 'Stats' }} />
      <Tab.Screen name="JournalTab" component={JournalStack} options={{ title: 'Journal' }} />
      <Tab.Screen name="ToolsTab" component={ToolsStack} options={{ title: 'Tools' }} />
      <Tab.Screen name="ProfileTab" component={ProfileStack} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}
