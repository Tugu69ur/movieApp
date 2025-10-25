//import HandwritingCanvas from "@/components/handWriting";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as tf from "@tensorflow/tfjs";
import { bundleResourceIO, decodeJpeg } from "@tensorflow/tfjs-react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import _ from "lodash"; // npm install lodash
import React, { useEffect, useRef, useState } from "react";
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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Орчуулга</Text>
      </View>

      {/* Input Text */}
      <TextInput
        style={styles.textInput}
        placeholder="Текст оруулах..."
        placeholderTextColor="#999"
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
          style={[styles.textInput, { marginTop: 10 }]}
          value={convertedText}
          editable={true} // copy/edit allowed
        />
      )}

      {/* Language Switch */}
      <View style={styles.langRow}>
        <Text style={styles.lang}>{toLang}</Text>
        <TouchableOpacity onPress={swapLanguages}>
          <Ionicons name="swap-horizontal" size={28} color="#4a90e2" />
        </TouchableOpacity>
        <Text style={styles.lang}>{fromLang}</Text>
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
            color="#4a90e2"
          />
          <Text style={styles.uploadText}>Camera</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
          <Ionicons name="image-outline" size={30} color="#4a90e2" />
          <Text style={styles.uploadText}>Гар бичмэл</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.uploadButton} onPress={pickImage1}>
          <Ionicons name="image-outline" size={30} color="#4a90e2" />
          <Text style={styles.uploadText}>Бичмэл</Text>
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
          color="#4a90e2"
          style={{ marginTop: 20 }}
        />
      )}

      {/* Prediction Result */}
      {prediction && !loading && (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>{prediction}</Text>
          {prob !== null && (
            <View style={styles.probContainer}>
              <View style={[styles.probBar, { width: `${prob}%` }]} />
              <Text style={styles.probText}>{prob.toFixed(2)}%</Text>
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
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 60,
  },
  header: { width: "90%", alignItems: "center", marginBottom: 20 },
  title: { fontSize: 28, color: "black", fontWeight: "600" },
  textInput: {
    width: "90%",
    height: 100,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
    marginBottom: 20,
  },
  langRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    gap: 10,
  },
  lang: { fontSize: 16, color: "gray", fontWeight: "500" },
  uploadButton: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  uploadText: { color: "#4a90e2", fontSize: 16, marginTop: 5 },
  resultBox: {
    marginTop: 25,
    backgroundColor: "#f3f6fa",
    borderRadius: 10,
    padding: 15,
    width: "90%",
    alignItems: "center",
  },
  resultText: {
    fontSize: 17,
    color: "#333",
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
  probBar: { height: "100%", backgroundColor: "#4a90e2", borderRadius: 5 },
  probText: {
    marginTop: 8,
    fontSize: 14,
    color: "#4a90e2",
    textAlign: "center",
  },
});
