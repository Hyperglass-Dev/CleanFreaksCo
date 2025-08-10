// src/lib/firebase.ts
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  projectId: "cleansweephq-dmwr4",
  appId: "1:711544861338:web:e8cac33c9f33a8fd776523",
  storageBucket: "cleansweephq-dmwr4.firebasestorage.app",
  apiKey: "AIzaSyCpr2AnV5ejRGyrl4RGL7v897fXGleQ7vU",
  authDomain: "cleansweephq-dmwr4.firebaseapp.com",
  messagingSenderId: "711544861338",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
