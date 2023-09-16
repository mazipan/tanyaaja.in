import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, User } from 'firebase/auth';
import slugify from '@sindresorhus/slugify';
import { v4 as uuidv4 } from 'uuid';

import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
} from 'firebase/firestore';
import { UserProfile } from "./types";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);

export const getFirebaseApp = () => app
export const getFirebaseAuth = () => getAuth(app)
export const getFirebaseDb = () => getFirestore(app)

export const getGoogleAuthProvider = () => {
	const provider = new GoogleAuthProvider();
	provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
	provider.addScope('https://www.googleapis.com/auth/userinfo.email');
	provider.setCustomParameters({
		login_hint: 'user@example.com'
	});

  return provider
}

export const COLLECTION = {
  USER: 'users',
  QUESTIONS: 'question'
}

export interface Question {
  owner: string
  qid: string
  q: string
  s: number
}

export const createUserInDbIfNotExist = async ({ user }: { user: User }) => {
  const db = getFirebaseDb()
  const dbRef = collection(db, COLLECTION.USER);
  const q = query(dbRef, where('uid', '==', user?.uid));

  const querySnapshot = await getDocs(q);

  const newData: UserProfile = {
    uid: user.uid,
    image: user.photoURL || '',
    name: user.displayName || '',
    slug: slugify(user.email?.split('@')[0] || ''),
    count: '0'
  }

  if (querySnapshot.size === 0) {
    try {
      await addDoc(dbRef, newData);
    } catch (e) {
      console.error('Error adding new user: ', newData, e);
    }
  }
}

export const getUserInDb = async ({ user }: { user: User }): Promise<UserProfile | null> => {
  const db = getFirebaseDb()
  const dbRef = collection(db, COLLECTION.USER);
  const q = query(dbRef, where('uid', '==', user?.uid));

  const querySnapshot = await getDocs(q);

  let res = null
  if (querySnapshot.size > 0) {
    querySnapshot.forEach(async (doc) => {
      const data = doc.data()
      if (data) {
        res = doc.data()
      }
    });
  }

  return res
}


export const getUserOwnerBySlug = async (slug: string): Promise<UserProfile | null> => {
  const db = getFirebaseDb()
  const dbRef = collection(db, COLLECTION.USER);
  const q = query(dbRef, where('slug', '==', slug));

  const querySnapshot = await getDocs(q);

  let res = null
  if (querySnapshot.size > 0) {
    querySnapshot.forEach(async (doc) => {
      const data = doc.data()
      if (data) {
        res = doc.data()
      }
    });
  }

  return res
}

export const updateNameOrSlug = async (uid: string, name: string, slug: string) => {
  const db = getFirebaseDb()
  const dbRef = collection(db, COLLECTION.USER);
  const q = query(dbRef, where('uid', '==', uid));

  const querySnapshot = await getDocs(q);

  if (querySnapshot.size > 0) {
    try {
      querySnapshot.forEach(async (doc) => {
        await updateDoc(doc.ref, {
          uid,
          name,
          slug
        });
      });
    } catch (e) {
      console.error('Error updating name or slug user: ', {
        uid,
        name,
        slug
      }, e);
    }
  }
}

export const sendQuestionToOwner = async (ownerUid: string, question: string) => {
  const db = getFirebaseDb()
  const dbRef = collection(db, COLLECTION.QUESTIONS);
  const q = query(dbRef, where('uid', '==', ownerUid));

  const querySnapshot = await getDocs(q);

  const newData: Question = {
    owner: ownerUid,
    qid: uuidv4(),
    q: question || '',
    s: 0
  }

  if (querySnapshot.size === 0) {
    await addDoc(dbRef, newData);
  }
}