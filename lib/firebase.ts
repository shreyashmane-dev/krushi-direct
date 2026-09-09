import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  User as FirebaseUser,
} from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBLvDirLrKdt98uQDRtura7ncOxrzgBQbA",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "sih2026-37aaa.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "sih2026-37aaa",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "sih2026-37aaa.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "850815271669",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:850815271669:web:c152d25b4fad0d18ffbbbc",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-FKVQT460P3",
};

// Initialize Firebase singleton
export const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
export const firebaseStorage = getStorage(firebaseApp);
export const firebaseDb = getFirestore(firebaseApp);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

/**
 * Sign in with Google Popup
 */
export async function signInWithGoogle(): Promise<FirebaseUser> {
  const result = await signInWithPopup(firebaseAuth, googleProvider);
  return result.user;
}

/**
 * Sign in with Email & Password
 */
export async function signInWithFirebaseEmail(email: string, password: string): Promise<FirebaseUser> {
  const result = await signInWithEmailAndPassword(firebaseAuth, email, password);
  return result.user;
}

/**
 * Register with Email & Password in Firebase
 */
export async function registerWithFirebaseEmail(email: string, password: string): Promise<FirebaseUser> {
  const result = await createUserWithEmailAndPassword(firebaseAuth, email, password);
  return result.user;
}

/**
 * Send password reset email
 */
export async function resetFirebasePassword(email: string): Promise<void> {
  await sendPasswordResetEmail(firebaseAuth, email);
}

/**
 * Sign out of Firebase Auth
 */
export async function logoutFirebase(): Promise<void> {
  await signOut(firebaseAuth);
}

// Initialize Analytics only in client-side browser
export const initAnalytics = async () => {
  if (typeof window !== 'undefined') {
    const supported = await isSupported();
    if (supported) {
      return getAnalytics(firebaseApp);
    }
  }
  return null;
};

