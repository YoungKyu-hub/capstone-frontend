import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

//Firebase SDK
const firebaseConfig = {
  apiKey: "AIzaSyCIGnHHds2ffCMXCRG5hnYGeuwNMUgSegY",
  authDomain: "pickbo-2cbbf.firebaseapp.com",
  projectId: "pickbo-2cbbf",
  storageBucket: "pickbo-2cbbf.firebasestorage.app",
  messagingSenderId: "981430799853",
  appId: "1:981430799853:web:8fb07451c121e07b6aebe4",
  measurementId: "G-M1408W7VRT"
};

// 1️⃣ Firebase 초기화
const app = initializeApp(firebaseConfig);

// 2️⃣ 서비스 생성
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(
    AsyncStorage
  ),
});
export const db = getFirestore(app);