import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  PanResponder,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Path, Rect } from "react-native-svg";
import ViewShot, { captureRef } from "react-native-view-shot";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/Theme";

export default function DrawScreen() {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const OCR_API_BASE =
    process.env.EXPO_PUBLIC_OCR_API_BASE_URL?.replace(/\/$/, "") || "";

  const [paths, setPaths] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState<string>("");
  const [savedImageUri, setSavedImageUri] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [apiReady, setApiReady] = useState(false);
  const viewShotRef = useRef<any>(null);

  useEffect(() => {
    if (!OCR_API_BASE) {
      setApiReady(false);
      return;
    }

    let mounted = true;
    const checkApi = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        const res = await fetch(`${OCR_API_BASE}/ocr`, {
          method: "HEAD",
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (mounted) setApiReady(res.ok || res.status === 405);
      } catch {
        if (mounted) setApiReady(false);
      }
    };

    checkApi();
    return () => {
      mounted = false;
    };
  }, [OCR_API_BASE]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        setIsDrawing(true);
        const x = evt.nativeEvent.locationX;
        const y = evt.nativeEvent.locationY;
        setCurrentPath(`M${x},${y}`);
      },
      onPanResponderMove: (evt) => {
        const x = evt.nativeEvent.locationX;
        const y = evt.nativeEvent.locationY;
        setCurrentPath((prev) => `${prev} L${x},${y}`);
      },
      onPanResponderRelease: () => {
        setIsDrawing(false);
      },
      onPanResponderTerminate: () => {
        setIsDrawing(false);
      },
    }),
  ).current;

  const addPath = () => {
    if (currentPath.length > 0) {
      setPaths((prev) => [...prev, currentPath]);
      setCurrentPath("");
    }
  };

  const saveAsJPEG = async () => {
    if (currentPath.length > 0) addPath();
    const uri = await captureRef(viewShotRef, {
      format: "jpg",
      quality: 1,
      result: "tmpfile",
      width: 64,
      height: 64,
    });
    setSavedImageUri(uri);
  };

  const predict = async () => {
    if (!OCR_API_BASE) {
      Alert.alert(
        "OCR URL Missing",
        "Set EXPO_PUBLIC_OCR_API_BASE_URL in .env and restart Expo.",
      );
      return;
    }
    if (!savedImageUri) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", {
        uri: savedImageUri,
        name: "handwriting.jpg",
        type: "image/jpeg",
      } as any);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      const res = await fetch(`${OCR_API_BASE}/ocr`, {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const raw = await res.text();
      if (!res.ok) {
        throw new Error(`OCR failed (${res.status}): ${raw.slice(0, 120)}`);
      }

      let json: Record<string, any> | null = null;
      if (raw.trim().startsWith("{") || raw.trim().startsWith("[")) {
        try {
          json = JSON.parse(raw);
        } catch {
          json = null;
        }
      }

      const resultText =
        (typeof json?.result === "string" && json.result) ||
        (typeof json?.prediction === "string" && json.prediction) ||
        (typeof json?.label === "string" && json.label) ||
        raw;

      setPrediction(resultText || "No result");
    } catch (err) {
      console.error("Prediction failed:", err);
      Alert.alert(
        "OCR Error",
        err instanceof Error ? err.message : "Failed to predict.",
      );
    } finally {
      setLoading(false);
    }
  };

  const clearCanvas = () => {
    setPaths([]);
    setCurrentPath("");
    setSavedImageUri(null);
    setPrediction(null);
  };

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? "#0f172a" : "#f8f9fa" }}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        scrollEnabled={!isDrawing}
      >
        <View
          style={{
            backgroundColor: isDark ? "#1e293b" : "#8b5cf6",
            paddingTop: Platform.OS === "ios" ? 60 : 20,
            paddingHorizontal: 24,
            paddingBottom: 24,
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
            marginBottom: 20,
            ...Platform.select({
              ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: isDark ? 0.4 : 0.2,
                shadowRadius: 12,
              },
              android: {
                elevation: 8,
              },
            }),
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <View
              style={{
                backgroundColor: isDark ? "#8b5cf6" : "#ffffff",
                padding: 10,
                borderRadius: 16,
                marginRight: 12,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <MaterialIcons
                name="gesture"
                size={24}
                color={isDark ? "#ffffff" : "#8b5cf6"}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 32,
                  fontWeight: "800",
                  color: "#ffffff",
                  letterSpacing: -0.5,
                  marginBottom: 2,
                }}
              >
                {t("handwritten")}
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  color: isDark ? "#cbd5e1" : "#ede9fe",
                  fontWeight: "600",
                  letterSpacing: 0.3,
                }}
              >
                Монгол бичиг зурах
              </Text>
            </View>
          </View>
          <View
            style={{
              backgroundColor: isDark ? "#374151" : "rgba(255, 255, 255, 0.25)",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: isDark ? "#4b5563" : "rgba(255, 255, 255, 0.4)",
              alignSelf: "flex-start",
            }}
          >
            {apiReady ? (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <View style={styles.statusDot} />
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    color: isDark ? "#10b981" : "#ffffff",
                  }}
                >
                  {t("model_ready")}
                </Text>
              </View>
            ) : (
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "600",
                  color: isDark ? "#f59e0b" : "#ffffff",
                }}
              >
                {t("model_loading")}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.canvasSection}>
          <View style={styles.sectionHeader}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: isDark ? "#f8fafc" : "#1a1a1a",
              }}
            >
              {t("drawing_canvas")}
            </Text>
            <TouchableOpacity onPress={clearCanvas} style={styles.clearButton}>
              <Ionicons name="trash-outline" size={20} color="#ef4444" />
              <Text style={styles.clearText}>{t("clear")}</Text>
            </TouchableOpacity>
          </View>

          <ViewShot ref={viewShotRef} style={styles.canvasWrapper}>
            <Svg width={350} height={350}>
              <Rect x={0} y={0} width={350} height={350} fill="#fff" />
              {paths.map((p, i) => (
                <Path
                  key={i}
                  d={p}
                  stroke="#1a1a1a"
                  strokeWidth={16}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}
              {currentPath.length > 0 && (
                <Path
                  d={currentPath}
                  stroke="#1a1a1a"
                  strokeWidth={16}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </Svg>
            <View
              style={StyleSheet.absoluteFill}
              {...panResponder.panHandlers}
            />
          </ViewShot>

          <TouchableOpacity
            style={styles.finishButton}
            onPress={addPath}
            activeOpacity={0.8}
          >
            <MaterialIcons name="gesture" size={20} color="#fff" />
            <Text style={styles.finishButtonText}>{t("finish_stroke")}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButton]}
            onPress={saveAsJPEG}
            disabled={!paths.length && !currentPath}
            activeOpacity={0.8}
          >
            <Ionicons name="save-outline" size={22} color="#fff" />
            <Text style={styles.actionButtonText}>Дарах</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.predictButton]}
            disabled={!savedImageUri || loading}
            onPress={predict}
            activeOpacity={0.8}
          >
            <Ionicons name="analytics-outline" size={22} color="#fff" />
            <Text style={styles.actionButtonText}>Таамаглах</Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6366f1" />
            <Text style={styles.loadingText}>Processing...</Text>
          </View>
        )}

        {savedImageUri && (
          <View
            style={{
              marginHorizontal: 24,
              marginBottom: 24,
              backgroundColor: isDark ? "#1e293b" : "#fff",
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: isDark ? "#374151" : "#e2e8f0",
            }}
          >
            <View style={styles.previewHeader}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: isDark ? "#f8fafc" : "#1a1a1a",
                }}
              >
                Captured Image
              </Text>
              <TouchableOpacity onPress={() => setSavedImageUri(null)}>
                <Ionicons
                  name="close-circle-outline"
                  size={24}
                  color="#64748b"
                />
              </TouchableOpacity>
            </View>
            <Image
              source={{ uri: savedImageUri }}
              style={styles.previewImage}
            />
          </View>
        )}

        {prediction && !loading && (
          <View
            style={{
              marginHorizontal: 24,
              marginBottom: 24,
              backgroundColor: isDark ? "#1e293b" : "#fff",
              borderRadius: 16,
              padding: 20,
              borderWidth: 1,
              borderColor: "#10b981",
              ...Platform.select({
                ios: {
                  shadowColor: "#10b981",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: isDark ? 0.3 : 0.1,
                  shadowRadius: 8,
                },
                android: {
                  elevation: 4,
                },
              }),
            }}
          >
            <View style={styles.resultHeader}>
              <Ionicons name="checkmark-circle" size={28} color="#10b981" />
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: isDark ? "#f8fafc" : "#1a1a1a",
                }}
              >
                Prediction Result
              </Text>
            </View>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: isDark ? "#cbd5e1" : "#334155",
              }}
            >
              {prediction}
            </Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10b981",
  },
  canvasSection: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#fef2f2",
    borderRadius: 12,
  },
  clearText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#ef4444",
  },
  canvasWrapper: {
    width: 350,
    height: 350,
    borderWidth: 2,
    borderColor: "#e2e8f0",
    borderRadius: 20,
    backgroundColor: "#fff",
    marginBottom: 16,
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
  finishButton: {
    backgroundColor: "#6366f1",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  finishButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    marginHorizontal: 24,
    marginBottom: 24,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  primaryButton: {
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
  },
  predictButton: {
    backgroundColor: "#10b981",
    borderColor: "#10b981",
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },
  loadingContainer: {
    alignItems: "center",
    marginVertical: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },
  previewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  previewImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e2e8f0",
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
});
