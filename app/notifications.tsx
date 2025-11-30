import DateTimePicker from '@react-native-community/datetimepicker';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bell, Clock } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Platform,
    ScrollView,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Configure how notifications should be handled when the app is in foreground
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export default function NotificationsScreen() {
    const router = useRouter();
    const [isEnabled, setIsEnabled] = useState(false);
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);


    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === "dark";

    useEffect(() => {
        checkPermissions();
        checkScheduledNotifications();
    }, []);

    const checkPermissions = async () => {
        const settings = await Notifications.getPermissionsAsync();
        setIsEnabled(settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL);
    };

    const checkScheduledNotifications = async () => {
        const scheduled = await Notifications.getAllScheduledNotificationsAsync();
        if (scheduled.length > 0) {
            setIsEnabled(true);
            // Try to set the time from the scheduled notification
            const trigger = scheduled[0].trigger as any;
            if (trigger && trigger.hour !== undefined && trigger.minute !== undefined) {
                const scheduledDate = new Date();
                scheduledDate.setHours(trigger.hour);
                scheduledDate.setMinutes(trigger.minute);
                setDate(scheduledDate);
            }
        } else {
            // Default to 10:00 AM if no notification is scheduled
            const defaultDate = new Date();
            defaultDate.setHours(10, 0, 0, 0);
            setDate(defaultDate);
        }
    };

    const toggleSwitch = async () => {
        if (!isEnabled) {
            const granted = await registerForPushNotificationsAsync();
            if (granted) {
                await scheduleDailyNotification(date);
                setIsEnabled(true);
                Alert.alert('Success', `Daily reminders enabled for ${formatTime(date)}!`);
            } else {
                setIsEnabled(false);
            }
        } else {
            await Notifications.cancelAllScheduledNotificationsAsync();
            setIsEnabled(false);
        }
    };

    const onTimeChange = async (event: any, selectedDate?: Date) => {
        setShowPicker(false);
        if (selectedDate) {
            setDate(selectedDate);
            if (isEnabled) {
                // Reschedule if already enabled
                await scheduleDailyNotification(selectedDate);
            }
        }
    };

    async function scheduleDailyNotification(notificationTime: Date) {
        await Notifications.cancelAllScheduledNotificationsAsync();

        const trigger = {
            hour: notificationTime.getHours(),
            minute: notificationTime.getMinutes(),
            repeats: true,
        };

        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Сурах цаг боллоо! 📚",
                body: "Өөрийн Streak-ыг үргэлжлүүлээрэй! Яг одоо өдөр тутмынхаа Flashcard-ыг хий!!!",
                sound: true,
            },
            trigger,
        });
    }

    async function registerForPushNotificationsAsync() {
        let token;

        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                Alert.alert('Permission required', 'Please enable notifications in your settings to receive reminders.');
                return false;
            }
            return true;
        } else {
            Alert.alert('Must use physical device for Push Notifications');
            return false;
        }
    }

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
                        Notifications
                    </Text>
                </View>

                {/* Settings */}
                <View className="space-y-6">
                    <View className="bg-white dark:bg-neutral-800 rounded-2xl p-4 shadow-sm border border-neutral-100 dark:border-neutral-700">
                        <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center flex-1">
                                <View className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full items-center justify-center mr-4">
                                    <Bell size={20} className="text-indigo-600 dark:text-indigo-400" color={isDark ? "#fff" : "#ea580c"} />
                                </View>
                                <View>
                                    <Text className="text-base font-bold text-neutral-800 dark:text-white">
                                        Daily Reminders
                                    </Text>
                                    <Text className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                                        Get reminded to study every day
                                    </Text>
                                </View>
                            </View>
                            <Switch
                                trackColor={{ false: '#767577', true: '#6366f1' }}
                                thumbColor={isEnabled ? '#ffffff' : '#f4f3f4'}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={toggleSwitch}
                                value={isEnabled}
                            />
                        </View>

                        {isEnabled && (
                            <View className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-700">
                                <View className="flex-row items-center justify-between">
                                    <View className="flex-row items-center">
                                        <Clock size={16} className="text-neutral-400 mr-2" />
                                        <Text className="text-neutral-500 dark:text-neutral-400 text-sm">
                                            Scheduled time
                                        </Text>
                                    </View>

                                    <TouchableOpacity
                                        onPress={() => setShowPicker(true)}
                                        className="bg-neutral-100 dark:bg-neutral-700 px-3 py-1.5 rounded-lg"
                                    >
                                        <Text className="font-bold text-indigo-600 dark:text-indigo-400">
                                            {formatTime(date)}
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                {showPicker && (
                                    <DateTimePicker
                                        value={date}
                                        mode="time"
                                        is24Hour={true}
                                        display="default"
                                        onChange={onTimeChange}
                                    />
                                )}
                            </View>
                        )}
                    </View>

                    <View className="px-2">
                        <Text className="text-sm text-neutral-400 text-center leading-5">
                            Consistent practice is the key to learning a new language. Enable notifications to keep your streak alive!
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
