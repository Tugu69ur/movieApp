import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Award, Pause, Play, SkipBack, SkipForward } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useTheme } from "../../contexts/Theme";


export default function MovieDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { isDark } = useTheme();

  // example data (код доторх зурагнууд assets/steps/<id>/step-1..n.png байх ёстой)
  const data: Record<string, any> = {
    "1": {
      title: "Ишиг /ᠢᠰᠢᢉᠡ/",
      image: require("../../assets/images/goat.jpg"),
      desc: "Доорх зурах дарааллыг харна.",
      // хэрвээ 1-р картын алхмууд дараах байдлаар assets-д хадгалагдсан гэж үзнэ:
      steps: [
        require("../../assets/images/flashcards/step1.png"),
        require("../../assets/images/flashcards/step2.png"),
        require("../../assets/images/flashcards/step3.png"),
        require("../../assets/images/flashcards/step4.png"),
      ],
    },
    "2": {
      title: "Чулуу /ᠴᠢᠯᠠᠭᠤ/",
      image: require("../../assets/images/rock.jpg"),
      desc: "Чулуун бичлэгийн stroke order.",
      steps: [
        require("../../assets/images/flashcards/step1.png"),
        require("../../assets/images/flashcards/step2.png"),
        require("../../assets/images/flashcards/step3.png"),
        require("../../assets/images/flashcards/step4.png"),
      ],
    },
    "3": {
      title: "Зурагт /ᠵᠢᠷᠤᠭᠲᠤ/",
      image: require("../../assets/images/tv.jpg"),
      desc: "Зурагтын script зурах алхмууд.",
      steps: [
        require("../../assets/images/flashcards/step1.png"),
        require("../../assets/images/flashcards/step2.png"),
        require("../../assets/images/flashcards/step3.png"),
        require("../../assets/images/flashcards/step4.png"),
      ],
    },
  };

  const card = data[id as string];

  // state for step viewer
  const [current, setCurrent] = useState<number>(0);
  const [playing, setPlaying] = useState<boolean>(false);
  const intervalRef = useRef<number | null>(null);

  const stepCount = card?.steps?.length ?? 0;

  useEffect(() => {
    if (playing) {
      // start autoplay every 900ms (чамд тохируул)
      intervalRef.current = (setInterval(() => {
        setCurrent((prev) => {
          const next = prev + 1;
          if (next >= stepCount) {
            clearInterval(intervalRef.current as any);
            intervalRef.current = null;
            setPlaying(false);
            return stepCount - 1;
          }
          return next;
        });
      }, 900) as unknown) as number;
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current as any);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current as any);
        intervalRef.current = null;
      }
    };
  }, [playing, stepCount]);

  if (!card) {
    return (
      <View style={[styles.center, { backgroundColor: isDark ? "#0f172a" : "#f8f9fa" }]}>
        <Text style={{ color: isDark ? "#f8fafc" : "#1a1a1a" }}>Card not found</Text>
      </View>
    );
  }

  const onPlayToggle = () => setPlaying((p) => !p);

  return (
    <View style={[styles.container, { backgroundColor: isDark ? "#0f172a" : "#f8f9fa" }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Image */}
        <View style={styles.heroImageContainer}>
          <Image source={card.image} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.heroOverlay} />
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <View style={[styles.backButtonInner, { backgroundColor: isDark ? "#374151" : "#fff" }]}>
              <ArrowLeft size={22} color={isDark ? "#f8fafc" : "#1a1a1a"} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={[styles.contentContainer, { backgroundColor: isDark ? "#1e293b" : "#fff" }]}>
          {/* Header Info */}
          <View style={styles.headerInfo}>
            <View style={styles.titleSection}>
              <Text style={[styles.title, { color: isDark ? "#f8fafc" : "#1a1a1a" }]}>{card.title}</Text>
              <View style={styles.badgeContainer}>
                <View style={[styles.badge, {
                  backgroundColor: isDark ? "#1e40af" : "#f0f9ff",
                  borderColor: isDark ? "#3b82f6" : "#bae6fd"
                }]}>
                  <Award color="#6366f1" size={14} />
                  <Text style={[styles.badgeText, { color: isDark ? "#93c5fd" : "#0ea5e9" }]}>Mongolian Script</Text>
                </View>
              </View>
            </View>
            <Text style={[styles.desc, { color: isDark ? "#94a3b8" : "#64748b" }]}>{card.desc}</Text>
          </View>

          {/* Step-by-step Section */}
          <View style={styles.stepsSection}>
            <View style={styles.stepHeader}>
              <View style={styles.sectionTitleContainer}>
                <View style={[styles.sectionIcon, { backgroundColor: isDark ? "#374151" : "#fef3c7" }]}>
                  <Text style={styles.sectionIconText}>✍️</Text>
                </View>
                <Text style={[styles.stepTitle, { color: isDark ? "#f8fafc" : "#1a1a1a" }]}>Зурах алхмууд</Text>
              </View>

              {/* Controls */}
              <View style={styles.controls}>
                <TouchableOpacity
                  onPress={() => { setPlaying(false); setCurrent(0); }}
                  style={[styles.controlButton, {
                    backgroundColor: isDark ? "#374151" : "#fff",
                    borderColor: isDark ? "#4b5563" : "#e2e8f0"
                  }]}
                  activeOpacity={0.7}
                >
                  <SkipBack size={20} color="#6366f1" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={onPlayToggle}
                  style={[styles.controlButton, styles.playButton]}
                  activeOpacity={0.7}
                >
                  {playing ? <Pause size={24} color="#fff" /> : <Play size={24} color="#fff" />}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => { setPlaying(false); setCurrent(stepCount - 1); }}
                  style={[styles.controlButton, {
                    backgroundColor: isDark ? "#374151" : "#fff",
                    borderColor: isDark ? "#4b5563" : "#e2e8f0"
                  }]}
                  activeOpacity={0.7}
                >
                  <SkipForward size={20} color="#6366f1" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Progress Indicator */}
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { backgroundColor: isDark ? "#4b5563" : "#e2e8f0" }]}>
                <View style={[styles.progressFill, { width: `${((current + 1) / stepCount) * 100}%` }]} />
              </View>
              <Text style={[styles.progressText, { color: isDark ? "#94a3b8" : "#64748b" }]}>Step {current + 1} of {stepCount}</Text>
            </View>

            {/* Large step preview */}
            <View style={styles.previewWrapper}>
              {stepCount > 0 ? (
                <View style={[styles.previewCard, {
                  backgroundColor: isDark ? "#374151" : "#fff",
                  borderColor: isDark ? "#4b5563" : "#e2e8f0"
                }]}>
                  <Image source={card.steps[current]} style={styles.previewImage} resizeMode="contain" />
                </View>
              ) : (
                <View style={[styles.noSteps, { backgroundColor: isDark ? "#374151" : "#f1f5f9" }]}>
                  <Text style={[styles.noStepsText, { color: isDark ? "#9ca3af" : "#94a3b8" }]}>No step images available</Text>
                </View>
              )}
            </View>

            {/* Horizontal step thumbnails */}
            <FlatList
              data={card.steps}
              horizontal
              keyExtractor={(_, idx) => String(idx)}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.thumbnailsContainer}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => { setPlaying(false); setCurrent(index); }}
                  activeOpacity={0.8}
                  style={[
                    styles.thumbWrap,
                    current === index && styles.thumbWrapActive,
                  ]}
                >
                  <View style={[
                    styles.thumbInner,
                    {
                      backgroundColor: isDark ? "#4b5563" : "#f1f5f9",
                      borderColor: isDark ? "#6b7280" : "#e2e8f0"
                    },
                    current === index && styles.thumbInnerActive
                  ]}>
                    <Image source={item} style={styles.thumb} resizeMode="cover" />
                  </View>
                  <Text style={[
                    styles.stepLabel,
                    { color: isDark ? "#9ca3af" : "#94a3b8" },
                    current === index && styles.stepLabelActive
                  ]}>
                    {index + 1}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </View>
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
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  backButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 20,
    left: 20,
    zIndex: 10,
  },
  backButtonInner: {
    backgroundColor: "#fff",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  contentContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 32,
    paddingHorizontal: 24,
    minHeight: "100%",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  headerInfo: {
    marginBottom: 32,
  },
  titleSection: {
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  badgeContainer: {
    flexDirection: "row",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#f0f9ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#bae6fd",
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0ea5e9",
  },
  desc: {
    color: "#64748b",
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500",
  },
  stepsSection: {
    marginBottom: 24,
  },
  stepHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#fef3c7",
    justifyContent: "center",
    alignItems: "center",
  },
  sectionIconText: {
    fontSize: 20,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  controlButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  playButton: {
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
    width: 56,
    height: 56,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#e2e8f0",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#6366f1",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748b",
    textAlign: "right",
  },
  previewWrapper: {
    marginBottom: 20,
  },
  previewCard: {
    width: "100%",
    height: 280,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#e2e8f0",
    overflow: "hidden",
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
  previewImage: {
    width: "100%",
    height: "100%",
  },
  noSteps: {
    justifyContent: "center",
    alignItems: "center",
    height: 280,
    backgroundColor: "#f1f5f9",
    borderRadius: 20,
  },
  noStepsText: {
    color: "#94a3b8",
    fontSize: 16,
    fontWeight: "600",
  },
  thumbnailsContainer: {
    paddingVertical: 8,
  },
  thumbWrap: {
    marginRight: 12,
    alignItems: "center",
  },
  thumbWrapActive: {
    transform: [{ scale: 1.05 }],
  },
  thumbInner: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: "#f1f5f9",
    borderWidth: 2,
    borderColor: "#e2e8f0",
    overflow: "hidden",
    marginBottom: 8,
  },
  thumbInnerActive: {
    borderColor: "#6366f1",
    backgroundColor: "#eff6ff",
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  thumb: {
    width: "100%",
    height: "100%",
  },
  stepLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#94a3b8",
  },
  stepLabelActive: {
    color: "#6366f1",
    fontWeight: "700",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  headerRow: {
    height: 44,
    justifyContent: "center"
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 12
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 8
  },
});
