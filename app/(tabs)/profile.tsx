import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { signOut, updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import {
  Bell,
  ChevronRight,
  Crown,
  Edit3,
  Flame,
  Heart,
  LogOut,
  Settings,
  Shield,
  User2
} from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db, storage } from '../../FirebaseConfig';
import { FlashcardService, Flashcard as FlashcardType } from '../../services/FlashcardService';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const [favorites, setFavorites] = useState<FlashcardType[]>([]);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const user = auth.currentUser;

  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  useEffect(() => {
    const loadProfile = async () => {
      if (user) {
        await FlashcardService.updateStreak(user.uid);

        const favs = await FlashcardService.getFavorites(user.uid);
        setFavorites(favs);

        const userData = await FlashcardService.getUserData(user.uid);
        if (userData) setStreak(userData.streak);
      }
      setLoading(false);
    };

    loadProfile();
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    router.replace('/login');
  };

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled && result.assets[0].uri && user) {
        setUploading(true);
        const uploadUrl = await uploadImageAsync(result.assets[0].uri);

        await updateProfile(user, { photoURL: uploadUrl });

        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, { photoURL: uploadUrl });

        setUploading(false);
        Alert.alert('Success', 'Profile picture updated!');
      }
    } catch (error: any) {
      setUploading(false);
      Alert.alert('Error', 'Failed to upload image: ' + error.message);
    }
  };

  const uploadImageAsync = async (uri: string) => {
    const blob: Blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });

    const fileRef = ref(storage, `profile_images/${user?.uid}`);
    await uploadBytes(fileRef, blob);

    // @ts-ignore
    blob.close();

    return await getDownloadURL(fileRef);
  };

  if (loading) {
    return (
      <View className="flex-1 bg-neutral-50 dark:bg-neutral-900 items-center justify-center">
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-neutral-50 dark:bg-neutral-900">

      <View className="absolute top-0 w-full h-[430px] bg-indigo-600 dark:bg-indigo-900 rounded-b-[60px] overflow-hidden">
        <View className="absolute top-[-50px] left-[-50px] w-64 h-64 bg-purple-500 rounded-full opacity-30 blur-3xl" />
        <View className="absolute top-[100px] right-[-20px] w-80 h-80 bg-pink-500 rounded-full opacity-20 blur-3xl" />
      </View>

      <SafeAreaView className="flex-1">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Header */}
          <Animated.View entering={FadeInDown.delay(100).duration(600).springify()} className="items-center mt-4 px-4">
            <View className="relative">

              <TouchableOpacity
                onPress={handleImagePick}
                disabled={uploading}
                className="w-32 h-32 rounded-full items-center justify-center bg-white/20 border-4 border-white/30 shadow-2xl overflow-hidden"
              >
                {uploading ? (
                  <ActivityIndicator color="white" />
                ) : user?.photoURL ? (
                  <Image
                    source={{ uri: user.photoURL }}
                    className="w-full h-full"
                    resizeMode="cover"
                    style={{ transform: [{ scale: 1.3 }] }}
                  />
                ) : (
                  <User2 size={64} color="white" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleImagePick}
                className="absolute bottom-0 right-0 bg-white dark:bg-neutral-800 p-2.5 rounded-full shadow-lg border border-neutral-100 dark:border-neutral-700"
              >
                <Edit3 size={16} color={isDark ? "#fff" : "#6366f1"} />
              </TouchableOpacity>
            </View>

            <View className="items-center mt-4 space-y-1">
              <Text className="text-3xl font-bold text-white tracking-tight">
                {user?.displayName || 'Adventurer'}
              </Text>
              <Text className="text-indigo-100 text-base font-medium">{user?.email}</Text>

              <View className="flex-row items-center bg-indigo-500/30 px-3 py-1 rounded-full mt-2 border border-indigo-400/30">
                <Crown size={14} color="#fbbf24" fill="#fbbf24" />
                <Text className="text-amber-300 text-xs font-bold ml-1.5 uppercase tracking-wider">
                  Premium Member
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Stats */}
          <Animated.View entering={FadeInUp.delay(300).duration(600).springify()} className="flex-row justify-between px-5 mt-8">
            <BlurView intensity={Platform.OS === 'ios' ? 30 : 100} tint="light" className="flex-1 mr-3 rounded-3xl overflow-hidden">
              <View className="bg-white/70 dark:bg-neutral-800/80 p-5 items-center justify-center h-32">
                <View className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-full mb-2">
                  <Flame size={28} color="#f97316" fill="#f97316" />
                </View>
                <Text className="text-2xl font-black text-neutral-800 dark:text-white">{streak}</Text>
                <Text className="text-xs text-neutral-500 dark:text-neutral-400 font-semibold uppercase tracking-wider">
                  Day Streak
                </Text>
              </View>
            </BlurView>

            <BlurView intensity={Platform.OS === 'ios' ? 30 : 100} tint="light" className="flex-1 ml-3 rounded-3xl overflow-hidden">
              <View className="bg-white/70 dark:bg-neutral-800/80 p-5 items-center justify-center h-32">
                <View className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full mb-2">
                  <Heart size={28} color="#ef4444" fill="#ef4444" />
                </View>
                <Text className="text-2xl font-black text-neutral-800 dark:text-white">
                  {favorites.length}
                </Text>
                <Text className="text-xs text-neutral-500 dark:text-neutral-400 font-semibold uppercase tracking-wider">
                  Favorites
                </Text>
              </View>
            </BlurView>
          </Animated.View>

          {/* Settings */}
          <Animated.View entering={FadeInUp.delay(500).duration(600).springify()} className="mt-8 px-5">

            <Text className="text-lg font-bold text-neutral-800 dark:text-white mb-4 ml-1">
              Settings & Preferences
            </Text>

            <View className="bg-white dark:bg-neutral-800 rounded-3xl p-2 shadow-sm">

              <MenuItem
                icon={<User2 size={20} color={isDark ? "#fff" : "#6366f1"} />}
                label="Personal Information"
                color="bg-indigo-50 dark:bg-indigo-900/20"
                onPress={() => router.push('/personal-info')}
                isDark={isDark}
              />

              <MenuItem
                icon={<Bell size={20} color={isDark ? "#fff" : "#3b82f6"} />}
                label="Notifications"
                color="bg-blue-50 dark:bg-blue-900/20"
                onPress={() => router.push('/notifications')}
                isDark={isDark}
              />

              <MenuItem
                icon={<Shield size={20} color={isDark ? "#fff" : "#10b981"} />}
                label="Security & Privacy"
                color="bg-emerald-50 dark:bg-emerald-900/20"
                onPress={() => router.push('/security-privacy')}
                isDark={isDark}
              />

              <MenuItem
                icon={<Settings size={20} color={isDark ? "#fff" : "#737373"} />}
                label="App Settings"
                color="bg-neutral-100 dark:bg-neutral-700/30"
                isLast
                onPress={() => router.push('/app-settings')}
                isDark={isDark}
              />
            </View>

            <TouchableOpacity
              onPress={handleLogout}
              className="mt-6 flex-row items-center justify-center bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 p-4 rounded-2xl active:scale-95 transition-transform"
            >
              <LogOut size={20} color={isDark ? "#fff" : "#ef4444"} />
              <Text className="ml-2 text-red-600 dark:text-red-400 font-bold text-base">
                Log Out
              </Text>
            </TouchableOpacity>

            <Text className="text-center text-neutral-400 text-xs mt-8">
              Version 1.0.0 • Made with Tuguldur
            </Text>

          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// ------------------------
// Menu Item Component
// ------------------------

const MenuItem = ({
  icon,
  label,
  color,
  isLast = false,
  onPress,
  isDark
}: {
  icon: React.ReactNode;
  label: string;
  color: string;
  isLast?: boolean;
  onPress?: () => void;
  isDark: boolean;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className={`flex-row items-center p-4 ${!isLast ? 'border-b border-neutral-100 dark:border-neutral-700' : ''} active:bg-neutral-50 dark:active:bg-neutral-700/50 rounded-2xl`}
  >
    <View className={`w-10 h-10 rounded-full items-center justify-center ${color}`}>
      {icon}
    </View>
    <Text className="flex-1 ml-4 text-neutral-700 dark:text-neutral-200 font-semibold text-base">
      {label}
    </Text>

    <ChevronRight size={20} color={isDark ? "#fff" : "#9ca3af"} />
  </TouchableOpacity>
);
