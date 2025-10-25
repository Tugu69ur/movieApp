import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  Pause,
  Play,
  SkipBack,
  SkipForward,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { DarkTheme, LightTheme } from "@/constants/theme";
import { useTheme } from "@/contexts/Theme";

const SCREEN_W = Dimensions.get("window").width;

export default function MovieDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const { theme } = useTheme();
  const currentTheme = theme === "dark" ? DarkTheme : LightTheme;

  // example data (код доторх зурагнууд assets/steps/<id>/step-1..n.png байх ёстой)
  const data: Record<string, any> = {
    "1": {
      title: "Ишиг /ᠢᠰᠢᠭ/",
      image: require("../../assets/images/goat.jpg"), // үгийн зураг
      desc: "Энэ бол ишигний тухай үг. Доор бичгийн зурах дарааллыг харна.",
      steps: [
        require("../../assets/images/flashcards/i.png"), // 'ᠢ'
        require("../../assets/images/flashcards/sh.png"), // 'ᠰ'
        require("../../assets/images/flashcards/ii.png"), // 'ᠢ'
        require("../../assets/images/flashcards/g.png"), // 'ᠭ'
      ],
    },
    "2": {
      title: "Чулуу /ᠴᠢᠯᠠᠭᠤ/",
      image: require("../../assets/images/rock.jpg"),
      desc: "Чулуун бичлэгийн stroke order.",
      steps: [
        require("../../assets/images/eguu.png"),
        require("../../assets/images/eguu.png"),
      ],
    },
    "3": {
      title: "Зурагт /ᠵᠢᠷᠤᠭᠲᠤ/",
      image: require("../../assets/images/tv.jpg"),
      desc: "Зурагтын script зурах алхмууд.",
      steps: [
        require("../../assets/images/eguu.png"),
        require("../../assets/images/eguu.png"),
        require("../../assets/images/eguu.png"),
        require("../../assets/images/eguu.png"),
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
      intervalRef.current = setInterval(() => {
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
      }, 900) as unknown as number;
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
      <View style={styles.center}>
        <Text>Card not found</Text>
      </View>
    );
  }

  const goPrev = () => setCurrent((c) => Math.max(0, c - 1));
  const goNext = () => setCurrent((c) => Math.min(stepCount - 1, c + 1));
  const onPlayToggle = () => setPlaying((p) => !p);

  return (
    <View
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      {/* Header / back */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={22} color="#333" />
        </TouchableOpacity>
      </View>

      <Image source={card.image} style={styles.image} />
      <Text style={[styles.title, { color: currentTheme.text }]}>
        {card.title}
      </Text>
      <Text style={[styles.desc, { color: currentTheme.secondaryText }]}>
        {card.desc}
      </Text>

      {/* Divider */}
      <View
        style={[styles.divider, { backgroundColor: currentTheme.background }]}
      />

      {/* Step-by-step title */}
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>Бичгийн зурах алхмууд</Text>
        <View style={styles.controls}>
          <TouchableOpacity
            onPress={() => {
              setPlaying(false);
              setCurrent(0);
            }}
          >
            <SkipBack size={18} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onPlayToggle}
            style={{ marginHorizontal: 12 }}
          >
            {playing ? <Pause size={20} /> : <Play size={20} />}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setPlaying(false);
              setCurrent(stepCount - 1);
            }}
          >
            <SkipForward size={18} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Large step preview */}
      <View style={styles.previewWrapper}>
        {stepCount > 0 ? (
          <Image
            source={card.steps[current]}
            style={styles.previewImage}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.noSteps}>
            <Text>Алхамын зураг байхгүй</Text>
          </View>
        )}
      </View>

      {/* Horizontal step thumbnails */}
      <FlatList
        data={card.steps}
        horizontal
        keyExtractor={(_, idx) => String(idx)}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 10 }}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => {
              setPlaying(false);
              setCurrent(index);
            }}
            style={[
              styles.thumbWrap,
              current === index && { borderColor: "#007aff", borderWidth: 2 },
            ]}
          >
            <Image source={item} style={styles.thumb} resizeMode="cover" />
            <Text style={styles.stepLabel}>Алхам {index + 1}</Text>
          </TouchableOpacity>
        )}
      />

      {/* bottom spacing */}
      <View style={{ height: 40 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  headerRow: { height: 44, justifyContent: "center" },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
    marginTop: 30,
  },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 6 },
  desc: { color: "#444", fontSize: 16, lineHeight: 22, marginBottom: 12 },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 8 },
  stepHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stepTitle: { fontSize: 18, fontWeight: "600" },
  controls: { flexDirection: "row", alignItems: "center" },
  previewWrapper: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    backgroundColor: "#fafafa",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  previewImage: { width: "92%", height: "92%" },
  noSteps: { justifyContent: "center", alignItems: "center" },
  thumbWrap: { marginRight: 12, alignItems: "center" },
  thumb: { width: 80, height: 80, borderRadius: 8 },
  stepLabel: { marginTop: 6, fontSize: 12, color: "#666" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
