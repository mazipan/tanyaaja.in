import { getAnalytics, logEvent } from 'firebase/analytics'
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

const app = initializeApp(firebaseConfig)

export const getFirebaseAuth = () => getAuth(app)

export const trackEvent = (
  eventName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  eventParam?: Record<string, any>,
) => {
  const analytics = getAnalytics()
  logEvent(analytics, eventName, eventParam)
}

export const getGoogleAuthProvider = () => {
  const provider = new GoogleAuthProvider()
  provider.addScope('https://www.googleapis.com/auth/userinfo.profile')
  provider.addScope('https://www.googleapis.com/auth/userinfo.email')
  provider.setCustomParameters({
    login_hint: 'user@example.com',
  })

  return provider
}
