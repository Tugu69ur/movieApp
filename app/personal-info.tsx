import { useRouter } from 'expo-router';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { ArrowLeft, Mail, User } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../FirebaseConfig';

export default function PersonalInfoScreen() {
    const router = useRouter();
    const user = auth.currentUser;

    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!user) return;
        if (!displayName.trim()) {
            Alert.alert('Error', 'Name cannot be empty');
            return;
        }

        setLoading(true);
        try {
            // Update Auth Profile
            await updateProfile(user, { displayName });

            // Update Firestore User Document
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, { displayName });

            Alert.alert('Success', 'Profile updated successfully!');
            router.back();
        } catch (error: any) {
            Alert.alert('Error', 'Failed to update profile: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-neutral-50 dark:bg-neutral-900">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
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
                            Personal Info
                        </Text>
                    </View>

                    {/* Form */}
                    <View className="space-y-6">
                        {/* Name Field */}
                        <View>
                            <Text className="text-neutral-500 dark:text-neutral-400 font-medium mb-2 ml-1">
                                Full Name
                            </Text>
                            <View className="flex-row items-center bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 px-4 py-3.5">
                                <User size={20} className="text-neutral-400 mr-3" />
                                <TextInput
                                    className="flex-1 text-neutral-800 dark:text-white font-medium text-base"
                                    value={displayName}
                                    onChangeText={setDisplayName}
                                    placeholder="Enter your name"
                                    placeholderTextColor="#9ca3af"
                                />
                            </View>
                        </View>

                        {/* Email Field (Read-only) */}
                        <View>
                            <Text className="text-neutral-500 dark:text-neutral-400 font-medium mb-2 ml-1">
                                Email Address
                            </Text>
                            <View className="flex-row items-center bg-neutral-100 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700 px-4 py-3.5 opacity-70">
                                <Mail size={20} className="text-neutral-400 mr-3" />
                                <Text className="flex-1 text-neutral-500 dark:text-neutral-400 font-medium text-base">
                                    {user?.email}
                                </Text>
                            </View>
                            <Text className="text-xs text-neutral-400 mt-2 ml-1">
                                Email cannot be changed directly for security reasons.
                            </Text>
                        </View>
                    </View>

                    {/* Save Button */}
                    <TouchableOpacity
                        onPress={handleSave}
                        disabled={loading}
                        className="mt-10 bg-indigo-600 py-4 rounded-xl items-center shadow-lg shadow-indigo-500/30 active:scale-95 transition-transform"
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white font-bold text-lg tracking-wide">
                                Save Changes
                            </Text>
                        )}
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
