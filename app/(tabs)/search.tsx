import { DarkTheme, LightTheme } from "@/constants/theme";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/Theme";
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
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]);
  
  const currentTheme = theme === 'dark' ? DarkTheme : LightTheme;

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
    <ScrollView style={[styles.container, { backgroundColor: currentTheme.background }]} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: currentTheme.text }]}>{t("search.title")}</Text>
        <Image
          source={{ uri: "https://i.pravatar.cc/60" }}
          style={styles.profileImage}
        />
      </View>

      {/* Search Bar */}
      <TouchableOpacity
        style={[styles.searchBar, { backgroundColor: currentTheme.card }]}
        activeOpacity={0.8}
        onPress={() => router.push("/search")}
      >
        <Search color={currentTheme.secondaryText} size={20} />
        <TextInput
          placeholder={t("common.search")}
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={[styles.input, { color: currentTheme.text }]}
          placeholderTextColor={currentTheme.secondaryText}
          editable={false}
        />
        <SlidersHorizontal color={currentTheme.secondaryText} size={20} />
      </TouchableOpacity>

      {/* Section 1 */}
      <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>{t("search.dailyWords")}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
      >
        {flashcards.map((card) => (
          <TouchableOpacity
            key={card.id}
            style={[styles.card, { backgroundColor: currentTheme.card }]}
            onPress={() => console.log("Pressed:", card.title)}
          >
            <Image source={{ uri: card.image }} style={styles.cardImage} />
            <TouchableOpacity
              style={styles.heartIcon}
              onPress={() => toggleFavorite(card.id)}
            >
              <Heart
                color={favorites.includes(card.id) ? currentTheme.heart : "#fff"}
                size={20}
              />
            </TouchableOpacity>
            <Text style={[styles.cardTitle, { color: currentTheme.text }]}>{card.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Section 2 */}
      <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>{t("search.uniqueWords")}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
      >
        {flashcards2.map((card) => (
          <TouchableOpacity key={card.id} style={[styles.card, { backgroundColor: currentTheme.card }]}>
            <Image source={{ uri: card.image }} style={styles.cardImage} />
            <TouchableOpacity
              style={styles.heartIcon}
              onPress={() => toggleFavorite(card.id)}
            >
              <Heart
                color={favorites.includes(card.id) ? currentTheme.heart : "#fff"}
                size={20}
              />
            </TouchableOpacity>
            <Text style={[styles.cardTitle, { color: currentTheme.text }]}>{card.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Section 3 */}
      <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>{t("search.foreignWords")}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
      >
        {flashcards3.map((card) => (
          <TouchableOpacity key={card.id} style={[styles.card, { backgroundColor: currentTheme.card }]}>
            <Image source={{ uri: card.image }} style={styles.cardImage} />
            <TouchableOpacity
              style={styles.heartIcon}
              onPress={() => toggleFavorite(card.id)}
            >
              <Heart
                color={favorites.includes(card.id) ? currentTheme.heart : "#fff"}
                size={20}
              />
            </TouchableOpacity>
            <Text style={[styles.cardTitle, { color: currentTheme.text }]}>{card.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bottom Space */}
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 48,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 9999,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  input: { flex: 1, marginLeft: 8, fontSize: 16 },
  sectionTitle: { fontSize: 18, marginVertical: 12 },
  card: {
    width: 140,
    height: 180,
    borderRadius: 16,
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
