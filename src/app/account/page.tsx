"use client"

import { getFirebaseAuth } from '@/lib/firebase'
import { useAuth } from "@/components/FirebaseAuth";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { getAllQuestions } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';

const auth = getFirebaseAuth();

export default function Account() {
  const router = useRouter()
  const [questions, setQuestions] = useState([])
  const { isLogin, isLoading, user } = useAuth(auth)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchQuestionsFromDb = async () => {
    if (user) {
      const res = await getAllQuestions(user)

      if (res && res.data) {
        setQuestions(res.data || [])
      }
    }
  }

  // Redirect back to /login --> if the session is not found
  useEffect(() => {
    if (!isLoading) {
      if (!isLogin) {
        router.push('/login')
      } else {
        fetchQuestionsFromDb()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        {questions && questions.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-2'>
            {questions.map(q => (
              <Card key={q.uuid} className='min-h-[200px] flex flex-col items-center justify-center'>
                <p className='p-4'>
                  {q.question}
                </p>
              </Card>
            ))}
          </div>
        ) : null}
      </div>
    </main>
  )
}
