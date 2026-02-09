import { Pause, Play, RotateCcw } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { PositionedLetter, splitWord } from '../utils/mongolianLetters';

interface MongolianLetterRendererProps {
    word: string;
    autoPlay?: boolean;
    stepDuration?: number; // milliseconds per letter
    showLabels?: boolean;
    vertical?: boolean; // Mongolian script is traditionally vertical
}

export default function MongolianLetterRenderer({
    word,
    autoPlay = false,
    stepDuration = 800,
    showLabels = true,
    vertical = true,
}: MongolianLetterRendererProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(autoPlay);
    const [letters] = useState<PositionedLetter[]>(splitWord(word));
    const [fadeAnims] = useState(
        letters.map(() => new Animated.Value(0))
    );

    // Auto-play animation
    useEffect(() => {
        if (!isPlaying) return;

        if (currentStep < letters.length) {
            const timer = setTimeout(() => {
                // Fade in current letter
                Animated.timing(fadeAnims[currentStep], {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }).start();

                setCurrentStep(currentStep + 1);
            }, stepDuration);

            return () => clearTimeout(timer);
        } else {
            setIsPlaying(false);
        }
    }, [isPlaying, currentStep, letters.length, stepDuration]);

    const handlePlayPause = () => {
        if (currentStep >= letters.length) {
            handleReset();
        }
        setIsPlaying(!isPlaying);
    };

    const handleReset = () => {
        setCurrentStep(0);
        setIsPlaying(false);
        fadeAnims.forEach(anim => anim.setValue(0));
    };

    const handleStepForward = () => {
        if (currentStep < letters.length) {
            Animated.timing(fadeAnims[currentStep], {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
            setCurrentStep(currentStep + 1);
        }
    };

    const handleStepBackward = () => {
        if (currentStep > 0) {
            const prevStep = currentStep - 1;
            fadeAnims[prevStep].setValue(0);
            setCurrentStep(prevStep);
        }
    };

    return (
        <View className="items-center justify-center">
            {/* Letter Display Area */}
            <View
                className={`bg-white dark:bg-neutral-800 rounded-2xl p-6 mb-4 ${vertical ? 'flex-row' : 'flex-col'
                    }`}
                style={{
                    minHeight: vertical ? 300 : 'auto',
                    minWidth: vertical ? 'auto' : 300,
                }}
            >
                {letters.map((letter, index) => (
                    <Animated.View
                        key={`${letter.char}-${index}`}
                        className={`items-center justify-center ${vertical ? 'mb-2' : 'mr-2'}`}
                        style={{
                            opacity: fadeAnims[index],
                            transform: [
                                {
                                    scale: fadeAnims[index].interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0.5, 1],
                                    }),
                                },
                            ],
                        }}
                    >
                        {/* Mongolian Character */}
                        <View className="bg-indigo-100 dark:bg-indigo-900/30 rounded-xl p-2 mb-2 min-w-[50px] items-center justify-center">
                            <Text className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 font-mongolian">
                                {letter.char}
                            </Text>
                        </View>

                        {/* Labels */}
                        {showLabels && index < currentStep && (
                            <View className="items-center">
                                <Text className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                                    {letter.latin}
                                </Text>
                                <Text className="text-xs text-neutral-500 dark:text-neutral-500">
                                    {letter.position}
                                </Text>
                            </View>
                        )}
                    </Animated.View>
                ))}
            </View>

            {/* Progress Indicator */}
            <View className="flex-row items-center mb-4">
                <View className="flex-row gap-1">
                    {letters.map((_, index) => (
                        <View
                            key={index}
                            className={`h-2 w-8 rounded-full ${index < currentStep
                                ? 'bg-indigo-500'
                                : 'bg-neutral-300 dark:bg-neutral-700'
                                }`}
                        />
                    ))}
                </View>
                <Text className="ml-3 text-sm font-semibold text-neutral-600 dark:text-neutral-400">
                    {currentStep} / {letters.length}
                </Text>
            </View>

            {/* Controls */}
            <View className="flex-row items-center gap-3">
                <TouchableOpacity
                    onPress={handleStepBackward}
                    disabled={currentStep === 0}
                    className={`p-3 rounded-full ${currentStep === 0
                        ? 'bg-neutral-200 dark:bg-neutral-800'
                        : 'bg-neutral-300 dark:bg-neutral-700'
                        }`}
                >
                    <Text className="text-lg font-bold text-neutral-700 dark:text-neutral-300">←</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handlePlayPause}
                    className="p-4 bg-indigo-500 rounded-full"
                >
                    {isPlaying ? (
                        <Pause size={24} color="#fff" />
                    ) : (
                        <Play size={24} color="#fff" />
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleStepForward}
                    disabled={currentStep >= letters.length}
                    className={`p-3 rounded-full ${currentStep >= letters.length
                        ? 'bg-neutral-200 dark:bg-neutral-800'
                        : 'bg-neutral-300 dark:bg-neutral-700'
                        }`}
                >
                    <Text className="text-lg font-bold text-neutral-700 dark:text-neutral-300">→</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleReset}
                    className="p-3 bg-neutral-300 dark:bg-neutral-700 rounded-full ml-2"
                >
                    <RotateCcw size={20} color="#6b7280" />
                </TouchableOpacity>
            </View>

            {/* Word Info */}
            <View className="mt-4 items-center">
                <Text className="text-sm text-neutral-500 dark:text-neutral-400">
                    Full word: <Text className="font-bold">{word}</Text>
                </Text>
                <Text className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                    Latin: {letters.map(l => l.latin).join('')}
                </Text>
            </View>
        </View>
    );
}
