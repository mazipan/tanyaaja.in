import { App, getApp, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

import { firebaseConfig } from '@/lib/firebase'

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? ''

const app: App = getApps().length
  ? getApp(PROJECT_ID)
  : initializeApp(firebaseConfig, PROJECT_ID)

const Auth = getAuth(app)

export const verifyIdToken = (idToken: string) => Auth.verifyIdToken(idToken)
