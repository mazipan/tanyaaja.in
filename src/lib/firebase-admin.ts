import {
  type App,
  applicationDefault,
  getApp,
  getApps,
  initializeApp,
} from 'firebase-admin/app'
import { getAuth, UserRecord } from 'firebase-admin/auth'
import { getDatabase } from 'firebase-admin/database'

import { firebaseConfig } from '@/lib/firebase'

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? ''

const app: App = getApps().length
  ? getApp(PROJECT_ID)
  : initializeApp(
      {
        ...firebaseConfig,
        credential: applicationDefault(),
        databaseURL: process.env.REALTIME_DATABASE_URL,
      },
      PROJECT_ID,
    )

const Auth = getAuth(app)
const Database = getDatabase(app)

export const verifyIdToken = (idToken: string) =>
  Auth.verifyIdToken(idToken, true)

export const revokeRefreshTokens = async (uid: string) => {
  // Revoke all refresh tokens for a specified user for whatever reason
  await Auth.revokeRefreshTokens(uid)

  // Ref: https://firebase.google.com/docs/auth/admin/manage-sessions?hl=en#revoke_refresh_tokens
  const user: UserRecord = await Auth.getUser(uid)
  const revokeTime: number =
    new Date(user.tokensValidAfterTime as string).getTime() / 1000

  // Ref: https://firebase.google.com/docs/auth/admin/manage-sessions?hl=en#detect_id_token_revocation_in
  const metadataRef = Database.ref('metadata/' + uid)
  await metadataRef.set({ revokeTime })
}
