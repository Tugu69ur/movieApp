import { useRouter } from "expo-router";
import { Heart, Search, SlidersHorizontal } from "lucide-react-native";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]); // track liked flashcards

  const flashcards = [
    { id: 1, title: "Ишиг", image: "https://picsum.photos/200/300?random=1" },
    { id: 2, title: "Чулуу", image: "https://picsum.photos/200/300?random=2" },
    { id: 3, title: "Зурагт", image: "https://picsum.photos/200/300?random=3" },
  ];

  const flashcards2 = [
    { id: 7, title: "Тэмээ", image: "https://picsum.photos/200/300?random=7" },
    { id: 8, title: "Мод", image: "https://picsum.photos/200/300?random=8" },
    { id: 9, title: "Гэр", image: "https://picsum.photos/200/300?random=9" },
  ];

  const flashcards3 = [
    {
      id: 10,
      title: "Computer",
      image: "https://picsum.photos/200/300?random=10",
    },
    {
      id: 11,
      title: "Phone",
      image: "https://picsum.photos/200/300?random=11",
    },
    {
      id: 12,
      title: "Table",
      image: "https://picsum.photos/200/300?random=12",
    },
  ];
  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  return (
    <View style={styles.container}>
      <View className="flex-row justify-between items-center mb-2">
        <View>
          <Text className="text-black font-semibold text-2xl">Хайлт</Text>
        </View>
        <Image
          source={{ uri: "https://i.pravatar.cc/60" }}
          className="w-10 h-10 rounded-full"
        />
      </View>
      {/* Search Bar */}
      <TouchableOpacity
        style={styles.searchBar}
        activeOpacity={0.8}
        onPress={() => router.push("/search")}
      >
        <Search color="#999" size={20} />
        <TextInput
          placeholder="Search flashcards"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.input}
          placeholderTextColor="#999"
          editable={false} // acts as a button to navigate
        />
        <SlidersHorizontal color="#999" size={20} />
      </TouchableOpacity>

      {/* Flashcards */}
      <Text style={styles.sectionTitle}>Өдөр тутмын үгс</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
      >
        {flashcards.map((card) => (
          <TouchableOpacity
            key={card.id}
            style={styles.card}
            onPress={() => console.log("Pressed:", card.title)}
          >
            <Image
              source={{ uri: card.image }}
              style={styles.cardImage}
              resizeMode="cover"
            />
            <TouchableOpacity
              style={styles.heartIcon}
              onPress={() => toggleFavorite(card.id)}
            >
              <Heart
                color={favorites.includes(card.id) ? "red" : "#fff"}
                size={20}
              />
            </TouchableOpacity>
            <Text style={styles.cardTitle}>{card.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Text style={styles.sectionTitle}>Өвөрмөц бичлэгтэй үгс</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
      >
        {flashcards2.map((card) => (
          <TouchableOpacity
            key={card.id}
            style={styles.card}
            onPress={() => console.log("Pressed:", card.title)}
          >
            <Image
              source={{ uri: card.image }}
              style={styles.cardImage}
              resizeMode="cover"
            />
            <TouchableOpacity
              style={styles.heartIcon}
              onPress={() => toggleFavorite(card.id)}
            >
              <Heart
                color={favorites.includes(card.id) ? "red" : "#fff"}
                size={20}
              />
            </TouchableOpacity>
            <Text style={styles.cardTitle}>{card.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Text style={styles.sectionTitle}>Гадаад үгс</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
      >
        {flashcards3.map((card) => (
          <TouchableOpacity
            key={card.id}
            style={styles.card}
            onPress={() => console.log("Pressed:", card.title)}
          >
            <Image
              source={{ uri: card.image }}
              style={styles.cardImage}
              resizeMode="cover"
            />
            <TouchableOpacity
              style={styles.heartIcon}
              onPress={() => toggleFavorite(card.id)}
            >
              <Heart
                color={favorites.includes(card.id) ? "red" : "#fff"}
                size={20}
              />
            </TouchableOpacity>
            <Text style={styles.cardTitle}>{card.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 48,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f3f3",
    borderRadius: 9999,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  input: { flex: 1, marginLeft: 8, fontSize: 16, color: "#333" },
  sectionTitle: { fontSize: 18, color: "#000", marginVertical: 12 },
  card: {
    width: 140,
    height: 180,
    borderRadius: 16,
    backgroundColor: "#eee",
    marginRight: 16,
    overflow: "hidden",
  },
  cardImage: { width: "100%", height: "70%" },
  cardTitle: { padding: 8, fontSize: 16, fontWeight: "600" },
  heartIcon: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 16,
    padding: 4,
  },
});
