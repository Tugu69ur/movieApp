import { Link } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Category } from '../services/FlashcardService';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link href={`/category/${category.id}`} asChild>
      <TouchableOpacity className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm mb-4 overflow-hidden w-[48%]">
        <Image 
          source={{ uri: category.image }} 
          className="w-full h-32 object-cover"
        />
        <View className="p-3">
          <Text className="text-lg font-bold text-neutral-900 dark:text-white mb-1">
            {category.name}
          </Text>
          <Text className="text-xs text-neutral-500 dark:text-neutral-400">
            {category.totalCards} cards
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default CategoryCard;
