import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDfBHP-sfTfejlWBot5YepmtBGpoSglBrc",
  authDomain: "ipiza-33af7.firebaseapp.com",
  projectId: "ipiza-33af7",
  storageBucket: "ipiza-33af7.firebasestorage.app",
  messagingSenderId: "1024543504392",
  appId: "1:1024543504392:web:295a40a691c4b0057579bd"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
