"use client"

import { getFirebaseAuth } from '@/lib/firebase'
import { useAuth } from "@/components/FirebaseAuth";

const auth = getFirebaseAuth();

export default function Account() {
  const { isLogin, user } = useAuth(auth)

  return (
    <main className="flex flex-col gap-6 items-center p-24">
      {isLogin && user && (
        <h1 className="text-3xl font-extrabold">
          Welcome, {user?.displayName}
        </h1>
      )}
    </main>
  )
}
