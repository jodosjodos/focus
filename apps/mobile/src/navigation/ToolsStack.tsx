import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ToolsScreen from '../screens/tools/ToolsScreen';
import ReadingLibraryScreen from '../screens/tools/ReadingLibraryScreen';
import ReadingLessonScreen from '../screens/tools/ReadingLessonScreen';
import VideoQuestsScreen from '../screens/tools/VideoQuestsScreen';
import MeditationScreen from '../screens/tools/MeditationScreen';
import PomodoroScreen from '../screens/tools/PomodoroScreen';
import WorkoutLoggerScreen from '../screens/tools/WorkoutLoggerScreen';
import WorkoutExercisePickerScreen from '../screens/tools/WorkoutExercisePickerScreen';
import ScreenBlockerScreen from '../screens/tools/ScreenBlockerScreen';
import ScreenBlockerPermissionScreen from '../screens/tools/ScreenBlockerPermissionScreen';
import ScreenBlockerAppPickerScreen from '../screens/tools/ScreenBlockerAppPickerScreen';

export type ToolsStackParamList = {
  Tools: undefined;
  ReadingLibrary: undefined;
  ReadingLesson: { entryId: string };
  VideoQuests: undefined;
  Meditation: undefined;
  Pomodoro: undefined;
  WorkoutLogger: { pickedExercise?: { name: string; imageUrl: string | null } } | undefined;
  WorkoutExercisePicker: { addedNames: string[] } | undefined;
  ScreenBlocker: { selectionToken?: string } | undefined;
  ScreenBlockerPermission: undefined;
  ScreenBlockerAppPicker: undefined;
};

const Stack = createNativeStackNavigator<ToolsStackParamList>();

export default function ToolsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tools" component={ToolsScreen} />
      <Stack.Screen name="ReadingLibrary" component={ReadingLibraryScreen} />
      <Stack.Screen name="ReadingLesson" component={ReadingLessonScreen} />
      <Stack.Screen name="VideoQuests" component={VideoQuestsScreen} />
      <Stack.Screen name="Meditation" component={MeditationScreen} />
      <Stack.Screen name="Pomodoro" component={PomodoroScreen} />
      <Stack.Screen name="WorkoutLogger" component={WorkoutLoggerScreen} />
      <Stack.Screen name="WorkoutExercisePicker" component={WorkoutExercisePickerScreen} />
      <Stack.Screen name="ScreenBlocker" component={ScreenBlockerScreen} />
      <Stack.Screen name="ScreenBlockerPermission" component={ScreenBlockerPermissionScreen} />
      <Stack.Screen name="ScreenBlockerAppPicker" component={ScreenBlockerAppPickerScreen} />
    </Stack.Navigator>
  );
}
