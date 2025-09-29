import { useRouter } from "expo-router";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const styles = {
    customFont: { fontFamily: 'IMFellFrenchCanonSC' } // Example custom font style
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#ffffff" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center">
          {/* ✅ Now uses Playfair globally */}
          <Text className="text-black text-4xl" style={styles.customFont}>Welcome to</Text>
          <Text className="text-black text-5xl" style={styles.customFont}>Egüü</Text>
        </View>

        {/* <View className="items-center mt-6">
          <Video
            source={require("@/assets/video/circle.mp4")} // path to your video
            style={{ width: 200, height: 200 }}
            resizeMode="contain"
            shouldPlay
            isLooping
            useNativeControls={false}
            isMuted={true} // optional
          />
        </View> */}
        <TouchableOpacity
          onPress={() => router.replace("/(tabs)")}
          className="bg-slate-300 py-4 rounded-2xl mt-10"
        >
          <Text className="text-center text-black text-xl" style={styles.customFont}>
            Start
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
