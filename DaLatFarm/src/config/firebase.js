// Firebase client initialization
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
}

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

// Explicit bucket binding helps avoid mis-resolved endpoints
const bucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET
export const storage = getStorage(app, bucket ? `gs://${bucket}` : undefined)

export const enableAnalytics = async () => {
  if (import.meta.env.PROD) {
    const { getAnalytics, isSupported } = await import('firebase/analytics')
    if (await isSupported()) {
      return getAnalytics(app)
    }
  }
  return null
}
