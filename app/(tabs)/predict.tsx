import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-react-native";
import { bundleResourceIO, decodeJpeg } from "@tensorflow/tfjs-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Image,
    PanResponder,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Svg, { Path, Rect } from "react-native-svg";
import ViewShot, { captureRef } from "react-native-view-shot";

export default function DrawScreen() {
  const [paths, setPaths] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState<string>("");
  const [savedBase64, setSavedBase64] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const viewShotRef = useRef<any>(null);
  const modelRef = useRef<tf.LayersModel | null>(null);

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
    const loadModel = async () => {
      setLoading(true);
      try {
        await tf.ready();
        const modelJson = require("../../assets/model/model.json");
        const modelWeights = [
          require("../../assets/model/group1-shard1of2.bin"),
          require("../../assets/model/group1-shard2of2.bin"),
        ];
        modelRef.current = await tf.loadLayersModel(
          bundleResourceIO(modelJson, modelWeights)
        );
        console.log("✅ Model Loaded!");
      } catch (err) {
        console.error("Model load failed:", err);
      } finally {
        setLoading(false);
      }
    };
    loadModel();
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const x = evt.nativeEvent.locationX;
        const y = evt.nativeEvent.locationY;
        setCurrentPath(`M${x},${y}`);
      },
      onPanResponderMove: (evt) => {
        const x = evt.nativeEvent.locationX;
        const y = evt.nativeEvent.locationY;
        setCurrentPath((prev) => `${prev} L${x},${y}`);
      },
    })
  ).current;

  const addPath = () => {
    if (currentPath.length > 0) {
      setPaths((prev) => [...prev, currentPath]);
      setCurrentPath("");
    }
  };

  // Save as JPEG for TensorFlow decode
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

  const predict = async () => {
    if (!savedBase64 || !modelRef.current) return;
    try {
      const tensor = await base64ToTensor(savedBase64);
      const output = modelRef.current.predict(tensor) as tf.Tensor;
      const probs = Array.from(tf.softmax(output).dataSync());
      const topIndex = probs.indexOf(Math.max(...probs));
      setPrediction(
        `${CLASS_NAMES[topIndex]} (${(probs[topIndex] * 2500).toFixed(2)}%)`
      );
    } catch (err) {
      console.error("Prediction failed:", err);
    }
  };

  const clearCanvas = () => {
    setPaths([]);
    setCurrentPath("");
    setSavedBase64(null);
    setPrediction(null);
  };

  return (
    <View style={styles.container}>
      <ViewShot ref={viewShotRef} style={styles.canvasWrapper}>
        <Svg width={300} height={300}>
          <Rect x={0} y={0} width={300} height={300} fill="white" />
          {paths.map((p, i) => (
            <Path key={i} d={p} stroke="black" strokeWidth={12} fill="none" />
          ))}
          {currentPath.length > 0 && (
            <Path d={currentPath} stroke="black" strokeWidth={12} fill="none" />
          )}
        </Svg>
        <View style={StyleSheet.absoluteFill} {...panResponder.panHandlers} />
      </ViewShot>

      <View style={styles.buttonsRow}>
        <TouchableOpacity style={styles.btn} onPress={addPath}>
          <Text style={styles.btnText}>Done</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={clearCanvas}>
          <Text style={styles.btnText}>Clear</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={saveAsJPEG}>
          <Text style={styles.btnText}>Save JPEG</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={predict}>
          <Text style={styles.btnText}>Predict</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={{ marginTop: 20, alignItems: "center" }}>
          <ActivityIndicator size="large" color="#4a90e2" />
          <Text>Model ачааллаж байна...</Text>
        </View>
      )}

      {savedBase64 && (
        <Image
          source={{ uri: savedBase64 }}
          style={{
            width: 64,
            height: 64,
            borderWidth: 1,
            borderColor: "#000",
            marginTop: 15,
          }}
        />
      )}
      {prediction && (
        <Text style={{ marginTop: 15, fontSize: 18, fontWeight: "600" }}>
          Prediction: {prediction}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 50,
  },
  canvasWrapper: {
    width: 300,
    height: 300,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#eee",
  },
  buttonsRow: {
    flexDirection: "row",
    marginTop: 20,
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  btn: {
    backgroundColor: "#4a90e2",
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  btnText: { color: "white", fontWeight: "600" },
});
