import { ReactNativeAsyncStorage } from "@react-native-async-storage/async-storage";
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, GoogleAuthProvider, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA8Cv3tMNHF6-0QU6G2FALohBegD7-N9Yw",
  authDomain: "translator-4d4d3.firebaseapp.com",
  projectId: "translator-4d4d3",
  storageBucket: "translator-4d4d3.firebasestorage.app",
  messagingSenderId: "1011200192015",
  appId: "1:1011200192015:web:530906241abecfc2fcbd7a",
  measurementId: "G-Y5MF4V3P0R"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const db = getFirestore(app);
export const storage = getStorage(app);
const analytics = getAnalytics(app);
export const googleProvider = new GoogleAuthProvider();