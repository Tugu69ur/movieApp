import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';

export default function SignupScreen() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword || !displayName) {
      Alert.alert('Алдаа', 'Бүх талбарыг бөглөнө үү');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Алдаа', 'Нууц үгүүд тохирохгүй байна');
      return;
    }
    setLoading(true);
    try {
      await signUp(email, password, displayName);
      Alert.alert('Амжилттай', 'Бүртгэл үүсгэлээ!');
    } catch (error: any) {
      Alert.alert('Бүртгэлийн алдаа', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24 }}
        >
          {/* Title */}
          <View className="items-center mb-14">
            <Text className="text-white text-4xl font-extrabold tracking-wide">
              Бүртгүүлэх
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-6 bg-neutral-900/40 p-6 rounded-2xl border border-neutral-700/40">
            <View>
              <Text className="text-neutral-400 mb-2 ml-1 text-sm">Нэр</Text>
              <TextInput
                className="w-full bg-neutral-800/70 text-white px-4 py-3 rounded-xl border border-neutral-700 focus:border-accent"
                placeholder="Таны нэр"
                placeholderTextColor="#6b7280"
                value={displayName}
                onChangeText={setDisplayName}
              />
            </View>

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

            <View>
              <Text className="text-neutral-400 mb-2 ml-1 text-sm">Нууц үг давтах</Text>
              <TextInput
                className="w-full bg-neutral-800/70 text-white px-4 py-3 rounded-xl border border-neutral-700 focus:border-accent"
                placeholder="••••••••"
                placeholderTextColor="#6b7280"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              className="w-full bg-accent py-3 rounded-xl items-center shadow-sm mt-4"
              onPress={handleSignup}
              disabled={loading}
            >
              <Text className="text-black font-bold text-lg tracking-wide">
                {loading ? 'Бүртгүүлж байна...' : 'Бүртгүүлэх'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View className="flex-row justify-center mt-8">
            <Text className="text-neutral-400">Бүртгэлтэй юу? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-accent font-bold">Нэвтрэх</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
