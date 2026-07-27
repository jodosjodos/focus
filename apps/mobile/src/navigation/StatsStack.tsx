import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StatsScreen from '../screens/stats/StatsScreen';

const Stack = createNativeStackNavigator();

export default function StatsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Stats" component={StatsScreen} />
    </Stack.Navigator>
  );
}
