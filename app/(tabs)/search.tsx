import { useRouter } from "expo-router";
import {
  BookOpen,
  Filter,
  Heart,
  MapPin,
  Pizza,
  Search,
  Sparkles,
  X,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/Theme";

import { Flashcard, FlashcardService, getMongolFlashcardsByCategory } from "../../services/FlashcardService";

export default function SearchScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [flashcards2, setFlashcards2] = useState<Flashcard[]>([]);
  const [flashcards3, setFlashcards3] = useState<Flashcard[]>([]);
  const [flashcards4, setFlashcards4] = useState<Flashcard[]>([]);
  const [flashcards5, setFlashcards5] = useState<Flashcard[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { width } = Dimensions.get("window");
  const cardWidth = (width - 48 - 16) / 2;

  useEffect(() => {
    if (!user) return;
    const fetchFavorites = async () => {
      const favIds = await FlashcardService.getFavoriteIds(user.uid);
      setFavorites(favIds);
    };
    fetchFavorites();
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      setFlashcards(await getMongolFlashcardsByCategory("Animals"));
      setFlashcards2(await getMongolFlashcardsByCategory("Nature"));
      setFlashcards3(await getMongolFlashcardsByCategory("Technology"));
      setFlashcards4(await getMongolFlashcardsByCategory("Food"));
      setFlashcards5(await getMongolFlashcardsByCategory("Travel"));
    };
    fetchData();
  }, []);

  const filterCards = (cards: Flashcard[]) => {
    if (!searchQuery) return cards;
    return cards.filter((card) =>
      card.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const toggleFavorite = async (id: string) => {
    if (!user) return;
    const isFav = favorites.includes(id);
    await FlashcardService.toggleFavorite(user.uid, id, !isFav);
    setFavorites((prev) =>
      isFav ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const SectionHeader = ({ icon: Icon, iconColor, title, bgColor }: { icon: React.ElementType; iconColor: string; title: string; bgColor: string; }) => (
    <View style={styles.sectionHeader}>
      <View style={[styles.sectionIcon, { backgroundColor: bgColor }]}>
        <Icon color={iconColor} size={22} />
      </View>
      <Text style={{ fontSize: 22, fontWeight: "700", color: isDark ? "#f8fafc" : "#1a1a1a" }}>
        {title}
      </Text>
    </View>
  );

  const categories = [
    { id: "All", label: t("all") || "All" },
    { id: "Animals", label: t("animals") },
    { id: "Nature", label: t("nature") },
    { id: "Technology", label: t("tech") },
    { id: "Food", label: t("food") },
    { id: "Travel", label: t("travel") },
  ];

  const sections = [
    { id: "Animals", title: "Амьтад", data: flashcards, icon: BookOpen, color: "#3b82f6", bg: "#dbeafe" },
    { id: "Nature", title: "Байгаль", data: flashcards2, icon: Sparkles, color: "#a855f7", bg: "#f3e8ff" },
    { id: "Technology", title: "Технологи", data: flashcards3, icon: BookOpen, color: "#f59e0b", bg: "#fef3c7" },
    { id: "Food", title: "Хоол", data: flashcards4, icon: Pizza, color: "#e37c78", bg: "#ffd4d1" },
    { id: "Travel", title: "Аялал", data: flashcards5, icon: MapPin, color: "#006078", bg: "#82bac4" },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? "#0f172a" : "#f8f9fa" }}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Header */}
      <View style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: Platform.OS === "ios" ? 60 : 20,
        paddingHorizontal: 24,
        paddingBottom: 20,
        backgroundColor: isDark ? "#1e293b" : "#fff",
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        marginBottom: 20,
        ...Platform.select({
          ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: isDark ? 0.3 : 0.05, shadowRadius: 8 },
          android: { elevation: 3 },
        }),
      }}>
        <View>
          <Text style={{ fontSize: 28, fontWeight: "700", color: isDark ? "#f8fafc" : "#1a1a1a", marginBottom: 4 }}>
            {t("search")}
          </Text>
          <Text style={{ fontSize: 15, color: isDark ? "#94a3b8" : "#666", fontWeight: "500" }}>
            Discover new words
          </Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: isDark ? "#374151" : "#f1f5f9",
          borderRadius: 16,
          paddingVertical: 14,
          paddingHorizontal: 18,
          borderWidth: 1,
          borderColor: isDark ? "#4b5563" : "#e2e8f0",
          height: 48,
        }}>
          <Search color={isDark ? "#9ca3af" : "#64748b"} size={22} />
          <TextInput
            placeholder={t("search_hint")}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{ flex: 1, marginLeft: 12, color: isDark ? "#f8fafc" : "#1a1a1a", fontSize: 15, fontWeight: "500" }}
            placeholderTextColor={isDark ? "#9ca3af" : "#94a3b8"}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <View style={styles.closeButton}>
                <X color={isDark ? "#9ca3af" : "#94a3b8"} size={16} />
              </View>
            </TouchableOpacity>
          )}
          <TouchableOpacity>
            <View style={{ backgroundColor: isDark ? "#1e293b" : "#fff", padding: 8, borderRadius: 10, borderWidth: 1, borderColor: isDark ? "#4b5563" : "#e2e8f0" }}>
              <Filter color="#6366f1" size={18} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Category Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10, marginBottom: 20 }} contentContainerStyle={{ gap: 10, paddingHorizontal: 24 }}>
          {categories.map((cat) => (
            <TouchableOpacity key={cat.id} onPress={() => setSelectedCategory(cat.id)}
              style={[styles.categoryPill, selectedCategory === cat.id && styles.categoryPillActive]}>
              <Text style={[styles.categoryText, selectedCategory === cat.id && styles.categoryTextActive]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {sections.map((section) => {
          const filteredCards = filterCards(section.data);
          if (selectedCategory !== "All" && selectedCategory !== section.id) return null;
          if (filteredCards.length === 0) return null;

          const isGrid = selectedCategory !== "All";

          return (
            <View key={section.id}>
              <SectionHeader icon={section.icon} iconColor={section.color} title={section.title} bgColor={section.bg} />
              {isGrid ? (
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
                  {filteredCards.map((card) => (
                    <TouchableOpacity key={card.id} style={[styles.card, { width: cardWidth, backgroundColor: isDark ? "#1e293b" : "#fff", borderColor: isDark ? "#374151" : "#e2e8f0" }]}
                      onPress={() => router.push(`/movies/${card.id}`)} activeOpacity={0.9}>
                      <Image source={FlashcardService.getLocalImage(card.image)} style={styles.cardImage} />
                      <View style={styles.cardOverlay} />
                      <TouchableOpacity style={[styles.heartIcon, favorites.includes(card.id) && styles.heartIconActive]} onPress={() => toggleFavorite(card.id)}>
                        <Heart color={favorites.includes(card.id) ? "#fff" : "#fff"} size={18} fill={favorites.includes(card.id) ? "#ef4444" : "none"} />
                      </TouchableOpacity>
                      <View style={styles.cardContent}>
                        <Text style={[styles.cardTitle, { color: isDark ? "#f8fafc" : "#1a1a1a" }]}>{card.title}</Text>
                        {card.subtitle && <Text style={styles.cardSubtitle}>{card.subtitle}</Text>}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                  {filteredCards.map((card) => (
                    <TouchableOpacity key={card.id} style={[styles.card, { backgroundColor: isDark ? "#1e293b" : "#fff", borderColor: isDark ? "#374151" : "#e2e8f0" }]}
                      onPress={() => router.push(`/movies/${card.id}`)} activeOpacity={0.9}>
                      <Image source={FlashcardService.getLocalImage(card.image)} style={styles.cardImage} />
                      <View style={styles.cardOverlay} />
                      <TouchableOpacity style={[styles.heartIcon, favorites.includes(card.id) && styles.heartIconActive]} onPress={() => toggleFavorite(card.id)}>
                        <Heart color={favorites.includes(card.id) ? "#fff" : "#fff"} size={18} fill={favorites.includes(card.id) ? "#ef4444" : "none"} />
                      </TouchableOpacity>
                      <View style={styles.cardContent}>
                        <Text style={[styles.cardTitle, { color: isDark ? "#f8fafc" : "#1a1a1a" }]}>{card.title}</Text>
                        {card.subtitle && <Text style={styles.cardSubtitle}>{card.subtitle}</Text>}
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
          );
        })}

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 60 : 20,
    paddingHorizontal: 24,
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    color: "#666",
    fontWeight: "500",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#6366f1",
    justifyContent: "center",
    alignItems: "center",
  },
  profileText: {
    fontSize: 20,
  },
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    height: 48,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: "#1a1a1a",
    fontWeight: "500",
  },
  closeButton: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 4,
    marginRight: 8,
  },
  filterButton: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  categoryContainer: {
    flexDirection: "row",
    gap: 10,
  },
  categoryPill: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#eee",
    borderRadius: 20,
  },
  categoryPillActive: {
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
  },
  categoryText: {
    color: "#555",
  },
  categoryTextActive: {
    color: "#fff",
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 16,
    gap: 12,
  },
  sectionIcon: {
    padding: 8,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  scrollContent: {
    paddingRight: 24,
  },
  card: {
    width: 160,
    height: 200,
    borderRadius: 20,
    backgroundColor: "#fff",
    marginRight: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    position: "relative",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  cardImage: {
    width: "100%",
    height: "65%",
    backgroundColor: "#f1f5f9",
  },
  cardOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "65%",
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  heartIcon: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(255,255,255,0.3)",
    backdropFilter: "blur(10px)",
    borderRadius: 20,
    padding: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  heartIconActive: {
    backgroundColor: "#ef4444",
  },
  cardContent: {
    padding: 12,
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    fontWeight: "500",
    color: "#64748b",
  },
});