// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB6g41EXFgm6Gr9gwCBxSZIS-Weizofu00",
  authDomain: "tippay-97865.firebaseapp.com",
  projectId: "tippay-97865",
  storageBucket: "tippay-97865.firebasestorage.app",
  messagingSenderId: "18003179564",
  appId: "1:18003179564:web:70a43f014b1cfc50917989",
  measurementId: "G-EB5J83NT9C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, auth, db, storage };
export default app;
