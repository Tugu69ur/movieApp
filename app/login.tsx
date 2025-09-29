import { useAuth } from "@/contexts/AuthContext";
import { Video } from "expo-av";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View
} from "react-native";
export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        router.replace("/");
      } else {
        Alert.alert("Error", "Invalid credentials");
      }
    } catch {
      Alert.alert("Error", "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fffdf2" }} // ✅ plain background
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center mt-24">
          <Text className="text-black text-5xl font-bold">Welcome to</Text>
          <Video
            source={require("@/assets/video/eguu.mp4")}
            style={{ width: 130, height: 250, marginTop: 20 }}
            resizeMode="contain"
            shouldPlay
            isMuted
            useNativeControls={false}
          />
        </View>

        {/* Login Form
        <View className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 mb-6">
          <View className="mb-4">
            <Text className="text-black text-base font-semibold mb-2">
              Email Address
            </Text>
            <TextInput
              className="bg-white/10 border border-black/20 rounded-xl px-4 py-4 text-black text-base"
              placeholder="Enter your email"
              placeholderTextColor="#555"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View className="mb-6">
            <Text className="text-black text-base font-semibold mb-2">
              Password
            </Text>
            <TextInput
              className="bg-white/10 border border-black/20 rounded-xl px-4 py-4 text-black text-base"
              placeholder="Enter your password"
              placeholderTextColor="#555"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <TouchableOpacity
            className={`bg-blue-600 rounded-xl py-4 items-center ${
              isLoading ? "opacity-50" : ""
            }`}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text className="text-white text-lg font-semibold">
              {isLoading ? "Signing In..." : "Sign In"}
            </Text>
          </TouchableOpacity>
        </View> */}

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
