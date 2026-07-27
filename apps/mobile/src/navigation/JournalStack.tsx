import { createNativeStackNavigator } from '@react-navigation/native-stack';
import JournalScreen from '../screens/journal/JournalScreen';

const Stack = createNativeStackNavigator();

export default function JournalStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Journal" component={JournalScreen} />
    </Stack.Navigator>
  );
}
