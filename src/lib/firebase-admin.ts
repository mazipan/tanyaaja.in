import { initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

import { firebaseConfig } from '@/lib/firebase'

const app = initializeApp(
  firebaseConfig,
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
)

export const verifyIdToken = (idToken: string) =>
  getAuth(app).verifyIdToken(idToken)
