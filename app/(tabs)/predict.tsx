import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
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
  const [paths, setPaths] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState<string>("");
  const [savedBase64, setSavedBase64] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const viewShotRef = useRef<any>(null);
  const modelRef = useRef<tf.LayersModel | null>(null);

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
    const base64Data = await captureRef(viewShotRef, {
      format: "jpg",
      quality: 1,
      result: "base64",
      width: 64,
      height: 64,
    });
    setSavedBase64(`data:image/jpeg;base64,${base64Data}`);
  };

  // Convert base64 JPEG → Tensor
  const base64ToTensor = (base64: string) => {
    const raw = tf.util.encodeString(base64.split(",")[1], "base64").buffer;
    const u8 = new Uint8Array(raw);
    return decodeJpeg(u8, 3) // ✅ Decode JPEG
      .resizeBilinear([64, 64])
      .div(tf.scalar(255))
      .expandDims(0);
  };

  // const predict = async () => {
  //   if (!savedBase64 || !modelRef.current) return;
  //   try {
  //     const tensor = await base64ToTensor(savedBase64);
  //     const output = modelRef.current.predict(tensor) as tf.Tensor;
  //     const probs = Array.from(tf.softmax(output).dataSync());
  //     const topIndex = probs.indexOf(Math.max(...probs));
  //     setPrediction(
  //       `${CLASS_NAMES[topIndex]} (${(probs[topIndex] * 2500).toFixed(2)}%)`
  //     );
  //   } catch (err) {
  //     console.error("Prediction failed:", err);
  //   }
  // };

  const clearCanvas = () => {
    setPaths([]);
    setCurrentPath("");
    setSavedBase64(null);
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
        {/* Header */}
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
            {modelRef.current ? (
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

        {/* Canvas */}
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

        {/* Action Buttons */}
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
            disabled={!savedBase64 || loading}
            activeOpacity={0.8}
          >
            <Ionicons name="analytics-outline" size={22} color="#fff" />
            <Text style={styles.actionButtonText}>Таамаглах</Text>
          </TouchableOpacity>
        </View>

        {/* Loading */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6366f1" />
            <Text style={styles.loadingText}>Processing...</Text>
          </View>
        )}

        {/* Preview */}
        {savedBase64 && (
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
              <TouchableOpacity onPress={() => setSavedBase64(null)}>
                <Ionicons
                  name="close-circle-outline"
                  size={24}
                  color="#64748b"
                />
              </TouchableOpacity>
            </View>
            <Image source={{ uri: savedBase64 }} style={styles.previewImage} />
          </View>
        )}

        {/* Prediction Result */}
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
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "ios" ? 60 : 20,
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    color: "#64748b",
    fontWeight: "500",
  },
  statusContainer: {
    marginTop: 8,
  },
  statusBadge: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10b981",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#10b981",
  },
  statusTextLoading: {
    fontSize: 12,
    fontWeight: "600",
    color: "#f59e0b",
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
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
    ...Platform.select({
      ios: {
        shadowColor: "#6366f1",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
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
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
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
  previewContainer: {
    marginHorizontal: 24,
    marginBottom: 24,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  previewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  previewImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e2e8f0",
  },
  resultContainer: {
    marginHorizontal: 24,
    marginBottom: 24,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#10b981",
    ...Platform.select({
      ios: {
        shadowColor: "#10b981",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  resultText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#334155",
  },
});
