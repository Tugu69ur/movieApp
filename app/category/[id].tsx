import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Flashcard from '../../components/Flashcard';
import { auth } from '../../FirebaseConfig';
import { FlashcardService, Flashcard as FlashcardType } from '../../services/FlashcardService';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [flashcards, setFlashcards] = useState<FlashcardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      if (typeof id === 'string') {
        const cards = await FlashcardService.getFlashcardsByCategory(id);
        setFlashcards(cards);

        if (auth.currentUser) {
          const ids = await FlashcardService.getFavoriteIds(auth.currentUser.uid);
          setFavorites(ids);
        }
      }
      setLoading(false);
    };
    loadData();
  }, [id]);

  const toggleFavorite = async (cardId: string) => {
    if (!auth.currentUser) return;

    const isFav = favorites.includes(cardId);
    let newFavs;
    if (isFav) {
      newFavs = favorites.filter(fid => fid !== cardId);
    } else {
      newFavs = [...favorites, cardId];
    }
    setFavorites(newFavs);

    await FlashcardService.toggleFavorite(auth.currentUser.uid, cardId, !isFav);
  };

  if (loading) {
    return (
      <View className="flex-1 bg-neutral-50 dark:bg-neutral-900 items-center justify-center">
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-neutral-50 dark:bg-neutral-900">
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-row items-center px-4 py-2 mb-2">
        <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white dark:bg-neutral-800 rounded-full shadow-sm mr-4">
          <ArrowLeft size={24} color="#4b5563" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-neutral-900 dark:text-white">Practice</Text>
      </View>

      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 40 }}>
        {flashcards.length > 0 ? (
          flashcards.map((card, index) => (
            <View key={card.id} className="mb-8">
              <Flashcard
                flashcard={card}
                isFavorite={favorites.includes(card.id)}
                onToggleFavorite={() => toggleFavorite(card.id)}
              />
            </View>
          ))
        ) : (
          <View className="items-center justify-center mt-20">
            <Text className="text-neutral-500 text-lg">No flashcards found in this category.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
