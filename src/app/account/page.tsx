"use client"

import { getFirebaseAuth } from '@/lib/firebase'
import { useAuth } from "@/components/FirebaseAuth";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';

const auth = getFirebaseAuth();

export default function Account() {
  const router = useRouter()
  const { isLogin, isLoading, user } = useAuth(auth)

  // Redirect back to /login --> if the session is not found
  useEffect(() => {
    if (!isLoading) {
      if (!isLogin) {
        router.push('/login')
      }
    }
  }, [isLogin, isLoading, router])

  return (
    <main className="w-full container py-8">
      <div className="w-full space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Daftar Pertanyaan Masuk</h2>
        <p className="text-muted-foreground">
          Lihat semua daftar pertanyaan yang masuk ke akun Anda
        </p>
      </div>

      <Separator className="my-6" />

      <div className='w-full flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0'>
        <section className='flex-1 lg:max-w-2xl'>
          <div>Test</div>
        </section>
      </div>
    </main>
  )
}
