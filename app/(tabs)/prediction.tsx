import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
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

/**
 * OCR Service Status:
 * - Primary: https://ocrapi-u3ds.onrender.com (currently experiencing issues)
 * - Alternatives available in comments below
 * - App gracefully handles service downtime with manual text input fallback
 */

const debounce = <T extends (...args: any[]) => void>(fn: T, delay: number) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};

export default function PhotoPredictScreen() {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const OCR_API_BASE =
    process.env.EXPO_PUBLIC_OCR_API_BASE_URL?.replace(/\/$/, "") || "";

  // TEMPORARY WORKAROUND: Use OCR.space API while your server is being fixed
  // const OCR_API_BASE = "https://api.ocr.space/parse/image"; // Uncomment to use OCR.space

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [apiReady, setApiReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [prob, setProb] = useState<number | null>(null);
  const [fromLang, setFromLang] = useState("Крилл");
  const [toLang, setToLang] = useState("Монгол бичиг");
  const [inputText, setInputText] = useState("");
  const [convertedText, setConvertedText] = useState("");

  // ================= Check API =================
  useEffect(() => {
    if (!OCR_API_BASE) {
      console.warn("EXPO_PUBLIC_OCR_API_BASE_URL is not set.");
      setApiReady(false);
      return;
    }

    const checkApi = async () => {
      try {
        // Try multiple endpoints to check if service is responsive
        const endpoints = ["/health", "/camera", "/ocr"];
        let serviceUp = false;

        for (const endpoint of endpoints) {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            const res = await fetch(`${OCR_API_BASE}${endpoint}`, {
              method: "HEAD", // Use HEAD to avoid downloading response body
              signal: controller.signal,
            });
            clearTimeout(timeoutId);
            if (res.ok || res.status === 405) {
              // 405 means method not allowed but endpoint exists
              serviceUp = true;
              break;
            }
          } catch {
            // Continue to next endpoint
          }
        }

        setApiReady(serviceUp);
      } catch (err) {
        console.warn("API health check failed:", err);
        setApiReady(false);
      }
    };
    checkApi();
  }, [OCR_API_BASE]);

  // ================= Pick Image =================
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [13, 13], // 50x650px орчим нарийн, босоо зураг авах
      quality: 1,
    });

    if (!result.canceled && result.assets?.length) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      await predict(uri);
    }
  };

  // ================= Predict =================
  const predict = async (uri: string) => {
    if (!OCR_API_BASE) {
      Alert.alert(
        "OCR URL Missing",
        "Set EXPO_PUBLIC_OCR_API_BASE_URL in .env and restart Expo.",
      );
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", {
        uri,
        name: "image.png",
        type: "image/png",
      } as any);

      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      let response = await fetch(`${OCR_API_BASE}/camera`, {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Fallback to OCR endpoint if the camera route is not available on server.
      if (!response.ok) {
        const fallbackController = new AbortController();
        const fallbackTimeoutId = setTimeout(
          () => fallbackController.abort(),
          30000,
        );

        response = await fetch(`${OCR_API_BASE}/ocr`, {
          method: "POST",
          body: formData,
          signal: fallbackController.signal,
        });

        clearTimeout(fallbackTimeoutId);
      }

      if (!response.ok) {
        let errorMessage = "Prediction service temporarily unavailable";

        switch (response.status) {
          case 502:
            errorMessage =
              "Prediction service is currently down. Please try again later.";
            break;
          case 503:
            errorMessage =
              "Prediction service is overloaded. Please try again in a few minutes.";
            break;
          case 504:
          case 408: // Request timeout
            errorMessage = "Prediction service timed out. Please try again.";
            break;
          case 413:
            errorMessage =
              "Image file is too large. Please use a smaller image.";
            break;
          case 415:
            errorMessage = "Unsupported image format. Please use PNG or JPG.";
            break;
          case 404:
            errorMessage =
              "Prediction endpoints not found. Service may be misconfigured.";
            break;
          default:
            errorMessage = `Prediction failed (${response.status}). Please try again.`;
        }

        Alert.alert("Prediction Error", errorMessage);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const resultText =
        data?.prediction || data?.result || data?.label || "No result";
      const confidence =
        typeof data?.confidence === "number"
          ? data.confidence <= 1
            ? data.confidence * 100
            : data.confidence
          : null;

      setPrediction(resultText);
      setProb(confidence);
      console.log("API Prediction:", data);
    } catch (err) {
      console.error("Prediction error:", err);
      setPrediction("Prediction failed");
      setProb(null);

      // Show user-friendly error if not already shown
      if (
        !(err instanceof Error) ||
        !err.message.includes("Prediction service")
      ) {
        if (err instanceof Error && err.name === "AbortError") {
          Alert.alert(
            "Timeout Error",
            "Request timed out. The service may be busy. Please try again.",
          );
        } else {
          Alert.alert(
            "Connection Error",
            "Unable to connect to prediction service. Please check your internet connection and try again.",
          );
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const parseResponseBody = async (res: Response) => {
    const raw = await res.text();
    const contentType = res.headers.get("content-type") || "";
    const looksLikeJson =
      raw.trim().startsWith("{") || raw.trim().startsWith("[");

    if (contentType.includes("application/json") || looksLikeJson) {
      try {
        return { json: JSON.parse(raw) as Record<string, any>, raw };
      } catch {
        return { json: null, raw };
      }
    }

    return { json: null, raw };
  };

  // ================= Convert Text =================
  const convertText = async (text: string, from = fromLang, to = toLang) => {
    if (!text.trim()) return "";
    setLoading(true);

    try {
      let result = "";

      // 🔹 Кирилл → Монгол бичиг (your current API)
      if (from === "Крилл" && to === "Монгол бичиг") {
        const res = await fetch("https://kimo.mngl.net/pub/convert", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, direction: "to-mng" }),
        });

        const { json, raw } = await parseResponseBody(res);
        if (!res.ok) {
          throw new Error(
            `KIMO convert failed (${res.status}): ${raw.slice(0, 120)}`,
          );
        }
        result =
          (typeof json?.result === "string" && json.result) ||
          (typeof raw === "string" ? raw : "");
      }

      // 🔹 Монгол бичиг → Кирилл (NEW API)
      else if (from === "Монгол бичиг" && to === "Крилл") {
        const res = await fetch(
          "https://api.xmon.mn/api/v1/ai/script-to-cyrillic",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              value: text,
              use_traditional_numbers: false,
              model_name: "script_to_cyrillic_v3",
            }),
          },
        );

        const { json, raw } = await parseResponseBody(res);
        if (!res.ok) {
          throw new Error(
            `XMON convert failed (${res.status}): ${raw.slice(0, 120)}`,
          );
        }
        result =
          (typeof json?.value === "string" && json.value) ||
          (typeof json?.data === "string" && json.data) ||
          (typeof raw === "string" ? raw : "");
      }

      console.log("API Response:", result);
      return result;
    } catch (err) {
      console.error("Conversion error:", err);
      return "";
    } finally {
      setLoading(false);
    }
  };

  // ================= Debounced Conversion =================
  const debouncedConvert = useRef(
    debounce(async (text: string) => {
      const converted = await convertText(text);
      setConvertedText(converted);
    }, 500),
  ).current;

  // ================= Swap Languages =================
  const swapLanguages = async () => {
    const prevInput = inputText;
    const prevConverted = convertedText;

    setFromLang(toLang);
    setToLang(fromLang);

    // input, converted текст хооронд солих
    setInputText(prevConverted);
    setConvertedText(prevInput);

    // шинэ input-тэйгээр хөрвүүлэх
    if (prevConverted.trim()) {
      const newConverted = await convertText(prevConverted, toLang, fromLang);
      setConvertedText(newConverted);
    } else {
      setConvertedText("");
    }
  };

  const recognizeMongolImage = async (
    uri: string,
    endpoint: "ocr" | "camera" = "ocr",
  ) => {
    if (!OCR_API_BASE) {
      Alert.alert(
        "OCR URL Missing",
        "Set EXPO_PUBLIC_OCR_API_BASE_URL in .env and restart Expo.",
      );
      return "";
    }

    setLoading(true);
    const maxRetries = 2;
    let lastError = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const formData = new FormData();
        formData.append("file", {
          uri,
          name: "image.png",
          type: "image/png",
        } as any);

        // Create AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

        const response = await fetch(`${OCR_API_BASE}/${endpoint}`, {
          method: "POST",
          body: formData,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          let errorMessage = "OCR service temporarily unavailable";

          switch (response.status) {
            case 502:
              errorMessage =
                "OCR service is currently down. Please try again later.";
              break;
            case 503:
              errorMessage =
                "OCR service is overloaded. Please try again in a few minutes.";
              break;
            case 504:
            case 408: // Request timeout
              if (attempt < maxRetries) {
                console.log(
                  `OCR attempt ${attempt + 1} timed out, retrying...`,
                );
                await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before retry
                continue;
              }
              errorMessage = "OCR service timed out. Please try again.";
              break;
            case 413:
              errorMessage =
                "Image file is too large. Please use a smaller image.";
              break;
            case 415:
              errorMessage = "Unsupported image format. Please use PNG or JPG.";
              break;
            case 404:
              errorMessage =
                "OCR endpoint not found. Service may be misconfigured.";
              break;
            default:
              errorMessage = `OCR failed (${response.status}). Please try again.`;
          }

          if (attempt === maxRetries) {
            Alert.alert("OCR Error", errorMessage);
          }
          throw new Error(errorMessage);
        }

        const contentType = response.headers.get("content-type");
        let data;

        if (contentType && contentType.includes("application/json")) {
          const text = await response.text();
          if (!text.trim()) {
            throw new Error("Empty response from OCR service");
          }
          data = JSON.parse(text);
        } else {
          // Handle plain text response
          const text = await response.text();
          data = { result: text };
        }

        console.log("OCR Response:", data);
        return data.result || "";
      } catch (err) {
        lastError = err;
        if (err instanceof Error && err.name === "AbortError") {
          if (attempt < maxRetries) {
            console.log(
              `OCR attempt ${attempt + 1} aborted (timeout), retrying...`,
            );
            await new Promise((resolve) => setTimeout(resolve, 1000));
            continue;
          }
        }
        // For other errors, don't retry
        break;
      }
    }

    // If we get here, all retries failed - provide fallback
    console.error("OCR error after retries:", lastError);

    // Provide a helpful fallback message
    Alert.alert(
      "OCR Service Unavailable",
      "The OCR service is currently experiencing issues. You can still use the text translation feature by typing directly in the input field above.",
      [{ text: "OK", style: "default" }],
    );

    return "";
  };

  const pickImage1 = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 13], // 50x650px орчим нарийн, босоо зураг авах
      quality: 1,
    });

    if (!result.canceled && result.assets?.length) {
      const uri = result.assets[0].uri;
      setImageUri(uri);

      // OCR дуудаж текст авна (OCR Scan endpoint)
      const text = await recognizeMongolImage(uri, "ocr");
      setInputText(text); // input-д Монгол бичиг автоматаар дүүргэнэ

      // Debounced conversion direction-г хүчээр Монгол бичиг → Кирилл
      const converted = await convertText(text, "Монгол бичиг", "Крилл");
      setConvertedText(converted);
    }
  };
  const requestCameraPermission = async () => {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Camera access required",
          "Please allow camera permissions to use this feature.",
        );
        return false;
      }
      return true;
    }
    return false;
  };
  const takePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    try {
      // 1️⃣ Өөрийнхөө камераар зураг дарах (Camera open)
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        // Текст уншуулахад ихэвчлэн урт, нарийн зураг авах нь тохиромжтой байдаг
        aspect: [1, 13], // 50x650px
        quality: 1,
      });

      if (result.canceled || !result.assets?.length) return;

      const uri = result.assets[0].uri;
      setImageUri(uri); // Зургийг дэлгэцэнд харуулах

      setLoading(true);

      // 2️⃣ OCR API (http://172.20.10.4:8000/camera)-рүү зургаа илгээж текст болгох
      const text = await recognizeMongolImage(uri, "camera");
      setInputText(text); // Буцаж ирсэн текстийг input-д дүүргэх

      if (text.trim() !== "") {
        // 3️⃣ Хэрвээ текст амжилттай уншсан бол Монгол бичгийг Кирилл руу хөрвүүлэх
        const converted = await convertText(text, "Монгол бичиг", "Крилл");
        setConvertedText(converted);
      } else {
        setConvertedText("");
      }
    } catch (err) {
      console.error("Camera error:", err);
    } finally {
      // Loading төлөвийг арилгах
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? "#0f172a" : "#f8f9fa" }}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View
            style={{
              backgroundColor: isDark ? "#1e293b" : "#10b981",
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
                  backgroundColor: isDark ? "#10b981" : "#ffffff",
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
                <Ionicons
                  name="language"
                  size={24}
                  color={isDark ? "#ffffff" : "#10b981"}
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
                  {t("translation")}
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    color: isDark ? "#cbd5e1" : "#d1fae5",
                    fontWeight: "600",
                    letterSpacing: 0.3,
                  }}
                >
                  Монгол бичиг ↔ Крилл
                </Text>
              </View>
            </View>
            <View
              style={{
                backgroundColor: isDark
                  ? "#374151"
                  : "rgba(255, 255, 255, 0.25)",
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
                  style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
                >
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: isDark ? "#10b981" : "#ffffff",
                    }}
                  />
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
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
                >
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: isDark ? "#ef4444" : "#dc2626",
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "600",
                      color: isDark ? "#ef4444" : "#dc2626",
                    }}
                  >
                    Service Issues
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Language Switch */}
          <View style={styles.langSwitchContainer}>
            <View
              style={[
                styles.langBox,
                {
                  backgroundColor: isDark ? "#1e293b" : "#fff",
                  borderColor: isDark ? "#374151" : "#e2e8f0",
                },
              ]}
            >
              <Text
                style={[
                  styles.langLabel,
                  { color: isDark ? "#6b7280" : "#94a3b8" },
                ]}
              >
                FROM
              </Text>
              <Text
                style={[
                  styles.langText,
                  { color: isDark ? "#f8fafc" : "#1a1a1a" },
                ]}
              >
                {fromLang}
              </Text>
            </View>
            <TouchableOpacity
              onPress={swapLanguages}
              style={styles.swapButton}
              activeOpacity={0.7}
            >
              <Ionicons name="swap-horizontal" size={32} color="#fff" />
            </TouchableOpacity>
            <View
              style={[
                styles.langBox,
                {
                  backgroundColor: isDark ? "#1e293b" : "#fff",
                  borderColor: isDark ? "#374151" : "#e2e8f0",
                },
              ]}
            >
              <Text
                style={[
                  styles.langLabel,
                  { color: isDark ? "#6b7280" : "#94a3b8" },
                ]}
              >
                TO
              </Text>
              <Text
                style={[
                  styles.langText,
                  { color: isDark ? "#f8fafc" : "#1a1a1a" },
                ]}
              >
                {toLang}
              </Text>
            </View>
          </View>

          {/* Input Text */}
          <View style={styles.inputContainer}>
            <View style={styles.inputHeader}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: isDark ? "#f8fafc" : "#1a1a1a",
                }}
              >
                {t("input_text")}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: isDark ? "#9ca3af" : "#94a3b8",
                  fontWeight: "500",
                }}
              >
                Найраглаж бичээд үгүйг хувиргах
              </Text>
            </View>
            <TextInput
              style={{
                backgroundColor: isDark ? "#1e293b" : "#fff",
                borderRadius: 16,
                borderWidth: 1,
                borderColor: isDark ? "#374151" : "#e2e8f0",
                padding: 16,
                fontSize: 16,
                color: isDark ? "#f8fafc" : "#1a1a1a",
                minHeight: 120,
                ...Platform.select({
                  ios: {
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: isDark ? 0.3 : 0.05,
                    shadowRadius: 4,
                  },
                  android: {
                    elevation: 1,
                  },
                }),
              }}
              placeholder="Enter text here..."
              placeholderTextColor={isDark ? "#6b7280" : "#94a3b8"}
              value={inputText}
              onChangeText={(text) => {
                setInputText(text);
                if (text.trim() === "") {
                  setConvertedText("");
                } else {
                  debouncedConvert(text);
                }
              }}
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* Converted Text */}
          {convertedText !== "" && (
            <View style={styles.inputContainer}>
              <View style={styles.inputHeader}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: isDark ? "#f8fafc" : "#1a1a1a",
                  }}
                >
                  {t("output_text")}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: isDark ? "#9ca3af" : "#94a3b8",
                    fontWeight: "500",
                  }}
                >
                  Editable result
                </Text>
              </View>
              <TextInput
                style={{
                  backgroundColor: isDark ? "#0f4c75" : "#f0f9ff",
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: isDark ? "#1e40af" : "#bae6fd",
                  padding: 16,
                  fontSize: 16,
                  color: isDark ? "#f8fafc" : "#1a1a1a",
                  minHeight: 120,
                  ...Platform.select({
                    ios: {
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: isDark ? 0.3 : 0.05,
                      shadowRadius: 4,
                    },
                    android: {
                      elevation: 1,
                    },
                  }),
                }}
                value={convertedText}
                editable={true}
                multiline
                textAlignVertical="top"
              />
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.primaryButton]}
              onPress={takePhoto}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons
                name="camera-outline"
                size={24}
                color="#fff"
              />
              <Text style={styles.buttonText}>Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButton,
                {
                  backgroundColor: isDark ? "#1e293b" : "#fff",
                  borderColor: isDark ? "#374151" : "#e2e8f0",
                },
              ]}
              onPress={pickImage}
              activeOpacity={0.8}
            >
              <Ionicons name="image-outline" size={24} color="#6366f1" />
              <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
                Handwritten
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButton,
                {
                  backgroundColor: isDark ? "#1e293b" : "#fff",
                  borderColor: isDark ? "#374151" : "#e2e8f0",
                },
              ]}
              onPress={pickImage1}
              activeOpacity={0.8}
            >
              <Ionicons name="scan-outline" size={24} color="#6366f1" />
              <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
                OCR Scan
              </Text>
            </TouchableOpacity>
          </View>

          {/* Image Preview */}
          {imageUri && (
            <View style={styles.imagePreviewContainer}>
              <View style={styles.imagePreviewHeader}>
                <Text style={styles.imagePreviewTitle}>Preview</Text>
                <TouchableOpacity onPress={() => setImageUri(null)}>
                  <Ionicons
                    name="close-circle-outline"
                    size={24}
                    color="#64748b"
                  />
                </TouchableOpacity>
              </View>
              <Image
                source={{ uri: imageUri }}
                style={styles.imagePreview}
                resizeMode="contain"
              />
            </View>
          )}

          {/* Loading */}
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#6366f1" />
              <Text style={styles.loadingText}>Processing...</Text>
            </View>
          )}

          {/* Prediction Result */}
          {prediction && !loading && (
            <View style={styles.resultContainer}>
              <View style={styles.resultHeader}>
                <Ionicons name="checkmark-circle" size={28} color="#10b981" />
                <Text style={styles.resultTitle}>Prediction Result</Text>
              </View>
              <Text style={styles.resultText}>{prediction}</Text>
              {prob !== null && (
                <View style={styles.probContainer}>
                  <View style={styles.probHeader}>
                    <Text style={styles.probLabel}>Confidence</Text>
                    <Text style={styles.probValue}>{prob.toFixed(2)}%</Text>
                  </View>
                  <View style={styles.probBarContainer}>
                    <View
                      style={[
                        styles.probBar,
                        { width: `${Math.min(prob, 100)}%` },
                      ]}
                    />
                  </View>
                </View>
              )}
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// ==================== Styles ====================
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
    fontSize: 32,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    color: "#64748b",
    fontWeight: "500",
  },
  statusBadge: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  statusIndicator: {
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
  langSwitchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 24,
    marginBottom: 24,
    gap: 16,
  },
  langBox: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
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
  langLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#94a3b8",
    letterSpacing: 1,
    marginBottom: 4,
  },
  langText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  swapButton: {
    backgroundColor: "#6366f1",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
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
  inputContainer: {
    marginHorizontal: 24,
    marginBottom: 20,
  },
  inputHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  inputHint: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "500",
  },
  textInput: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 16,
    fontSize: 16,
    color: "#1a1a1a",
    minHeight: 120,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  outputInput: {
    backgroundColor: "#f0f9ff",
    borderColor: "#bae6fd",
  },
  actionButtons: {
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
  buttonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
    marginTop: 6,
  },
  buttonTextSecondary: {
    color: "#6366f1",
  },
  imagePreviewContainer: {
    marginHorizontal: 24,
    marginBottom: 24,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  imagePreviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  imagePreviewTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 12,
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
    marginBottom: 16,
  },
  probContainer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  probHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  probLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748b",
  },
  probValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6366f1",
  },
  probBarContainer: {
    height: 8,
    backgroundColor: "#e2e8f0",
    borderRadius: 4,
    overflow: "hidden",
  },
  probBar: {
    height: "100%",
    backgroundColor: "#6366f1",
    borderRadius: 4,
  },
});
