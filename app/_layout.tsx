import { AuthProvider } from "@/contexts/AuthContext";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "./global.css";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    IMFellSC: require("../assets/fonts/IMFellFrenchCanonSC-Regular.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      Text.defaultProps = Text.defaultProps || {};
      const current = Array.isArray(Text.defaultProps.style)
        ? Text.defaultProps.style
        : [Text.defaultProps.style].filter(Boolean);

      // ✅ apply globally (optional)
      Text.defaultProps.style = [{ fontFamily: "IMFellSC" }, ...current];
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#0f0d23",
        }}
      >
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="movies/[id]" options={{ headerShown: false }} />
        </Stack>
      </GestureHandlerRootView>
    </AuthProvider>
  );
}
