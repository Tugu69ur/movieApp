
import { Redirect } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, AppState, View } from "react-native";

export default function Index() {
  // const { user, loading } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Wait for the auth context to be ready
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);

    // Handle app state changes
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active') {
        setIsReady(true);
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      clearTimeout(timer);
      subscription?.remove();
    };
  }, []);

  // if (!isReady || loading) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f0d23' }}>
  //       <ActivityIndicator size="large" color="#ffffff" />
  //     </View>
  //   );
  // }

  // if (user) {
  //   return <Redirect href="/(tabs)" />;
  // }

  return <Redirect href="/(tabs)" />;
}
