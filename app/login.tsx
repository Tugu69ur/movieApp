import { Ionicons } from "@expo/vector-icons";
import * as tf from "@tensorflow/tfjs";
import { bundleResourceIO, decodeJpeg } from "@tensorflow/tfjs-react-native";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function PhotoPredictScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [fromLang, setFromLang] = useState("Cyrillic");
  const [toLang, setToLang] = useState("Script");
  const [inputText, setInputText] = useState("");

  const CLASS_NAMES = [
    "Үгийн адагт ордог А", "Үгийн эхэнд ордог А", "Үгийн дунд ордог А",
    "Үгийн адагт ордог Б", "Үгийн эхэнд ордог Б", "Үгийн дунд ордог Б",
    "Үгийн эхэнд ордог Ч", "Үгийн дунд ордог Ч",
    "Үгийн адагт ордог Д", "Үгийн эхэнд ордог Д", "Үгийн дунд ордог Д",
    "Үгийн эхэнд ордог Э",
    "Үгийн адагт ордог Ф", "Үгийн эхэнд ордог Ф", "Үгийн дунд ордог Ф",
    "Үгийн адагт ордог(эр үгийн) Г", "Үгийн эхэнд ордог(эр үгийн) Г", "Үгийн дунд ордог(эр үгийн) Г",
    "Үгийн адагт ордог(эм үгийн) Г", "Үгийн эхэнд ордог(эм үгийн) Г", "Үгийн дунд ордог(эм үгийн) Г",
    "Үгийн адагт ордог Х", "Үгийн эхэнд ордог Х", "Үгийн дунд ордог Х",
    "Үгийн эхэнд ордог(эр үгийн) Х", "Үгийн дунд ордог(эр үгийн) Х",
    "Үгийн эхэнд ордог(эм үгийн) Х", "Үгийн дунд ордог(эм үгийн) Х",
    "Үгийн адагт ордог И", "Үгийн эхэнд ордог И", "Үгийн дунд ордог И",
    "Үгийн эхэнд ордог Ж,З", "Үгийн дунд ордог Ж,З",
    "Үгийн адагт ордог К", "Үгийн эхэнд ордог К", "Үгийн дунд ордог К",
    "Үгийн адагт ордог Л", "Үгийн эхэнд ордог Л", "Үгийн дунд ордог Л",
    "Үгийн адагт ордог М", "Үгийн эхэнд ордог М", "Үгийн дунд ордог М",
    "Үгийн адагт ордог Н", "Үгийн эхэнд ордог Н", "Үгийн дунд ордог Н",
    "Үгийн адагт ордог О,У", "Үгийн эхэнд ордог О", "Үгийн дунд ордог О",
    "Үгийн адагт ордог П", "Үгийн эхэнд ордог П", "Үгийн дунд ордог П",
    "Үгийн адагт ордог Р", "Үгийн эхэнд ордог Р", "Үгийн дунд ордог Р",
    "Үгийн адагт ордог С", "Үгийн эхэнд ордог С", "Үгийн дунд ордог С",
    "Үгийн эхэнд ордог Ш", "Үгийн дунд ордог Ш",
    "Үгийн дунд ордог Т",
    "Үгийн адагт ордог Ц", "Үгийн эхэнд ордог Ц", "Үгийн дунд ордог Ц",
    "Үгийн эхэнд ордог Ү,Ө",
    "Үгийн адагт ордог В", "Үгийн дунд ордог В",
    "Үгийн адагт ордог З", "Үгийн эхэнд ордог З", "Үгийн дунд ордог З"
  ];

  // Load model
  useEffect(() => {
    const loadModel = async () => {
      setLoading(true);
      try {
        await tf.ready();
        const modelJson = require("../assets/model/model.json");
        const modelWeights = [
          require("../assets/model/group1-shard1of2.bin"),
          require("../assets/model/group1-shard2of2.bin"),
        ];
        const loadedModel = await tf.loadLayersModel(bundleResourceIO(modelJson, modelWeights));
        setModel(loadedModel);
      } catch (err) {
        console.error("Model load failed:", err);
      } finally {
        setLoading(false);
      }
    };
    loadModel();
  }, []);

  // Image to tensor
  const imageToTensor = async (uri: string) => {
    const response = await fetch(uri);
    const arrayBuffer = await response.arrayBuffer();
    const uInt8Array = new Uint8Array(arrayBuffer);
    const imageTensor = decodeJpeg(uInt8Array) as tf.Tensor3D;
    const resized = tf.image.resizeBilinear(imageTensor, [64, 64]);
    const normalized = resized.div(tf.scalar(255));
    return normalized.expandDims(0);
  };

  // Pick and Predict
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [64, 64],
      quality: 1,
    });
    if (!result.canceled && result.assets?.length) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      await predict(uri);
    }
  };

  const predict = async (uri: string) => {
    if (!model) return;
    setLoading(true);
    try {
      const tensor = await imageToTensor(uri);
      const output = model.predict(tensor) as tf.Tensor;
      const raw = await output.data();
      const probs = Array.from(await tf.softmax(tf.tensor1d(raw as Float32Array)).array());
      const topIndex = probs.indexOf(Math.max(...probs));
      const topClass = CLASS_NAMES[topIndex];
      const topProb = (probs[topIndex] * 100).toFixed(2);
      setPrediction(`${topClass}\n(${topProb}%)`);
    } catch (err) {
      console.error("Prediction error:", err);
      setPrediction("Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  const swapLanguages = () => {
    setFromLang(toLang);
    setToLang(fromLang);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Script Translator</Text>
        <Image
          source={{ uri: "https://i.pravatar.cc/50" }}
          style={styles.profile}
        />
      </View>

      {/* Text input */}
      <TextInput
        style={styles.textInput}
        placeholder=""
        placeholderTextColor="#999"
        value={inputText}
        onChangeText={setInputText}
      />

      {/* Language switcher */}
      <View style={styles.langRow}>
        <Text style={styles.lang}>{fromLang}</Text>
        <TouchableOpacity onPress={swapLanguages}>
          <Ionicons name="swap-horizontal" size={28} color="#4a90e2" />
        </TouchableOpacity>
        <Text style={styles.lang}>{toLang}</Text>
      </View>

      {/* Image upload */}
      <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
        <Ionicons name="image-outline" size={40} color="#4a90e2" />
        <Text style={styles.uploadText}>Image Upload</Text>
      </TouchableOpacity>

      {/* Prediction */}
      {loading && <ActivityIndicator size="large" color="#4a90e2" style={{ marginTop: 20 }} />}
      {prediction && (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>{prediction}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 60,
  },
  header: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
  },
  profile: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  textInput: {
    width: "90%",
    height: 500,
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
    marginBottom: 30,
    gap: 10,
  },
  lang: {
    fontSize: 16,
    color: "#4a4a4a",
    fontWeight: "500",
  },
  uploadButton: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  uploadText: {
    color: "#4a90e2",
    fontSize: 16,
    marginTop: 5,
  },
  resultBox: {
    marginTop: 25,
    backgroundColor: "#f3f6fa",
    borderRadius: 10,
    padding: 15,
    width: "90%",
  },
  resultText: {
    fontSize: 17,
    color: "#333",
    textAlign: "center",
  },
});
