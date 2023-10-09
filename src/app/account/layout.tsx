'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { useAuth } from '@/components/FirebaseAuth'
import { getFirebaseAuth } from '@/lib/firebase'

const auth = getFirebaseAuth()

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { isLogin, isLoading } = useAuth(auth)

  // Redirect back to /login --> if the session is not found
  useEffect(() => {
    if (!isLoading) {
      if (!isLogin) {
        router.push('/login')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogin, isLoading, router])

  return <main className="w-full container py-8">{children}</main>
}
