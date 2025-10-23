import { useRouter } from "expo-router";
import { Heart, Search, SlidersHorizontal } from "lucide-react-native";
import React, { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";


export default function FlashcardsHome() {
  const router = useRouter();
  const [selected, setSelected] = useState("Most Viewed");
  const tabs = ["Most Viewed", "New", "Favorite"];

  const flashcards = [
    {
      id: 1,
      title: "Ишиг /ᠢᠰᠢᢉᠡ/",
      image: require("../../assets/images/goat.jpg"),
      rating: 4.8,
    },
    {
      id: 2,
      title: "Чулуу /ᠴᠢᠯᠠᠭᠤ/",
      image: require("../../assets/images/rock.jpg"),
      rating: 4.5,
    },
    {
      id: 3,
      title: "Зурагт /ᠵᠢᠷᠤᠭᠲᠤ/",
      image: require("../../assets/images/tv.jpg"),
      rating: 4.7,
    },
  ];
  const flashcards2 = [
    {
      id: 1,
      title: "Шувуу /ᠰᠢᠪᠠᠭ/",
      image: require("../../assets/images/shuvuu.jpg"),
      rating: 4.9,
    },
    {
      id: 2,
      title: "Нулимс /ᠨᠢᠯᠪᠤᠰᠤ/",
      image: require("../../assets/images/nulims.jpg"),
      rating: 4.6,
    },
    {
      id: 3,
      title: "Судар /ᠰᠤᠳᠤᠷ/",
      image: require("../../assets/images/sudar.jpg"),
      rating: 4.8,
    },
  ];

  return (
    <View className="flex-1 bg-white px-6 pt-12">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-8">
        <View>
          <Text className="text-2xl font-semibold">Hi, JavaGod69killer👋</Text>
          <Text className="text-gray-500 mt-1">Explore flashcards</Text>
        </View>
        <Image
          source={{ uri: "https://i.pravatar.cc/60" }}
          className="w-10 h-10 rounded-full"
        />
      </View>

      {/* Search bar */}
      <TouchableOpacity
        onPress={() => router.push("/search")}
        activeOpacity={0.8}
      >
        <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-3 mb-4">
          <Search color="#999" size={20} />
          <Text
            className="flex-1 ml-2 text-base text-gray-800"
            style={{ color: "#999" }}
          >
            Search flashcards
          </Text>
          <SlidersHorizontal color="#999" size={20} />
        </View>
      </TouchableOpacity>

      {/* Tabs */}
      {/* <View className="flex-row ">
        {tabs.map((tab, i) => {
          const isActive = tab === selected;
          return (
            <TouchableOpacity
              key={i}
              onPress={() => setSelected(tab)}
              className={`px-4 py-2 rounded-full w-[116px] mr-2 ${
                isActive ? "bg-[#2F2F2F] shadow-md shadow-black/30" : "bg-white"
              }`}
            >
              <Text
                className={`font-medium text-center ${
                  isActive ? "text-white" : "text-[#C5C5C5]"
                }`}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View> */}

      <Text className="text-2xl font-semibold mt-2 mb-4">Таны хадгалсан</Text>
      {/* Flashcards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ height: 100 }}
      >
        {flashcards.map((card, index) => (
          <Animated.View
            entering={FadeInDown.delay(100 * index).duration(600)}
            key={card.id}
            className="mr-4 h-52"
          >
            <TouchableOpacity
              onPress={() => router.push(`/movies/${card.id}`)}
              className="w-56 bg-white rounded-3xl shadow-lg overflow-hidden h-52"
            >
              <Image
                source={card.image}
                style={{ width: "100%", height: "60%" }}
                resizeMode="cover" // This scales image to cover the area
              />
              <View className="px-4 py-2">
                <Text className="text-lg font-semibold">{card.title}</Text>
                <View className="flex-row items-center">
                  <Heart color="#f87171" size={16} />
                  <Text className="text-gray-600 ml-1">{card.rating}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>

      <Text className="text-2xl font-semibold mt-4 mb-4">Өнөөдрийн үгс</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {flashcards2.map((card, index) => (
          <Animated.View
            entering={FadeInDown.delay(100 * index).duration(600)}
            key={card.id}
            className="mr-4 h-52"
          >
            <TouchableOpacity
              onPress={() => router.push("/search")}
              className="w-56 bg-white rounded-3xl shadow-lg overflow-hidden h-52"
            >
              <Image
                source={card.image}
                style={{ width: "100%", height: "60%" }}
                resizeMode="cover" // This scales image to cover the area
              />
              <View className="px-4 py-2">
                <Text className="text-lg font-semibold">{card.title}</Text>
                <View className="flex-row items-center">
                  <Heart color="#f87171" size={16} />
                  <Text className="text-gray-600 ml-1">{card.rating}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
}
