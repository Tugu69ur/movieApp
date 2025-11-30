import { useRouter } from 'expo-router';
import { ArrowLeft, Moon, Sun } from 'lucide-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    ScrollView,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/Theme';

export default function AppSettingsScreen() {
    const router = useRouter();
    const { isDark, toggleTheme } = useTheme();
    const { language, changeLanguage } = useLanguage();
    const { t } = useTranslation();

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
                        {t('app_settings')}
                    </Text>
                </View>

                <View className="space-y-6">
                    {/* Appearance Section */}
                    <View>
                        <Text className="text-sm font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3 ml-1">
                            {t('appearance')}
                        </Text>
                        <View className="bg-white dark:bg-neutral-800 rounded-2xl p-4 shadow-sm border border-neutral-100 dark:border-neutral-700 flex-row items-center justify-between">
                            <View className="flex-row items-center">
                                <View className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full items-center justify-center mr-4">
                                    {isDark ? (
                                        <Moon size={20} className="text-indigo-600 dark:text-indigo-400" />
                                    ) : (
                                        <Sun size={20} className="text-indigo-600 dark:text-indigo-400" />
                                    )}
                                </View>
                                <View>
                                    <Text className="text-base font-semibold text-neutral-800 dark:text-white">
                                        {t('dark_mode')}
                                    </Text>
                                    <Text className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                                        {isDark ? t('on') : t('off')}
                                    </Text>
                                </View>
                            </View>
                            <Switch
                                trackColor={{ false: '#767577', true: '#6366f1' }}
                                thumbColor={isDark ? '#ffffff' : '#f4f3f4'}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={toggleTheme}
                                value={isDark}
                            />
                        </View>
                    </View>

                    {/* Language Section */}
                    <View>
                        <Text className="text-sm font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3 ml-1">
                            {t('language')}
                        </Text>
                        <View className="bg-white dark:bg-neutral-800 rounded-2xl p-2 shadow-sm border border-neutral-100 dark:border-neutral-700">

                            {/* Mongolian */}
                            <TouchableOpacity
                                onPress={() => changeLanguage('mn')}
                                className="flex-row items-center p-4 border-b border-neutral-100 dark:border-neutral-700"
                            >
                                <View className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full items-center justify-center mr-4">
                                    <Text className="text-xl">🇲🇳</Text>
                                </View>
                                <View className="flex-1">
                                    <Text className="text-base font-semibold text-neutral-800 dark:text-white">
                                        Mongolian
                                    </Text>
                                    <Text className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                                        Монгол хэл
                                    </Text>
                                </View>
                                {language === 'mn' && (
                                    <View className="w-4 h-4 rounded-full bg-indigo-500" />
                                )}
                            </TouchableOpacity>

                            {/* English */}
                            <TouchableOpacity
                                onPress={() => changeLanguage('en')}
                                className="flex-row items-center p-4"
                            >
                                <View className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full items-center justify-center mr-4">
                                    <Text className="text-xl">🇺🇸</Text>
                                </View>
                                <View className="flex-1">
                                    <Text className="text-base font-semibold text-neutral-800 dark:text-white">
                                        English
                                    </Text>
                                    <Text className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                                        English (US)
                                    </Text>
                                </View>
                                {language === 'en' && (
                                    <View className="w-4 h-4 rounded-full bg-indigo-500" />
                                )}
                            </TouchableOpacity>

                        </View>
                    </View>

                    <View className="px-2 mt-4">
                        <Text className="text-center text-neutral-400 text-xs">
                            {t('more_settings_soon')}
                        </Text>
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
