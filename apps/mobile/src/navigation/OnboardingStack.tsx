import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OnboardingProvider } from '../state/OnboardingContext';
import SplashScreen from '../screens/onboarding/SplashScreen';
import IntroScreen from '../screens/onboarding/IntroScreen';
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import LoginScreen from '../screens/onboarding/LoginScreen';
import AgeScreen from '../screens/onboarding/AgeScreen';
import DistractionScreen from '../screens/onboarding/DistractionScreen';
import LockTeaserScreen from '../screens/onboarding/LockTeaserScreen';
import QuoteStackScreen from '../screens/onboarding/QuoteStackScreen';
import QuizScreen from '../screens/onboarding/QuizScreen';
import BaselineResultScreen from '../screens/onboarding/BaselineResultScreen';
import ProgramPreviewScreen from '../screens/onboarding/ProgramPreviewScreen';
import AccountScreen from '../screens/onboarding/AccountScreen';

export type OnboardingStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Login: undefined;
  Intro: undefined;
  Age: undefined;
  Distraction: undefined;
  LockTeaser: undefined;
  QuoteStack: undefined;
  Quiz: undefined;
  BaselineResult: undefined;
  ProgramPreview: undefined;
  Account: undefined;
};

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export default function OnboardingStack() {
  return (
    <OnboardingProvider>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade_from_bottom',
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Intro" component={IntroScreen} />
        <Stack.Screen name="Age" component={AgeScreen} />
        <Stack.Screen name="Distraction" component={DistractionScreen} />
        <Stack.Screen name="LockTeaser" component={LockTeaserScreen} />
        <Stack.Screen name="QuoteStack" component={QuoteStackScreen} />
        <Stack.Screen name="Quiz" component={QuizScreen} />
        <Stack.Screen name="BaselineResult" component={BaselineResultScreen} />
        <Stack.Screen name="ProgramPreview" component={ProgramPreviewScreen} />
        <Stack.Screen name="Account" component={AccountScreen} />
      </Stack.Navigator>
    </OnboardingProvider>
  );
}
