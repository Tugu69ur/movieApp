import { Heart } from 'lucide-react-native';
import React, { useState } from 'react';
import { Animated, Image, Text, TouchableOpacity, View } from 'react-native';
import { Flashcard as FlashcardType } from '../services/FlashcardService';

interface FlashcardProps {
  flashcard: FlashcardType;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const Flashcard: React.FC<FlashcardProps> = ({ flashcard, isFavorite, onToggleFavorite }) => {
  const [flipped, setFlipped] = useState(false);
  const animatedValue = new Animated.Value(0);
  const [value, setValue] = useState(0);

  animatedValue.addListener(({ value }) => {
    setValue(value);
  });

  const flipCard = () => {
    if (value >= 90) {
      Animated.spring(animatedValue, {
        toValue: 0,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
      setFlipped(false);
    } else {
      Animated.spring(animatedValue, {
        toValue: 180,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
      setFlipped(true);
    }
  };

  const frontInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const frontOpacity = animatedValue.interpolate({
    inputRange: [89, 90],
    outputRange: [1, 0],
  });

  const backOpacity = animatedValue.interpolate({
    inputRange: [89, 90],
    outputRange: [0, 1],
  });

  return (
    <View className="items-center justify-center w-full h-96 perspective-1000">
      <TouchableOpacity activeOpacity={1} onPress={flipCard} className="w-full h-full relative">
        {/* Front Side */}
        <Animated.View 
          className="absolute w-full h-full bg-white dark:bg-neutral-800 rounded-3xl shadow-lg items-center justify-center p-6 backface-hidden"
          style={{ 
            transform: [{ rotateY: frontInterpolate }],
            opacity: frontOpacity
          }}
        >
          <Image 
            source={{ uri: flashcard.image }} 
            className="w-48 h-48 rounded-full mb-6"
            resizeMode="cover"
          />
          <Text className="text-3xl font-bold text-neutral-900 dark:text-white text-center mb-2">
            {flashcard.title}
          </Text>
          <Text className="text-neutral-500 dark:text-neutral-400 text-center">
            Tap to reveal meaning
          </Text>
          
          <TouchableOpacity 
            className="absolute top-4 right-4 p-2"
            onPress={(e) => {
              e.stopPropagation(); // Prevent flip
              onToggleFavorite();
            }}
          >
            <Heart 
              size={28} 
              color={isFavorite ? "#ef4444" : "#9ca3af"} 
              fill={isFavorite ? "#ef4444" : "transparent"}
            />
          </TouchableOpacity>
        </Animated.View>

        {/* Back Side */}
        <Animated.View 
          className="absolute w-full h-full bg-indigo-500 dark:bg-indigo-600 rounded-3xl shadow-lg items-center justify-center p-6 backface-hidden"
          style={{ 
            transform: [{ rotateY: backInterpolate }],
            opacity: backOpacity
          }}
        >
          <Text className="text-4xl font-bold text-white text-center mb-4">
            {flashcard.english}
          </Text>
          {flashcard.definition && (
            <Text className="text-white/80 text-center text-lg">
              {flashcard.definition}
            </Text>
          )}
          <Text className="text-white/60 mt-8 text-sm">
            Tap to flip back
          </Text>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

export default Flashcard;
