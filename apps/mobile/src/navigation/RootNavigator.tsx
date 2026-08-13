import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useSession } from '../state/SessionContext';
import { useScreenBlockerReconciliation } from '../state/useScreenBlockerReconciliation';
import OnboardingStack from './OnboardingStack';
import RewardOverlayHost from './RewardOverlayHost';

export default function RootNavigator() {
  const { status } = useSession();
  useScreenBlockerReconciliation();

  return (
    <NavigationContainer>
      {status === 'loading' && (
        <View className="flex-1 bg-background items-center justify-center">
          <ActivityIndicator color="#3B82F6" />
        </View>
      )}
      {status === 'onboarding' && <OnboardingStack />}
      {status === 'main' && <RewardOverlayHost />}
    </NavigationContainer>
  );
}
