import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// These should be in .env.local in a real project
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const IS_MOCK_MODE = !firebaseConfig.apiKey;

let app, auth, googleProvider;

if (IS_MOCK_MODE) {
  console.warn("⚠️ Firebase API Key missing. Running in MOCK AUTH MODE.");
  app = { name: "mock-app" };
  auth = { 
    currentUser: null, 
    isMock: true,
    getIdToken: async () => "mock-token"
  };
  googleProvider = {};
} else {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
  } catch (error) {
    console.error("Firebase initialization failed:", error);
    // Fallback to mock if it fails
    auth = { isMock: true, getIdToken: async () => "mock-token" };
  }
}

export { auth, googleProvider };
