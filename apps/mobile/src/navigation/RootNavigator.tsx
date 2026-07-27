import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStack from './HomeStack';
import StatsStack from './StatsStack';
import JournalStack from './JournalStack';
import ToolsStack from './ToolsStack';
import ProfileStack from './ProfileStack';

const Tab = createBottomTabNavigator();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#F97316',
          tabBarInactiveTintColor: '#292524',
        }}
      >
        <Tab.Screen name="HomeTab" component={HomeStack} options={{ title: 'Home' }} />
        <Tab.Screen name="StatsTab" component={StatsStack} options={{ title: 'Stats' }} />
        <Tab.Screen name="JournalTab" component={JournalStack} options={{ title: 'Journal' }} />
        <Tab.Screen name="ToolsTab" component={ToolsStack} options={{ title: 'Tools' }} />
        <Tab.Screen name="ProfileTab" component={ProfileStack} options={{ title: 'Profile' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
