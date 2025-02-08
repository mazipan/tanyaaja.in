import { getFirebaseAuth } from 'next-firebase-auth-edge'
import type { DecodedIdToken } from 'next-firebase-auth-edge/auth'

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? ''
const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? ''

// Read: https://dev.to/vvo/how-to-add-firebase-service-account-json-files-to-vercel-ph5
const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string,
)

const Auth = getFirebaseAuth({
  apiKey: API_KEY,
  serviceAccount: {
    projectId: PROJECT_ID,
    privateKey: serviceAccount.private_key,
    clientEmail: serviceAccount.client_email,
  },
})

export const verifyIdToken = (
  idToken: string,
  checkRevoked?: boolean,
): Promise<DecodedIdToken> => Auth.verifyIdToken(idToken, { checkRevoked })

export const deleteUser = (uid: string) => Auth.deleteUser(uid)
