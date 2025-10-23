import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function PhotoPredictScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [fromLang, setFromLang] = useState("Cyrillic");
  const [toLang, setToLang] = useState("Script");
  const [inputText, setInputText] = useState("");



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
    setPrediction("Image processing functionality temporarily disabled");
  };

  const swapLanguages = () => {
    setFromLang(toLang);
    setToLang(fromLang);
  };

  return (
    <View style={styles.container} className="bg-white">
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Орчуулга</Text>
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
    color: "black",
  },
  title: {
    fontSize: 28,
    color: "black",
    fontWeight: "500",
  },
  profile: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  textInput: {
    width: "90%",
    height: 400,
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
    color: "gray",
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
