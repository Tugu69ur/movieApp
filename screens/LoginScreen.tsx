import * as Google from "expo-auth-session/providers/google";
import { Video } from "expo-av";
import { Link } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import React, { useEffect, useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../contexts/AuthContext";
import { auth } from "../FirebaseConfig";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
  clientId: "1011743891450-qcjh153r0tar0177oud6h7gkdhil5ulm.apps.googleusercontent.com",
});


  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(() => {
          console.log("Logged in with Google!");
        })
        .catch((error) => {
          console.error("Google Sign-In Error:", error);
          Alert.alert("Алдаа", "Google-ээр нэвтрэх үед алдаа гарлаа");
        });
    }
  }, [response]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Алдаа", "Бүх талбарыг бөглөнө үү");
      return;
    }
    setLoading(true);
    try {
      await signIn(email, password);
    } catch (error: any) {
      Alert.alert("Нэвтрэх алдаа", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingHorizontal: 24,
          }}
        >
          {/* Video with text overlay */}
          <View
            style={{
              width: "100%",
              height: 240,
              marginBottom: 24,
              marginTop: -92,
              transform: [{ rotate: "90deg" }],
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Video
              source={require("../assets/images/purple.mp4")}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 16,
              }}
              useNativeControls
              resizeMode="contain"
              isMuted
              isLooping
              shouldPlay
            />

            {/* Overlay Text */}
            <Text
              style={{
                position: "absolute",
                top: "33%",
                color: "white",
                fontSize: 36,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              ᠡᢉᠡᢉᠦᠦ
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-6 bg-neutral-900/40 p-6 rounded-2xl border border-neutral-700/40">
            <View>
              <Text className="text-neutral-400 mb-2 ml-1 text-sm">Имэйл</Text>
              <TextInput
                className="w-full bg-neutral-800/70 text-white px-4 py-3 rounded-xl border border-neutral-700 focus:border-accent"
                placeholder="жишээ@gmail.com"
                placeholderTextColor="#6b7280"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View>
              <Text className="text-neutral-400 mb-2 ml-1 text-sm">Нууц үг</Text>
              <TextInput
                className="w-full bg-neutral-800/70 text-white px-4 py-3 rounded-xl border border-neutral-700 focus:border-accent"
                placeholder="••••••••"
                placeholderTextColor="#6b7280"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity className="self-end">
              <Text className="text-accent font-semibold text-sm my-2">
                Нууц үгээ мартсан уу?
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="w-full bg-accent py-3 rounded-xl items-center shadow-sm"
              onPress={handleLogin}
              disabled={loading}
            >
              <Text className="text-black font-bold text-lg tracking-wide">
                {loading ? "Нэвтрэж байна..." : "Нэвтрэх"}
              </Text>
            </TouchableOpacity>

            {/* Google Sign-In Button */}
            <TouchableOpacity
              className="w-full bg-white py-3 rounded-xl items-center mt-4"
              onPress={() => {
                promptAsync();
              }}
            >
              <Text className="text-black font-bold text-lg tracking-wide">
                Google-ээр нэвтрэх
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View className="flex-row justify-center mt-8">
            <Text className="text-neutral-400">Бүртгэлгүй юу? </Text>
            <Link href="/signup" asChild>
              <TouchableOpacity>
                <Text className="text-accent font-bold">Бүртгүүлэх</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
