import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCMaCn3vKLSZ1kKzF187dar4ml97DitXSE",
  authDomain: "trail-fc479.firebaseapp.com",
  projectId: "trail-fc479",
  storageBucket: "trail-fc479.appspot.com",
  messagingSenderId: "58905320043",
  appId: "1:58905320043:web:def5b3e3d5f54ad6672f2e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };
