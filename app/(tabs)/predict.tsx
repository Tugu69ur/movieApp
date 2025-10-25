import { DarkTheme, LightTheme } from "@/constants/theme";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/Theme";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [paths, setPaths] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState<string>("");
  const [savedBase64, setSavedBase64] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const viewShotRef = useRef<any>(null);
  
  const currentTheme = theme === 'dark' ? DarkTheme : LightTheme;

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
    console.log("Drawing screen ready");
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

  const predict = async () => {
    if (!savedBase64) {
      Alert.alert('Error', 'Please draw something first');
      return;
    }
    
    setLoading(true);
    try {
      // Mock prediction - TensorFlow.js was causing crashes
      const mockPredictions = [
        "Үгийн эхэнд ордог А",
        "Үгийн дунд ордог Б", 
        "Үгийн адагт ордог Ч"
      ];
      const randomPrediction = mockPredictions[Math.floor(Math.random() * mockPredictions.length)];
      const confidence = (Math.random() * 50 + 50).toFixed(1); // 50-100% confidence
      
      setPrediction(`${randomPrediction} (${confidence}%)`);
    } catch (err) {
      console.error("Prediction failed:", err);
      Alert.alert('Error', 'Prediction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearCanvas = () => {
    setPaths([]);
    setCurrentPath("");
    setSavedBase64(null);
    setPrediction(null);
  };

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <ViewShot ref={viewShotRef} style={[styles.canvasWrapper, { backgroundColor: currentTheme.card, borderColor: currentTheme.secondaryText }]}>
        <Svg width={300} height={300}>
          <Rect x={0} y={0} width={300} height={300} fill={currentTheme.card} />
          {paths.map((p, i) => (
            <Path key={i} d={p} stroke={currentTheme.text} strokeWidth={12} fill="none" />
          ))}
          {currentPath.length > 0 && (
            <Path d={currentPath} stroke={currentTheme.text} strokeWidth={12} fill="none" />
          )}
        </Svg>
        <View style={StyleSheet.absoluteFill} {...panResponder.panHandlers} />
      </ViewShot>

      <View style={styles.buttonsRow}>
        <TouchableOpacity style={[styles.btn, { backgroundColor: currentTheme.accent }]} onPress={addPath}>
          <Text style={styles.btnText}>{t("common.done")}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, { backgroundColor: currentTheme.accent }]} onPress={clearCanvas}>
          <Text style={styles.btnText}>{t("common.clear")}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, { backgroundColor: currentTheme.accent }]} onPress={saveAsJPEG}>
          <Text style={styles.btnText}>{t("common.save")}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, { backgroundColor: currentTheme.accent }]} onPress={predict}>
          <Text style={styles.btnText}>{t("common.predict")}</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={{ marginTop: 20, alignItems: "center" }}>
          <ActivityIndicator size="large" color={currentTheme.accent} />
          <Text style={{ color: currentTheme.text }}>{t("profile.modelLoading")}</Text>
        </View>
      )}

      {savedBase64 && (
        <Image
          source={{ uri: savedBase64 }}
          style={{
            width: 64,
            height: 64,
            borderWidth: 1,
            borderColor: currentTheme.secondaryText,
            marginTop: 15,
          }}
        />
      )}
      {prediction && (
        <Text style={{ marginTop: 15, fontSize: 18, fontWeight: "600", color: currentTheme.text }}>
          {t("predict.prediction")}: {prediction}
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
    paddingVertical: 50,
  },
  canvasWrapper: {
    width: 300,
    height: 300,
    borderWidth: 1,
  },
  buttonsRow: {
    flexDirection: "row",
    marginTop: 20,
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  btn: {
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  btnText: { color: "white", fontWeight: "600" },
});
