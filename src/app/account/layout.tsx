'use client'

import { useRouter } from 'next/navigation'

import { Loader2 } from 'lucide-react'

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
  if (!isLoading && !isLogin) {
    router.push('/login')
  }
  // if there no login and user alredy login then render the main content
  if (!isLoading && isLogin) {
    return <main className="w-full container py-8">{children}</main>
  }
  // if the condition above didnt fullfill then we expect still loading
  return (
    <main className="w-full container h-[50vh]  my-auto flex justify-center items-center py-8">
      <Loader2 className="animate-spin" size={40} />
    </main>
  )
}
