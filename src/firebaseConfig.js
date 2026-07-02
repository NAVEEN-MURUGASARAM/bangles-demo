import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCPKoJiovJyghok6TkuvIX16rPZBPY5duQ",
  authDomain: "bangle-website-64f08.firebaseapp.com",
  projectId: "bangle-website-64f08",
  storageBucket: "bangle-website-64f08.firebasestorage.app",
  messagingSenderId: "1045922786749",
  appId: "1:1045922786749:web:4a442a05db4d1b7f0376d4",
  measurementId: "G-2NDR66M5EF",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const ADMIN_PASSCODE = "SparkleAdmin2026"; // Default passcode for admin panel

