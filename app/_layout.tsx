import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/Theme";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from "expo-font";
import * as LocalAuthentication from 'expo-local-authentication';
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { Lock } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../i18n";
import "./global.css";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const MainLayout = () => {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/Montserrat-VariableFont_wght.ttf"),
  });

  const [isBiometricLocked, setIsBiometricLocked] = useState(false);

  // Authenticate function
  const authenticate = useCallback(async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock to access MovieApp',
        fallbackLabel: 'Enter Passcode',
        disableDeviceFallback: false, // Force FaceID/TouchID only
        cancelLabel: 'Cancel',
      });
      if (result.success) {
        setIsBiometricLocked(false);
      } else {
        // If user cancels, they stay locked
        console.log("Authentication cancelled or failed");
      }
    } catch (e) {
      console.log("Auth error", e);
    }
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === 'login' || segments[0] === 'signup';

    if (!user && !inAuthGroup) {
      router.replace('/login');
    } else if (user && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [user, loading, segments]);

  // Check biometric preference on load
  useEffect(() => {
    const checkSettings = async () => {
      if (loading || !fontsLoaded) return;

      if (!user) {
        return;
      }

      const enabled = await AsyncStorage.getItem('biometric_enabled');
      if (enabled === 'true') {
        setIsBiometricLocked(true);
        // Prompt immediately
        await authenticate();
      }
    };

    checkSettings();
  }, [user, loading, fontsLoaded, authenticate]);

  if (!fontsLoaded || loading) {
    return (
      <View className="flex-1 justify-center items-center bg-neutral-900">
        <ActivityIndicator size="large" color="#eab308" />
      </View>
    );
  }

  if (isBiometricLocked) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-neutral-900">
        <Lock size={64} color="#6366f1" />
        <Text className="text-2xl font-bold mt-6 text-neutral-800 dark:text-white">App Locked</Text>
        <Text className="text-neutral-500 dark:text-neutral-400 mt-2 mb-8">
          Biometric authentication is required
        </Text>

        <TouchableOpacity
          onPress={authenticate}
          className="bg-indigo-500 px-8 py-4 rounded-2xl flex-row items-center"
        >
          <Text className="text-white font-bold text-lg">Unlock App</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="movies/[id]" />
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <MainLayout />
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
