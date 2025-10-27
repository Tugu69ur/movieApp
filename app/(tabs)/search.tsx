import {
  BookOpen,
  Filter,
  Heart,
  Search,
  Sparkles,
  X,
} from "lucide-react-native";
import React, { useState } from "react";
import {
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
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/Theme";

export default function SearchScreen() {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]);

  const flashcards = [
    {
      id: 1,
      title: "Ишиг",
      subtitle: "Goat",
      image: "https://picsum.photos/200/300?random=1",
      category: "Animals",
    },
    {
      id: 2,
      title: "Чулуу",
      subtitle: "Stone",
      image: "https://picsum.photos/200/300?random=2",
      category: "Nature",
    },
    {
      id: 3,
      title: "Зурагт",
      subtitle: "TV",
      image: "https://picsum.photos/200/300?random=3",
      category: "Technology",
    },
  ];
  const flashcards2 = [
    {
      id: 7,
      title: "Тэмээ",
      subtitle: "Camel",
      image: "https://picsum.photos/200/300?random=7",
      category: "Animals",
    },
    {
      id: 8,
      title: "Мод",
      subtitle: "Tree",
      image: "https://picsum.photos/200/300?random=8",
      category: "Nature",
    },
    {
      id: 9,
      title: "Гэр",
      subtitle: "Home",
      image: "https://picsum.photos/200/300?random=9",
      category: "Places",
    },
  ];
  const flashcards3 = [
    {
      id: 10,
      title: "Computer",
      subtitle: "Компьютер",
      image: "https://picsum.photos/200/300?random=10",
      category: "Technology",
    },
    {
      id: 11,
      title: "Phone",
      subtitle: "Утас",
      image: "https://picsum.photos/200/300?random=11",
      category: "Technology",
    },
    {
      id: 12,
      title: "Table",
      subtitle: "Ширээ",
      image: "https://picsum.photos/200/300?random=12",
      category: "Furniture",
    },
  ];

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const SectionHeader = ({
    icon: Icon,
    iconColor,
    title,
    bgColor,
  }: {
    icon: React.ElementType;
    iconColor: string;
    title: string;
    bgColor: string;
  }) => (
    <View style={styles.sectionHeader}>
      <View style={[styles.sectionIcon, { backgroundColor: bgColor }]}>
        <Icon color={iconColor} size={22} />
      </View>
      <Text
        style={{
          fontSize: 22,
          fontWeight: "700",
          color: isDark ? "#f8fafc" : "#1a1a1a",
        }}
      >
        {title}
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? "#0f172a" : "#f8f9fa" }}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Header */}
      <View
        style={{
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
            ios: {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: isDark ? 0.3 : 0.05,
              shadowRadius: 8,
            },
            android: {
              elevation: 3,
            },
          }),
        }}
      >
        <View>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "700",
              color: isDark ? "#f8fafc" : "#1a1a1a",
              marginBottom: 4,
            }}
          >
            {t("search")}
          </Text>
          <Text
            style={{
              fontSize: 15,
              color: isDark ? "#94a3b8" : "#666",
              fontWeight: "500",
            }}
          >
            Discover new words
          </Text>
        </View>
        <View style={styles.profileContainer}>
          <View style={styles.profileBadge}>
            <Text style={styles.profileText}>👤</Text>
          </View>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: isDark ? "#374151" : "#f1f5f9",
            borderRadius: 16,
            paddingVertical: 14,
            paddingHorizontal: 18,
            borderWidth: 1,
            borderColor: isDark ? "#4b5563" : "#e2e8f0",
            height: 48,
          }}
        >
          <Search color={isDark ? "#9ca3af" : "#64748b"} size={22} />
          <TextInput
            placeholder={t("search_hint")}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{
              flex: 1,
              marginLeft: 12,
              color: isDark ? "#f8fafc" : "#1a1a1a",
              fontSize: 15,
              fontWeight: "500",
            }}
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
            <View
              style={{
                backgroundColor: isDark ? "#1e293b" : "#fff",
                padding: 8,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: isDark ? "#4b5563" : "#e2e8f0",
              }}
            >
              <Filter color="#6366f1" size={18} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Category Pills */}
        <View style={styles.categoryContainer}>
          <View style={[styles.categoryPill, styles.categoryPillActive]}>
            <Text style={[styles.categoryText, styles.categoryTextActive]}>
              {t("all")}
            </Text>
          </View>
          <View style={styles.categoryPill}>
            <Text style={styles.categoryText}>{t("animals")}</Text>
          </View>
          <View style={styles.categoryPill}>
            <Text style={styles.categoryText}>{t("nature")}</Text>
          </View>
          <View style={styles.categoryPill}>
            <Text style={styles.categoryText}>{t("tech")}</Text>
          </View>
        </View>

        {/* Section 1 */}
        <SectionHeader
          icon={BookOpen}
          iconColor="#3b82f6"
          title="Өдөр тутмын үгс"
          bgColor="#dbeafe"
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {flashcards.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={{
                width: 160,
                height: 200,
                borderRadius: 20,
                backgroundColor: isDark ? "#1e293b" : "#fff",
                marginRight: 16,
                overflow: "hidden",
                borderWidth: 1,
                borderColor: isDark ? "#374151" : "#e2e8f0",
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
              }}
              onPress={() => console.log("Pressed:", card.title)}
              activeOpacity={0.9}
            >
              <Image source={{ uri: card.image }} style={styles.cardImage} />
              <View style={styles.cardOverlay} />
              <TouchableOpacity
                style={[
                  styles.heartIcon,
                  favorites.includes(card.id) && styles.heartIconActive,
                ]}
                onPress={() => toggleFavorite(card.id)}
              >
                <Heart
                  color={favorites.includes(card.id) ? "#fff" : "#fff"}
                  size={18}
                  fill={favorites.includes(card.id) ? "#ef4444" : "none"}
                />
              </TouchableOpacity>
              <View style={styles.cardContent}>
                <Text
                  style={[
                    styles.cardTitle,
                    { color: isDark ? "#f8fafc" : "#1a1a1a" },
                  ]}
                >
                  {card.title}
                </Text>
                <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Section 2 */}
        <SectionHeader
          icon={Sparkles}
          iconColor="#a855f7"
          title="Өвөрмөц бичлэгтэй үгс"
          bgColor="#f3e8ff"
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {flashcards2.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={[
                styles.card,
                {
                  backgroundColor: isDark ? "#1e293b" : "#fff",
                  borderColor: isDark ? "#374151" : "#e2e8f0",
                },
              ]}
              activeOpacity={0.9}
            >
              <Image source={{ uri: card.image }} style={styles.cardImage} />
              <View style={styles.cardOverlay} />
              <TouchableOpacity
                style={[
                  styles.heartIcon,
                  favorites.includes(card.id) && styles.heartIconActive,
                ]}
                onPress={() => toggleFavorite(card.id)}
              >
                <Heart
                  color={favorites.includes(card.id) ? "#fff" : "#fff"}
                  size={18}
                  fill={favorites.includes(card.id) ? "#ef4444" : "none"}
                />
              </TouchableOpacity>
              <View style={styles.cardContent}>
                <Text
                  style={[
                    styles.cardTitle,
                    { color: isDark ? "#f8fafc" : "#1a1a1a" },
                  ]}
                >
                  {card.title}
                </Text>
                <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Section 3 */}
        <SectionHeader
          icon={BookOpen}
          iconColor="#f59e0b"
          title="Гадаад үгс"
          bgColor="#fef3c7"
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {flashcards3.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={[
                styles.card,
                {
                  backgroundColor: isDark ? "#1e293b" : "#fff",
                  borderColor: isDark ? "#374151" : "#e2e8f0",
                },
              ]}
              activeOpacity={0.9}
            >
              <Image source={{ uri: card.image }} style={styles.cardImage} />
              <View style={styles.cardOverlay} />
              <TouchableOpacity
                style={[
                  styles.heartIcon,
                  favorites.includes(card.id) && styles.heartIconActive,
                ]}
                onPress={() => toggleFavorite(card.id)}
              >
                <Heart
                  color={favorites.includes(card.id) ? "#fff" : "#fff"}
                  size={18}
                  fill={favorites.includes(card.id) ? "#ef4444" : "none"}
                />
              </TouchableOpacity>
              <View style={styles.cardContent}>
                <Text
                  style={[
                    styles.cardTitle,
                    { color: isDark ? "#f8fafc" : "#1a1a1a" },
                  ]}
                >
                  {card.title}
                </Text>
                <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

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
    marginBottom: 4,
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  categoryPillActive: {
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
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
