import { images } from "@/constants/images";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => {
            logout();
            router.replace("/" as any);
          },
        },
      ]
    );
  };

  return (
    <ImageBackground source={images.bg} className="flex-1">
      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ flexGrow: 1, paddingTop: 60 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="items-center mb-8">
          <Image source={images.logo} className="w-20 h-20 mb-4" />
          <Text className="text-white text-2xl font-bold">Profile</Text>
        </View>

        {/* User Info Card */}
        <View className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 mb-6">
          <View className="items-center mb-6">
            <View className="w-20 h-20 bg-blue-600 rounded-full items-center justify-center mb-4">
              <Text className="text-white text-2xl font-bold">
                {user?.email?.charAt(0).toUpperCase() || "U"}
              </Text>
            </View>
            <Text className="text-white text-xl font-semibold">
              {user?.email || "User"}
            </Text>
            <Text className="text-gray-300 text-base mt-1">
              Movie App User
            </Text>
          </View>

          <View className="space-y-4">
            <View className="flex-row items-center justify-between py-3 border-b border-white/10">
              <Text className="text-white text-base">Email</Text>
              <Text className="text-gray-300 text-base">{user?.email}</Text>
            </View>
            
            <View className="flex-row items-center justify-between py-3 border-b border-white/10">
              <Text className="text-white text-base">Member Since</Text>
              <Text className="text-gray-300 text-base">Today</Text>
            </View>
            
            <View className="flex-row items-center justify-between py-3">
              <Text className="text-white text-base">Movies Watched</Text>
              <Text className="text-gray-300 text-base">0</Text>
            </View>
          </View>
        </View>

        {/* Settings Card */}
        <View className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 mb-6">
          <Text className="text-white text-lg font-semibold mb-4">Settings</Text>
          
          <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-white/10">
            <Text className="text-white text-base">Notifications</Text>
            <Text className="text-gray-300 text-base">On</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-white/10">
            <Text className="text-white text-base">Dark Mode</Text>
            <Text className="text-gray-300 text-base">On</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="flex-row items-center justify-between py-4">
            <Text className="text-white text-base">Language</Text>
            <Text className="text-gray-300 text-base">English</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          className="bg-red-600 rounded-xl py-4 items-center mb-8"
          onPress={handleLogout}
        >
          <Text className="text-white text-lg font-semibold">Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

