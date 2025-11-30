
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

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
const app = initializeApp(firebaseConfig);

// Firestore database
export const db = getFirestore(app);