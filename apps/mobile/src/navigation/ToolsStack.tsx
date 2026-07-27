import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ToolsScreen from '../screens/tools/ToolsScreen';

const Stack = createNativeStackNavigator();

export default function ToolsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Tools" component={ToolsScreen} />
    </Stack.Navigator>
  );
}
