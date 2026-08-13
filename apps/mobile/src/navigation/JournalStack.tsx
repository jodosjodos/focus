import { createNativeStackNavigator } from '@react-navigation/native-stack';
import JournalScreen from '../screens/journal/JournalScreen';
import JournalEntryScreen from '../screens/journal/JournalEntryScreen';

export type JournalStackParamList = {
  Journal: undefined;
  JournalEntry: { entryId?: string } | undefined;
};

const Stack = createNativeStackNavigator<JournalStackParamList>();

export default function JournalStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Journal" component={JournalScreen} />
      <Stack.Screen name="JournalEntry" component={JournalEntryScreen} />
    </Stack.Navigator>
  );
}
