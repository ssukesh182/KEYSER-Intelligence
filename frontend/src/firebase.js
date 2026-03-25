import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAUTMAReIF6kwk9eca98xXzx8wxxMXcgZ4",
  authDomain: "snuchacks-c29fe.firebaseapp.com",
  projectId: "snuchacks-c29fe",
  storageBucket: "snuchacks-c29fe.firebasestorage.app",
  messagingSenderId: "695828978755",
  appId: "1:695828978755:web:12d9d8cec54d30636888f6",
  measurementId: "G-BLEW1CHGGY",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const isFirebaseConfigured = true;
