import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDS-bRpEPnXuGuhXrCt0lmE8aimfnQPSrc",
  authDomain: "focus-app-3b2a8.firebaseapp.com",
  projectId: "focus-app-3b2a8",
  storageBucket: "focus-app-3b2a8.firebasestorage.app",
  messagingSenderId: "378927864321",
  appId: "1:378927864321:web:fc415c9145ac0850737e00"
};

// ✅ Initialize
const app = initializeApp(firebaseConfig);

// ✅ Auth
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();