import { Flashcard, FlashcardService } from "@/services/FlashcardService";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Award } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../contexts/Theme";

export default function MovieDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { isDark } = useTheme();

  const [card, setCard] = useState<Flashcard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCard = async () => {
      if (id) {
        const cardId = Array.isArray(id) ? id[0] : id;
        const data = await FlashcardService.getCardById(cardId);
        setCard(data);
      }
      setLoading(false);
    };
    fetchCard();
  }, [id]);

  const parsedLabels = React.useMemo(() => {
    const rawTitle = card?.title?.trim() || "";
    const slashMatch = rawTitle.match(/^([^/]+)\/([^/]+)\/?$/);

    if (slashMatch) {
      return {
        cyrillic: slashMatch[1].trim(),
        mongolian: slashMatch[2].trim(),
      };
    }

    return {
      cyrillic: rawTitle,
      mongolian: "",
    };
  }, [card?.title]);

  if (loading) {
    return (
      <View
        style={[
          styles.center,
          { backgroundColor: isDark ? "#0f172a" : "#f8f9fa" },
        ]}
      >
        <Text style={{ color: isDark ? "#f8fafc" : "#1a1a1a" }}>
          Loading...
        </Text>
      </View>
    );
  }

  if (!card) {
    return (
      <View
        style={[
          styles.center,
          { backgroundColor: isDark ? "#0f172a" : "#f8f9fa" },
        ]}
      >
        <Text style={{ color: isDark ? "#f8fafc" : "#1a1a1a" }}>
          Card not found
        </Text>
      </View>
    );
  }

  const cardTitle =
    parsedLabels.cyrillic ||
    parsedLabels.mongolian ||
    card.english ||
    "Flashcard";

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? "#0b1120" : "#f8fafc" },
      ]}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.heroImageContainer}>
          <Image
            source={FlashcardService.getLocalImage(card.image)}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay} />

          <View style={styles.heroTextContainer}>
            <Text
              style={[
                styles.heroTitle,
                { color: isDark ? "#f8fafc" : "#111827" },
              ]}
            >
              {cardTitle}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <View
              style={[
                styles.backButtonInner,
                {
                  backgroundColor: isDark
                    ? "rgba(15,23,42,0.9)"
                    : "rgba(255,255,255,0.9)",
                },
              ]}
            >
              <ArrowLeft size={22} color={isDark ? "#f8fafc" : "#1a1a1a"} />
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.contentContainer,
            { backgroundColor: isDark ? "#0f172a" : "#ffffff" },
          ]}
        >
          <View style={styles.cardHeader}>
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.cardTitle,
                  { color: isDark ? "#f8fafc" : "#111827", marginTop: 20 },
                ]}
              >
                Flashcard Overview
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.badge,
                {
                  backgroundColor: isDark ? "#1e3a8a" : "#eff6ff",
                  borderColor: isDark ? "#3b82f6" : "#bfdbfe",
                },
              ]}
            >
              <Award color="#6366f1" size={14} />
              <Text
                style={[
                  styles.badgeText,
                  { color: isDark ? "#93c5fd" : "#1d4ed8", marginLeft: 6 },
                ]}
              >
                Flashcard
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.detailGrid}>
            <View
              style={[
                styles.detailPill,
                {
                  backgroundColor: isDark ? "#1e293b" : "#f1f5f9",
                  borderColor: isDark ? "#3b82f6" : "#93c5fd",
                  borderLeftColor: "#3b82f6",
                  borderLeftWidth: 4,
                },
              ]}
            >
              <Text
                style={[
                  styles.detailLabel,
                  { color: isDark ? "#60a5fa" : "#1e40af" },
                ]}
              >
                Cyrillic
              </Text>
              <Text
                style={[
                  styles.detailValue,
                  { color: isDark ? "#f0f9ff" : "#0c1e3e" },
                ]}
              >
                {parsedLabels.cyrillic || "-"}
              </Text>
            </View>
            <View
              style={[
                styles.detailPill,
                {
                  backgroundColor: isDark ? "#1e293b" : "#f1f5f9",
                  borderColor: isDark ? "#8b5cf6" : "#c4b5fd",
                  borderLeftColor: "#8b5cf6",
                  borderLeftWidth: 4,
                },
              ]}
            >
              <Text
                style={[
                  styles.detailLabel,
                  { color: isDark ? "#a78bfa" : "#6d28d9" },
                ]}
              >
                Mongolian
              </Text>
              <Text
                style={[
                  styles.detailValue,
                  { color: isDark ? "#f3e8ff" : "#0c1e3e" },
                ]}
              >
                {parsedLabels.mongolian || "-"}
              </Text>
            </View>
            {card.english ? (
              <View
                style={[
                  styles.detailPill,
                  {
                    backgroundColor: isDark ? "#1e293b" : "#f1f5f9",
                    borderColor: isDark ? "#10b981" : "#6ee7b7",
                    borderLeftColor: "#10b981",
                    borderLeftWidth: 4,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.detailLabel,
                    { color: isDark ? "#6ee7b7" : "#065f46" },
                  ]}
                >
                  English
                </Text>
                <Text
                  style={[
                    styles.detailValue,
                    { color: isDark ? "#ecfdf5" : "#0c1e3e" },
                  ]}
                >
                  {card.english}
                </Text>
              </View>
            ) : null}
          </View>

          <TouchableOpacity
            style={[
              styles.primaryButton,
              {
                backgroundColor: isDark ? "#3b82f6" : "#4f46e5",
              },
            ]}
            onPress={() => router.back()}
          >
            <Text style={styles.primaryButtonText}>← Return to Cards</Text>
          </TouchableOpacity>

          <View style={{ height: 32 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroImageContainer: {
    height: 300,
    position: "relative",
    marginBottom: -40,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(15,23,42,0.45)",
  },
  heroTextContainer: {
    position: "absolute",
    bottom: 24,
    left: 24,
    right: 24,
    zIndex: 2,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "900",
    marginTop: 10,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  heroCaption: {
    marginTop: 12,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "500",
  },
  backButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 24,
    left: 20,
    zIndex: 10,
  },
  backButtonInner: {
    width: 44,
    height: 44,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  contentContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 32,
    paddingHorizontal: 24,
    minHeight: "100%",
    marginTop: -38,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -8 },
        shadowOpacity: 0.12,
        shadowRadius: 32,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  cardSubtitle: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "500",
  },
  badgeContainer: {
    flexDirection: "row",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  desc: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500",
  },
  sectionBlock: {
    marginTop: 20,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "500",
  },
  flashcardShell: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 16,
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  flashcardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  detailGrid: {
    flexDirection: "column",
  },
  detailPill: {
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    marginBottom: 14,
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  detailValue: {
    marginTop: 8,
    fontSize: 19,
    fontWeight: "800",
    lineHeight: 26,
  },
  primaryButton: {
    marginTop: 32,
    borderRadius: 16,
    paddingVertical: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 8,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: 0.4,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerRow: {
    height: 44,
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 8,
  },
});
