import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Ungal Firebase Console-il irunthu kidaitha config details-ai podungal
const firebaseConfig = {
  apiKey: "AIzaSyB0eadN-EXQ81bjJiIp-nx703a6vhqSngM",
  authDomain: "ecommerceapp-cf7f3.firebaseapp.com",
  databaseURL: "https://ecommerceapp-cf7f3-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ecommerceapp-cf7f3",
  storageBucket: "ecommerceapp-cf7f3.firebasestorage.app",
  messagingSenderId: "786053161862",
  appId: "1:786053161862:web:4ef2ee9e266889b50b4207",
  measurementId: "G-LEX4Z7GMLS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;