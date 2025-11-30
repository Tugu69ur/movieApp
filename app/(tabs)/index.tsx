import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import {
  BookOpen,
  Heart,
  Search,
  SlidersHorizontal,
  Star,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/Theme";
import { Flashcard, FlashcardService } from "../../services/FlashcardService";

export default function Index() {
  const router = useRouter();
  const { language, changeLanguage, t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();


  // fetched data state (fallback to hardcoded lists)
  const { user } = useAuth();

  const [flashcards, setSavedAllFlashcards] = useState<Flashcard[]>([]);
  const [savedFlashcards, setSavedFlashcards] = useState<Flashcard[]>([]);
  const [todayFlashcards, setTodayFlashcards] = useState<Flashcard[]>([]);
  const [loadingCards, setLoadingCards] = useState(false);
  const [cardsError, setCardsError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!user) return;
      setLoadingCards(true);
      setCardsError(null);
      try {
        const daily = await FlashcardService.getDailyWords(user.uid);
        const favs = await FlashcardService.getFavorites(user.uid);
        if (!mounted) return;
        if (daily && daily.length > 0) setTodayFlashcards(daily);
        if (favs && favs.length > 0) setSavedFlashcards(favs);
      } catch (err) {
        console.error("Error loading flashcards:", err);
        if (mounted) setCardsError("Failed to load flashcards");
      } finally {
        if (mounted) setLoadingCards(false);
      }
    };

    load();
    return () => { mounted = false };
  }, [user]);

  useFocusEffect(
    React.useCallback(() => {
      const loadFavorites = async () => {
        if (!user) return;
        const favs = await FlashcardService.getFavorites(user.uid);
        setSavedFlashcards(favs);
      };

      loadFavorites();
    }, [user])
  );


  return (
    <View style={{ flex: 1, backgroundColor: isDark ? "#0f172a" : "#f8f9fa" }}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View
          style={{
            backgroundColor: isDark ? "#1e293b" : "#fff",
            paddingTop: Platform.OS === "ios" ? 60 : 20,
            paddingHorizontal: 24,
            paddingBottom: 24,
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isDark ? 0.3 : 0.05,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: "700",
                  color: isDark ? "#f8fafc" : "#1a1a1a",
                  marginBottom: 4,
                }}
              >
                Hi, {user?.displayName} 👋
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  color: isDark ? "#94a3b8" : "#666",
                  fontWeight: "500",
                }}
              >
                Let&apos;s learn something new today!
              </Text>
            </View>

          </View>

          {/* Search bar */}
          <TouchableOpacity
            onPress={() => router.push("/search")}
            activeOpacity={0.7}
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
            <Text
              style={{
                flex: 1,
                marginLeft: 12,
                color: isDark ? "#9ca3af" : "#64748b",
                fontSize: 15,
                fontWeight: "500",
              }}
            >
              {t("search_hint")}
            </Text>
            <View
              style={{
                backgroundColor: isDark ? "#1e293b" : "#fff",
                padding: 8,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: isDark ? "#4b5563" : "#e2e8f0",
              }}
            >
              <SlidersHorizontal
                color={isDark ? "#9ca3af" : "#64748b"}
                size={18}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* Saved Flashcards Section */}
        <View style={{ marginTop: 24, paddingHorizontal: 24 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <View
                style={{
                  backgroundColor: "#e0e7ff",
                  padding: 8,
                  borderRadius: 12,
                }}
              >
                <BookOpen color="#6366f1" size={20} />
              </View>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "700",
                  color: isDark ? "#f8fafc" : "#1a1a1a",
                }}
              >
                {t("saved_flashcards")}
              </Text>
            </View>
            <TouchableOpacity>
              <Text
                style={{ color: "#6366f1", fontWeight: "600", fontSize: 15 }}
              >
                {t("see_all")}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 24 }}
          >
            {savedFlashcards.length > 0 ? savedFlashcards.map((card, index) => (
              <TouchableOpacity
                key={card.id}
                onPress={() => router.push(`/movies/${card.id}`)}
                activeOpacity={0.95}
                style={{
                  width: 240,
                  backgroundColor: isDark ? "#1e293b" : "#fff",
                  borderRadius: 20,
                  marginRight: 16,
                  overflow: "hidden",
                  borderWidth: 1,
                  borderColor: isDark ? "#374151" : "#e2e8f0",
                  ...Platform.select({
                    ios: {
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: isDark ? 0.3 : 0.1,
                      shadowRadius: 12,
                    },
                    android: { elevation: 4 },
                  }),
                }}
              >
                <View style={{ position: "relative" }}>
                  <Image
                    source={FlashcardService.getLocalImage(card.image)} // FIX HERE
                    style={{ width: "100%", height: 150 }}
                    resizeMode="cover"
                  />
                  <View
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      backgroundColor: "rgba(0,0,0,0.5)",
                      backdropFilter: "blur(10px)",
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 12,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Star color="#ffd700" size={12} fill="#ffd700" />
                    <Text
                      style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}
                    >
                      {card.rating}
                    </Text>
                  </View>
                </View>

                <View style={{ padding: 16 }}>
                  <Text
                    style={{
                      fontSize: 17,
                      fontWeight: "700",
                      color: isDark ? "#f8fafc" : "#1a1a1a",
                      marginBottom: 6,
                    }}
                  >
                    {card.title}
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      color: "#94a3b8",
                      textTransform: "uppercase",
                      fontWeight: "600",
                      letterSpacing: 0.5,
                    }}
                  >
                    {card.category}
                  </Text>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 12,
                      paddingTop: 12,
                      borderTopWidth: 1,
                      borderTopColor: "#f1f5f9",
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "#fef2f2",
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 8,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <Heart color="#ef4444" size={14} fill="#ef4444" />
                      <Text
                        style={{
                          color: "#ef4444",
                          fontSize: 12,
                          fontWeight: "700",
                        }}
                      >
                        Saved
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )) : (
              <Text style={{ color: isDark ? "#fff" : "#000", marginLeft: 24 }}>
                No saved flashcards yet
              </Text>
            )}
          </ScrollView>

        </View>

        {/* Today's Words Section */}
        <View
          style={{ marginTop: 32, paddingHorizontal: 24, marginBottom: 48 }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <View
                style={{
                  backgroundColor: "#fef3c7",
                  padding: 8,
                  borderRadius: 12,
                }}
              >
                <BookOpen color="#f59e0b" size={20} />
              </View>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "700",
                  color: isDark ? "#f8fafc" : "#1a1a1a",
                }}
              >
                {t("today_flashcards")}
              </Text>
            </View>
            <TouchableOpacity>
              <Text
                style={{ color: "#6366f1", fontWeight: "600", fontSize: 15 }}
              >
                {t("see_all")}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 24 }}
          >
            {(todayFlashcards.length ? todayFlashcards : flashcards).map((card, index) => (
              <TouchableOpacity
                key={card.id}
                onPress={() => router.push(`/movies/${card.id}`)}
                activeOpacity={0.95}
                style={{
                  width: 240,
                  backgroundColor: isDark ? "#1e293b" : "#fff",
                  borderRadius: 20,
                  marginRight: 16,
                  overflow: "hidden",
                  borderWidth: 1,
                  borderColor: isDark ? "#374151" : "#e2e8f0",
                  ...Platform.select({
                    ios: {
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: isDark ? 0.3 : 0.1,
                      shadowRadius: 12,
                    },
                    android: {
                      elevation: 4,
                    },
                  }),
                }}
              >
                <View style={{ position: "relative" }}>
                  <Image
                    source={FlashcardService.getLocalImage(card.image)}
                    style={{ width: "100%", height: 150 }}
                    resizeMode="cover"
                  />
                  <View
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      backgroundColor: "rgba(0,0,0,0.5)",
                      backdropFilter: "blur(10px)",
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 12,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Star color="#ffd700" size={12} fill="#ffd700" />
                    <Text
                      style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}
                    >
                      {card.rating}
                    </Text>
                  </View>
                </View>

                <View style={{ padding: 16 }}>
                  <Text
                    style={{
                      fontSize: 17,
                      fontWeight: "700",
                      color: isDark ? "#f8fafc" : "#1a1a1a",
                      marginBottom: 6,
                    }}
                  >
                    {card.title}
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      color: "#94a3b8",
                      textTransform: "uppercase",
                      fontWeight: "600",
                      letterSpacing: 0.5,
                    }}
                  >
                    {card.category}
                  </Text>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 12,
                      paddingTop: 12,
                      borderTopWidth: 1,
                      borderTopColor: "#f1f5f9",
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "#fef3c7",
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 8,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <Text
                        style={{
                          color: "#f59e0b",
                          fontSize: 12,
                          fontWeight: "700",
                        }}
                      >
                        📚 Today
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}
