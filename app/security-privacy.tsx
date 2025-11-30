import { useRouter } from 'expo-router';
import { ArrowLeft, ChevronRight, Key, Lock, Shield, Smartphone, Trash2 } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import React from 'react';
import {
    Alert,
    ScrollView,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';

export default function SecurityPrivacyScreen() {
    const router = useRouter();
    const { signOut } = useAuth();
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === "dark";

    const [biometricsEnabled, setBiometricsEnabled] = React.useState(false);

    const handleDeleteAccount = () => {
        Alert.alert(
            'Delete Account',
            'Are you sure you want to delete your account? This action cannot be undone and all your data will be lost.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        // Implement delete logic here
                        // await deleteUser(auth.currentUser);
                        Alert.alert('Account Deleted', 'Your account has been scheduled for deletion.');
                        await signOut();
                        router.replace('/login');
                    }
                }
            ]
        );
    };

    const handlePasswordChange = () => {
        Alert.alert('Reset Password', 'A password reset link has been sent to your email.');
        // Implement password reset logic
    };

    return (
        <SafeAreaView className="flex-1 bg-neutral-50 dark:bg-neutral-900">
            <ScrollView className="flex-1 px-5">
                {/* Header */}
                <View className="flex-row items-center mt-4 mb-8">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 bg-white dark:bg-neutral-800 rounded-full items-center justify-center shadow-sm border border-neutral-100 dark:border-neutral-700"
                    >
                        <ArrowLeft size={20} className="text-neutral-800 dark:text-white" />
                    </TouchableOpacity>
                    <Text className="text-2xl font-bold text-neutral-800 dark:text-white ml-4">
                        Security & Privacy
                    </Text>
                </View>

                <View className="space-y-6">
                    {/* Security Section */}
                    <View>
                        <Text className="text-sm font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3 ml-1">
                            Security
                        </Text>
                        <View className="bg-white dark:bg-neutral-800 rounded-2xl p-2 shadow-sm border border-neutral-100 dark:border-neutral-700">

                            {/* Change Password */}
                            <TouchableOpacity
                                onPress={handlePasswordChange}
                                className="flex-row items-center p-4 border-b border-neutral-100 dark:border-neutral-700"
                            >
                                <View className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full items-center justify-center mr-4">
                                    <Key size={20} className="text-orange-600 dark:text-orange-400" color={isDark ? "#fff" : "#ea580c"} />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-base font-semibold text-neutral-800 dark:text-white">
                                        Change Password
                                    </Text>
                                    <Text className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                                        Update your password regularly
                                    </Text>
                                </View>
                                <ChevronRight size={20} className="text-neutral-400" />
                            </TouchableOpacity>

                            {/* Biometric Login */}
                            <View className="flex-row items-center p-4">
                                <View className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full items-center justify-center mr-4">
                                    <Smartphone size={20} className="text-purple-600 dark:text-purple-400" color={isDark ? "#fff" : "#ea580c"} />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-base font-semibold text-neutral-800 dark:text-white">
                                        Biometric Login
                                    </Text>
                                    <Text className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                                        FaceID / TouchID
                                    </Text>
                                </View>
                                <Switch
                                    trackColor={{ false: '#767577', true: '#6366f1' }}
                                    thumbColor={biometricsEnabled ? '#ffffff' : '#f4f3f4'}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={setBiometricsEnabled}
                                    value={biometricsEnabled}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Privacy Section */}
                    <View>
                        <Text className="text-sm font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3 ml-1">
                            Privacy
                        </Text>
                        <View className="bg-white dark:bg-neutral-800 rounded-2xl p-2 shadow-sm border border-neutral-100 dark:border-neutral-700">

                            {/* Privacy Policy */}
                            <TouchableOpacity className="flex-row items-center p-4 border-b border-neutral-100 dark:border-neutral-700">
                                <View className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full items-center justify-center mr-4">
                                    <Shield size={20} className="text-blue-600 dark:text-blue-400" color={isDark ? "#fff" : "#ea580c"} />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-base font-semibold text-neutral-800 dark:text-white">
                                        Privacy Policy
                                    </Text>
                                    <Text className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                                        Read our terms and conditions
                                    </Text>
                                </View>
                                <ChevronRight size={20} className="text-neutral-400" color={isDark ? "#fff" : "#ea580c"} />
                            </TouchableOpacity>

                            {/* Data Usage */}
                            <TouchableOpacity className="flex-row items-center p-4">
                                <View className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-full items-center justify-center mr-4">
                                    <Lock size={20} className="text-emerald-600 dark:text-emerald-400" color={isDark ? "#fff" : "#ea580c"} />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-base font-semibold text-neutral-800 dark:text-white">
                                        Data Usage
                                    </Text>
                                    <Text className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                                        Manage how your data is used
                                    </Text>
                                </View>
                                <ChevronRight size={20} className="text-neutral-400" color={isDark ? "#fff" : "#ea580c"} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Danger Zone */}
                    <View className="mt-4">
                        <TouchableOpacity
                            onPress={handleDeleteAccount}
                            className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 p-4 rounded-2xl flex-row items-center justify-center active:scale-95 transition-transform"
                        >
                            <Trash2 size={20} className="text-red-500" />
                            <Text className="ml-2 text-red-600 dark:text-red-400 font-bold text-base">
                                Delete Account
                            </Text>
                        </TouchableOpacity>
                        <Text className="text-center text-neutral-400 text-xs mt-4 mb-8">
                            This action is permanent and cannot be undone.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
