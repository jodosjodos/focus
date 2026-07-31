import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useSession } from '../state/SessionContext';
import OnboardingStack from './OnboardingStack';
import MainTabs from './MainTabs';

export default function RootNavigator() {
  const { status } = useSession();

  return (
    <NavigationContainer>
      {status === 'loading' && (
        <View className="flex-1 bg-background items-center justify-center">
          <ActivityIndicator color="#3B82F6" />
        </View>
      )}
      {status === 'onboarding' && <OnboardingStack />}
      {status === 'main' && <MainTabs />}
    </NavigationContainer>
  );
}
