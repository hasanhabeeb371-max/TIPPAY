// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCK6Cw19OM3Pn5cXagjhNVE-RK8lK1EaW0",
  authDomain: "dubaigoldwebsite.firebaseapp.com",
  projectId: "dubaigoldwebsite",
  storageBucket: "dubaigoldwebsite.firebasestorage.app",
  messagingSenderId: "514202698759",
  appId: "1:514202698759:web:2bc4aeb2eff4e9693fd6a2",
  measurementId: "G-W5JXV95GD8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, auth, db, storage };
export default app;
