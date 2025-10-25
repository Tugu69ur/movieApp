//import HandwritingCanvas from "@/components/handWriting";
import { DarkTheme, LightTheme } from "@/constants/theme";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/Theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import _ from "lodash"; // npm install lodash
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function PhotoPredictScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [model, setModel] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [prob, setProb] = useState<number | null>(null);
  const [fromLang, setFromLang] = useState("Крилл");
  const [toLang, setToLang] = useState("Монгол бичиг");
  const [inputText, setInputText] = useState("");
  const [convertedText, setConvertedText] = useState("");

  const currentTheme = theme === "dark" ? DarkTheme : LightTheme;

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

  useEffect(() => {
    // Model loading removed - TensorFlow.js was causing crashes
    console.log("Translation screen ready");
  }, []);

  // ================= Mock Image Processing =================
  const processImage = async (uri: string) => {
    // Mock image processing - TensorFlow.js was causing crashes
    console.log("Processing image:", uri);
    return "Mock processed image data";
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

  // ================= Mock Predict =================
  const predict = async (uri: string) => {
    setLoading(true);
    try {
      // Mock prediction - TensorFlow.js was causing crashes
      const mockPredictions = [
        "Үгийн эхэнд ордог А",
        "Үгийн дунд ордог Б", 
        "Үгийн адагт ордог Ч"
      ];
      const randomPrediction = mockPredictions[Math.floor(Math.random() * mockPredictions.length)];
      const topProb = (Math.random() * 50 + 50).toFixed(2); // 50-100% confidence
      
      setPrediction(randomPrediction);
      setProb(parseFloat(topProb));
      console.log("✅ Mock Prediction:", randomPrediction, topProb + "%");
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

      const response = await fetch("http://172.20.10.2:8000/ocr", {
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
    <View
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: currentTheme.text }]}>
          {t("profile.title")}
        </Text>
      </View>

      {/* Input Text */}
      <TextInput
        style={[
          styles.textInput,
          {
            backgroundColor: currentTheme.card,
            color: currentTheme.text,
            borderColor: currentTheme.secondaryText,
          },
        ]}
        placeholder={t("profile.inputPlaceholder")}
        placeholderTextColor={currentTheme.secondaryText}
        value={inputText}
        onChangeText={(text) => {
          setInputText(text);
          if (text.trim() === "") {
            setConvertedText(""); // хоосон бол convertedText-ийг ч хоослоно
          } else {
            debouncedConvert(text);
          }
        }}
      />

      {/* Converted Text (Editable) */}
      {convertedText !== "" && (
        <TextInput
          style={[
            styles.textInput,
            {
              marginTop: 10,
              backgroundColor: currentTheme.card,
              color: currentTheme.text,
              borderColor: currentTheme.secondaryText,
            },
          ]}
          value={convertedText}
          editable={true} // copy/edit allowed
        />
      )}

      {/* Language Switch */}
      <View style={styles.langRow}>
        <Text style={[styles.lang, { color: currentTheme.secondaryText }]}>
          {toLang}
        </Text>
        <TouchableOpacity onPress={swapLanguages}>
          <MaterialCommunityIcons
            name="swap-horizontal"
            size={28}
            color={currentTheme.accent}
          />
        </TouchableOpacity>
        <Text style={[styles.lang, { color: currentTheme.secondaryText }]}>
          {fromLang}
        </Text>
      </View>

      {/* Image Upload */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 50,
        }}
      >
        <TouchableOpacity style={styles.uploadButton} onPress={takePhoto}>
          <MaterialCommunityIcons
            name="camera-enhance-outline"
            size={30}
            color={currentTheme.accent}
          />
          <Text style={[styles.uploadText, { color: currentTheme.accent }]}>
            {t("common.camera")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
          <MaterialCommunityIcons
            name="image"
            size={30}
            color={currentTheme.accent}
          />
          <Text style={[styles.uploadText, { color: currentTheme.accent }]}>
            {t("common.handwriting")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.uploadButton} onPress={pickImage1}>
          <MaterialCommunityIcons
            name="image"
            size={30}
            color={currentTheme.accent}
          />
          <Text style={[styles.uploadText, { color: currentTheme.accent }]}>
            {t("common.text")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Image Preview */}
      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={{
            width: 280,
            height: 320,
            borderRadius: 10,
            marginTop: 20,
            transform: [{ rotate: "90deg" }],
          }}
          resizeMode="contain" // эсвэл "cover"
        />
      )}

      {/* Loading */}
      {loading && (
        <ActivityIndicator
          size="large"
          color={currentTheme.accent}
          style={{ marginTop: 20 }}
        />
      )}

      {/* Prediction Result */}
      {prediction && !loading && (
        <View
          style={[styles.resultBox, { backgroundColor: currentTheme.card }]}
        >
          <Text style={[styles.resultText, { color: currentTheme.text }]}>
            {prediction}
          </Text>
          {prob !== null && (
            <View style={styles.probContainer}>
              <View
                style={[
                  styles.probBar,
                  { width: `${prob}%`, backgroundColor: currentTheme.accent },
                ]}
              />
              <Text style={[styles.probText, { color: currentTheme.accent }]}>
                {prob.toFixed(2)}%
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

// ==================== Styles ====================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 60,
  },
  header: { width: "90%", alignItems: "center", marginBottom: 20 },
  title: { fontSize: 28, fontWeight: "600" },
  textInput: {
    width: "90%",
    height: 100,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  langRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    gap: 10,
  },
  lang: { fontSize: 16, fontWeight: "500" },
  uploadButton: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  uploadText: { fontSize: 16, marginTop: 5 },
  resultBox: {
    marginTop: 25,
    borderRadius: 10,
    padding: 15,
    width: "90%",
    alignItems: "center",
  },
  resultText: {
    fontSize: 17,
    textAlign: "center",
    fontWeight: "600",
  },
  probContainer: {
    marginTop: 10,
    height: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
    width: "100%",
    overflow: "hidden",
    position: "relative",
  },
  probBar: { height: "100%", borderRadius: 5 },
  probText: {
    marginTop: 8,
    fontSize: 14,
    textAlign: "center",
  },
});
