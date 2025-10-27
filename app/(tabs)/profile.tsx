import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as tf from "@tensorflow/tfjs";
import { bundleResourceIO, decodeJpeg } from "@tensorflow/tfjs-react-native";
import * as ImagePicker from "expo-image-picker";
import _ from "lodash";
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

export default function PhotoPredictScreen() {
  const { language, changeLanguage, t } = useLanguage();
  const { isDark } = useTheme();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [prob, setProb] = useState<number | null>(null);
  const [fromLang, setFromLang] = useState("Крилл");
  const [toLang, setToLang] = useState("Монгол бичиг");
  const [inputText, setInputText] = useState("");
  const [convertedText, setConvertedText] = useState("");

  const CLASS_NAMES = [
    "Үгийн адагт ордог А",
    "Үгийн эхэнд ордог А",
    "Үгийн дунд ордог А",
    "Үгийн адагт ордог Б",
    "Үгийн эхэнд ордог Б",
    "Үгийн дунд ордог Б",
    "Үгийн эхэнд ордог Ч",
    "Үгийн дунд ордог Ч",
    "Үгийн адагт ордог Д",
    "Үгийн эхэнд ордог Д",
    "Үгийн дунд ордог Д",
    "Үгийн эхэнд ордог Э",
    "Үгийн адагт ордог Ф",
    "Үгийн эхэнд ордог Ф",
    "Үгийн дунд ордог Ф",
    "Үгийн адагт ордог(эр үгийн) Г",
    "Үгийн эхэнд ордог(эр үгийн) Г",
    "Үгийн дунд ордог(эр үгийн) Г",
    "Үгийн адагт ордог(эм үгийн) Г",
    "Үгийн эхэнд ордог(эм үгийн) Г",
    "Үгийн дунд ордог(эм үгийн) Г",
    "Үгийн адагт ордог Х",
    "Үгийн эхэнд ордог Х",
    "Үгийн дунд ордог Х",
    "Үгийн эхэнд ордог(эр үгийн) Х",
    "Үгийн дунд ордог(эр үгийн) Х",
    "Үгийн эхэнд ордог(эм үгийн) Х",
    "Үгийн дунд ордог(эм үгийн) Х",
    "Үгийн адагт ордог И",
    "Үгийн эхэнд ордог И",
    "Үгийн дунд ордог И",
    "Үгийн эхэнд ордог Ж,З",
    "Үгийн дунд ордог Ж,З",
    "Үгийн адагт ордог К",
    "Үгийн эхэнд ордог К",
    "Үгийн дунд ордог К",
    "Үгийн адагт ордог Л",
    "Үгийн эхэнд ордог Л",
    "Үгийн дунд ордог Л",
    "Үгийн адагт ордог М",
    "Үгийн эхэнд ордог М",
    "Үгийн дунд ордог М",
    "Үгийн адагт ордог Н",
    "Үгийн эхэнд ордог Н",
    "Үгийн дунд ордог Н",
    "Үгийн адагт ордог О,У",
    "Үгийн эхэнд ордог О",
    "Үгийн дунд ордог О",
    "Үгийн адагт ордог П",
    "Үгийн эхэнд ордог П",
    "Үгийн дунд ордог П",
    "Үгийн адагт ордог Р",
    "Үгийн эхэнд ордог Р",
    "Үгийн дунд ордог Р",
    "Үгийн адагт ордог С",
    "Үгийн эхэнд ордог С",
    "Үгийн дунд ордог С",
    "Үгийн эхэнд ордог Ш",
    "Үгийн дунд ордог Ш",
    "Үгийн дунд ордог Т",
    "Үгийн адагт ордог Ц",
    "Үгийн эхэнд ордог Ц",
    "Үгийн дунд ордог Ц",
    "Үгийн эхэнд ордог Ү,Ө",
    "Үгийн адагт ордог В",
    "Үгийн дунд ордог В",
    "Үгийн адагт ордог З",
    "Үгийн эхэнд ордог З",
    "Үгийн дунд ордог З",
  ];

  // ================= Load TF Model =================
  useEffect(() => {
    const loadModel = async () => {
      setLoading(true);
      try {
        await tf.ready();
        console.log("✅ TensorFlow Ready!");
        const modelJson = require("../../assets/model/model.json");
        const modelWeights = [
          require("../../assets/model/group1-shard1of2.bin"),
          require("../../assets/model/group1-shard2of2.bin"),
        ];
        const loadedModel = await tf.loadLayersModel(
          bundleResourceIO(modelJson, modelWeights)
        );
        setModel(loadedModel);
        console.log("✅ Model Loaded!");
      } catch (err) {
        console.error("❌ Model load failed:", err);
      } finally {
        setLoading(false);
      }
    };
    loadModel();
  }, []);

  // ================= Image -> Tensor =================
  const imageToTensor = async (uri: string) => {
    const response = await fetch(uri);
    const arrayBuffer = await response.arrayBuffer();
    const uInt8Array = new Uint8Array(arrayBuffer);
    const imageTensor = decodeJpeg(uInt8Array) as tf.Tensor3D;
    const resized = tf.image.resizeBilinear(imageTensor, [64, 64]);
    const normalized = resized.div(tf.scalar(255));
    return normalized.expandDims(0);
  };

  // ================= Pick Image =================
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
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
    if (!model) return;
    setLoading(true);
    try {
      const tensor = await imageToTensor(uri);
      const output = model.predict(tensor) as tf.Tensor;
      const raw = output.dataSync();
      const probs = Array.from(tf.softmax(tf.tensor1d(raw)).dataSync());
      const topIndex = probs.indexOf(Math.max(...probs));
      const topClass = CLASS_NAMES[topIndex];
      const topProb = probs[topIndex] * 2500;
      setPrediction(topClass);
      setProb(topProb);
      console.log("✅ Prediction:", topClass, topProb.toFixed(2) + "%");
    } catch (err) {
      console.error("Prediction error:", err);
      setPrediction("Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= Convert Text =================
  const convertText = async (text: string, from = fromLang, to = toLang) => {
    if (!text.trim()) return "";
    setLoading(true);
    try {
      let direction = "";
      if (from === "Крилл" && to === "Монгол бичиг") direction = "to-mng";
      else if (from === "Монгол бичиг" && to === "Крилл") direction = "to-mn";

      const response = await fetch("https://kimo.mngl.net/pub/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, direction }),
      });

      const data = await response.json();
      console.log("API Response:", data); // Metro bundler-д харагдана
      return data.result || "";
    } catch (err) {
      console.error("❌ Conversion error:", err);
      return "";
    } finally {
      setLoading(false);
    }
  };

  // ================= Debounced Conversion =================
  const debouncedConvert = useRef(
    _.debounce(async (text: string) => {
      const converted = await convertText(text);
      setConvertedText(converted);
    }, 500)
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

  const recognizeMongolImage = async (uri: string) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", {
        uri,
        name: "image.png",
        type: "image/png",
      } as any);

      const response = await fetch("http://192.168.1.19:8000/ocr", {
        method: "POST",
        body: formData,
        // ⚠️ Битгий Content-Type зааж өг
        // headers: { "Content-Type": "multipart/form-data" },
      });

      const data = await response.json(); // server JSON буцааж байгаа тул json() ашиглах
      console.log("OCR Response:", data);

      return data.result || "";
    } catch (err) {
      console.error("OCR error:", err);
      return "";
    } finally {
      setLoading(false);
    }
  };

  const pickImage1 = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets?.length) {
      const uri = result.assets[0].uri;
      setImageUri(uri);

      // OCR дуудаж текст авна
      const text = await recognizeMongolImage(uri);
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
          "Please allow camera permissions to use this feature."
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
      // 1️⃣ Камер нээж, crop ratio-тай зураг авах
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 0.25], // width:height = 1:0.25
        quality: 1,
      });

      if (result.canceled || !result.assets?.length) return;

      const uri = result.assets[0].uri;
      setImageUri(uri); // preview-д харуулах

      setLoading(true);

      // 2️⃣ TensorFlow prediction хийх
      const text = await recognizeMongolImage(uri);
      setInputText(text); // input-д Монгол бичиг автоматаар дүүргэнэ

      // Debounced conversion direction-г хүчээр Монгол бичиг → Кирилл
      const converted = await convertText(text, "Монгол бичиг", "Крилл");
      setConvertedText(converted);
      } catch (err) {
      console.error("Camera error:", err);
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
          <View style={{
            backgroundColor: isDark ? "#1e293b" : "#fff",
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
                shadowOpacity: isDark ? 0.3 : 0.05,
                shadowRadius: 8,
              },
              android: {
                elevation: 3,
              },
            }),
          }}>
            <View>
              <Text style={{ fontSize: 32, fontWeight: "700", color: isDark ? "#f8fafc" : "#1a1a1a", marginBottom: 4 }}>{t('translation')}</Text>
              <Text style={{ fontSize: 15, color: isDark ? "#94a3b8" : "#64748b", fontWeight: "500" }}>Монгол бичиг ↔ Крилл</Text>
            </View>
            <View style={{
              backgroundColor: isDark ? "#374151" : "#f1f5f9",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: isDark ? "#4b5563" : "#e2e8f0",
            }}>
              {model ? (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#10b981" }} />
                  <Text style={{ fontSize: 12, fontWeight: "600", color: "#10b981" }}>{t('model_ready')}</Text>
                </View>
              ) : (
                <Text style={{ fontSize: 12, fontWeight: "600", color: "#f59e0b" }}>{t('model_loading')}</Text>
              )}
            </View>
          </View>

          {/* Language Switch */}
          <View style={styles.langSwitchContainer}>
            <View style={[styles.langBox, { backgroundColor: isDark ? "#1e293b" : "#fff", borderColor: isDark ? "#374151" : "#e2e8f0" }]}>
              <Text style={[styles.langLabel, { color: isDark ? "#6b7280" : "#94a3b8" }]}>FROM</Text>
              <Text style={[styles.langText, { color: isDark ? "#f8fafc" : "#1a1a1a" }]}>{fromLang}</Text>
            </View>
            <TouchableOpacity 
              onPress={swapLanguages}
              style={styles.swapButton}
              activeOpacity={0.7}
            >
              <Ionicons name="swap-horizontal" size={32} color="#fff" />
            </TouchableOpacity>
            <View style={[styles.langBox, { backgroundColor: isDark ? "#1e293b" : "#fff", borderColor: isDark ? "#374151" : "#e2e8f0" }]}>
              <Text style={[styles.langLabel, { color: isDark ? "#6b7280" : "#94a3b8" }]}>TO</Text>
              <Text style={[styles.langText, { color: isDark ? "#f8fafc" : "#1a1a1a" }]}>{toLang}</Text>
            </View>
          </View>

          {/* Input Text */}
          <View style={styles.inputContainer}>
            <View style={styles.inputHeader}>
              <Text style={{ fontSize: 16, fontWeight: "700", color: isDark ? "#f8fafc" : "#1a1a1a" }}>{t('input_text')}</Text>
              <Text style={{ fontSize: 12, color: isDark ? "#9ca3af" : "#94a3b8", fontWeight: "500" }}>Найраглаж бичээд үгүйг хувиргах</Text>
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
                <Text style={{ fontSize: 16, fontWeight: "700", color: isDark ? "#f8fafc" : "#1a1a1a" }}>{t('output_text')}</Text>
                <Text style={{ fontSize: 12, color: isDark ? "#9ca3af" : "#94a3b8", fontWeight: "500" }}>Editable result</Text>
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
              <MaterialCommunityIcons name="camera-outline" size={24} color="#fff" />
              <Text style={styles.buttonText}>Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: isDark ? "#1e293b" : "#fff", borderColor: isDark ? "#374151" : "#e2e8f0" }]} 
              onPress={pickImage}
              activeOpacity={0.8}
            >
              <Ionicons name="image-outline" size={24} color="#6366f1" />
              <Text style={[styles.buttonText, styles.buttonTextSecondary]}>Handwritten</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: isDark ? "#1e293b" : "#fff", borderColor: isDark ? "#374151" : "#e2e8f0" }]} 
              onPress={pickImage1}
              activeOpacity={0.8}
            >
              <Ionicons name="scan-outline" size={24} color="#6366f1" />
              <Text style={[styles.buttonText, styles.buttonTextSecondary]}>OCR Scan</Text>
            </TouchableOpacity>
          </View>

          {/* Image Preview */}
          {imageUri && (
            <View style={styles.imagePreviewContainer}>
              <View style={styles.imagePreviewHeader}>
                <Text style={styles.imagePreviewTitle}>Preview</Text>
                <TouchableOpacity onPress={() => setImageUri(null)}>
                  <Ionicons name="close-circle-outline" size={24} color="#64748b" />
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
                    <View style={[styles.probBar, { width: `${Math.min(prob, 100)}%` }]} />
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
