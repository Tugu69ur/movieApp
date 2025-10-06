import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as tf from "@tensorflow/tfjs";
import { bundleResourceIO, decodeJpeg } from "@tensorflow/tfjs-react-native";

export default function PhotoPredictScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<string | null>(null);

  // Class names
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

  // Load model on mount
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

        const loadedModel = await tf.loadLayersModel(
          bundleResourceIO(modelJson, modelWeights)
        );
        setModel(loadedModel);
      } catch (err) {
        console.error("Model load failed:", err);
      } finally {
        setLoading(false);
      }
    };
    loadModel();
  }, []);

  // Pick image from gallery
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [64, 64],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setPrediction(null);
    }
  };

  // Convert image to tensor
  const imageToTensor = async (uri: string) => {
    const response = await fetch(uri);
    const arrayBuffer = await response.arrayBuffer();
    const uInt8Array = new Uint8Array(arrayBuffer);
    const imageTensor = decodeJpeg(uInt8Array) as tf.Tensor3D;

    // Resize and normalize [0,1]
    const resized = tf.image.resizeBilinear(imageTensor, [64, 64]);
    const normalized = resized.div(tf.scalar(255));
    return normalized.expandDims(0); // [1,64,64,3]
  };

  // Predict function
  const handlePredict = async () => {
    if (!model || !imageUri) return;
    setLoading(true);
    try {
      const tensor = await imageToTensor(imageUri);
      const output = model.predict(tensor) as tf.Tensor;

      // ---- FIXED PART ----
      const raw = await output.data(); // get raw outputs
      let probs: number[];

      if (model.outputs[0].shape && model.outputs[0].shape[model.outputs[0].shape.length - 1] === CLASS_NAMES.length) {
        // Assume model already has softmax
        probs = Array.from(raw);
      } else {
        // Apply softmax manually if last layer is logits
        const logits = tf.tensor1d(raw as Float32Array);
        probs = Array.from(await tf.softmax(logits).array());
      }

      const topIndex = probs.indexOf(Math.max(...probs));
      const topClass = CLASS_NAMES[topIndex];
      const topProb = (probs[topIndex] * 100).toFixed(2);

      setPrediction(`Predicted: ${topClass} (${topProb}%)`);
    } catch (err) {
      console.error("Prediction error:", err);
      setPrediction("Prediction failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Pick an Image</Text>
      </TouchableOpacity>

      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.imagePreview} />
      )}

      {model && imageUri && (
        <TouchableOpacity style={styles.button} onPress={handlePredict}>
          <Text style={styles.buttonText}>Predict</Text>
        </TouchableOpacity>
      )}

      {loading && <ActivityIndicator size="large" color="#4a90e2" />}

      {prediction && <Text style={styles.predictionText}>{prediction}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  button: {
    backgroundColor: "#4a90e2",
    padding: 12,
    borderRadius: 10,
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  imagePreview: {
    width: 224,
    height: 224,
    marginVertical: 10,
    borderRadius: 10,
  },
  predictionText: {
    fontSize: 18,
    textAlign: "center",
    color: "black",
    marginTop: 10,
  },
});





// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Image,
//   ActivityIndicator,
//   ScrollView,
//   StyleSheet,
// } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import * as tf from "@tensorflow/tfjs";
// import { decodeJpeg } from "@tensorflow/tfjs-react-native";

// // Stage 1: Slice Mongolian word image into letters
// export default function Stage1SliceScreen() {
//   const [tfReady, setTfReady] = useState(false);
//   const [wordUri, setWordUri] = useState<string | null>(null);
//   const [charUris, setCharUris] = useState<string[]>([]);
//   const [loading, setLoading] = useState(false);

//   // Initialize TensorFlow and backend
//   useEffect(() => {
//     (async () => {
//       await tf.ready();
//       await tf.setBackend("rn-webgl");
//       console.log("TF backend ready:", tf.getBackend());
//       setTfReady(true);
//     })();
//   }, []);

//   // Pick word image
//   const pickWordImage = async () => {
//     if (!tfReady) return alert("TensorFlow not ready yet");
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [1, 5],
//       quality: 1,
//     });

//     if (!result.canceled && result.assets.length > 0) {
//       setWordUri(result.assets[0].uri);
//       setCharUris([]);
//     }
//   };

//   // Slice word into characters using vertical projection
//   const sliceWordToChars = async () => {
//     if (!tfReady) return alert("TensorFlow not ready yet");
//     if (!wordUri) return;
//     setLoading(true);

//     try {
//       // Fetch image and convert to tensor
//       const response = await fetch(wordUri);
//       const buffer = await response.arrayBuffer();
//       let imgTensor = decodeJpeg(new Uint8Array(buffer)); // [H,W,3]

//       // Convert to grayscale
//       imgTensor = imgTensor.mean(2).toInt(); // [H,W]

//       const [height, width] = imgTensor.shape;
//       const data = await imgTensor.data(); // 1D array
//       const cols: number[] = [];

//       // Sum pixel values per column
//       for (let x = 0; x < width; x++) {
//         let sum = 0;
//         for (let y = 0; y < height; y++) {
//           sum += data[y * width + x];
//         }
//         cols.push(sum);
//       }

//       // Detect cut points (where sum ~ 0)
//       const cutPoints: number[] = [];
//       for (let i = 1; i < cols.length - 1; i++) {
//         if (cols[i] === 0 && cols[i - 1] > 0) cutPoints.push(i);
//       }

//       // Slice image tensor into character tensors
//       const slices: tf.Tensor3D[] = [];
//       let lastX = 0;
//       for (const x of cutPoints) {
//         const charTensor = imgTensor
//           .slice([0, lastX], [height, x - lastX])
//           .expandDims(2);
//         slices.push(charTensor);
//         lastX = x;
//       }
//       if (lastX < width) {
//         const charTensor = imgTensor
//           .slice([0, lastX], [height, width - lastX])
//           .expandDims(2);
//         slices.push(charTensor);
//       }

//       // Placeholder for character URIs (use tensor placeholders)
//       const charUrisLocal: string[] = slices.map(
//         (_, i) => `char_tensor_${i}`
//       );

//       setCharUris(charUrisLocal);
//     } catch (err) {
//       console.error("Slice error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <TouchableOpacity style={styles.button} onPress={pickWordImage}>
//         <Text style={styles.buttonText}>Pick Word Image</Text>
//       </TouchableOpacity>

//       {wordUri && <Image source={{ uri: wordUri }} style={styles.wordImage} />}

//       {wordUri && (
//         <TouchableOpacity style={styles.button} onPress={sliceWordToChars}>
//           <Text style={styles.buttonText}>Slice Word</Text>
//         </TouchableOpacity>
//       )}

//       {loading && <ActivityIndicator size="large" color="#4a90e2" />}

//       {charUris.length > 0 && (
//         <View style={styles.charContainer}>
//           <Text>Characters sliced: {charUris.length}</Text>
//           {charUris.map((c, i) => (
//             <Text key={i}>{c}</Text>
//           ))}
//         </View>
//       )}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flexGrow: 1, alignItems: "center", padding: 20 },
//   button: {
//     backgroundColor: "#4a90e2",
//     padding: 12,
//     borderRadius: 10,
//     marginVertical: 10,
//   },
//   buttonText: { color: "#fff", fontSize: 16 },
//   wordImage: { width: 224, height: 224, marginVertical: 10, borderRadius: 10 },
//   charContainer: { marginTop: 20, alignItems: "center" },
// });
