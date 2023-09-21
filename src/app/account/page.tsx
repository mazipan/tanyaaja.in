'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import EmptyState from '@/components/EmptyState'
import { useAuth } from '@/components/FirebaseAuth'
import { Separator } from '@/components/ui/separator'
import { getAllQuestions, getExistingUser } from '@/lib/api'
import { getFirebaseAuth } from '@/lib/firebase'
import { Question, UserProfile } from '@/lib/types'
import { QuestionPanel } from '@/modules/AccountSettings/QuestionCard'
import { QuestionDialog } from '@/modules/AccountSettings/QuestionDialog'
import { QuestionLoader } from '@/modules/AccountSettings/QuestionLoader'
import { StatisticPanel } from '@/modules/AccountSettings/StatisticPanel'

const auth = getFirebaseAuth()

export default function Account() {
  const router = useRouter()
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true)
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false)
  const [owner, setOwner] = useState<UserProfile | null>(null)
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null,
  )
  const [questions, setQuestions] = useState<Question[]>([])
  const { isLogin, isLoading, user } = useAuth(auth)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchQuestionsFromDb = async (skipLoader = false) => {
    if (!skipLoader) {
      setIsLoadingData(true)
    }
    if (user) {
      const res = await getAllQuestions(user)

      if (res && res.data) {
        setQuestions(res.data || [])
      }
    }
    if (!skipLoader) {
      setIsLoadingData(false)
    }
  }

  const fetchUserFromDb = async (skipLoader = false) => {
    if (!skipLoader) {
      setIsLoadingData(true)
    }
    if (user) {
      const res = await getExistingUser(user)

      if (res && res.data) {
        setOwner(res.data)
      }
    }
    if (!skipLoader) {
      setIsLoadingData(false)
    }
  }

  const fetchInitialData = async () => {
    setIsLoadingData(true)
    await fetchUserFromDb(true)
    await fetchQuestionsFromDb(true)
    setIsLoadingData(false)
  }

  const handleClickQuestion = (question: Question) => {
    setSelectedQuestion(question)
    setIsOpenDialog(true)
  }

  // Redirect back to /login --> if the session is not found
  useEffect(() => {
    if (!isLoading) {
      if (!isLogin) {
        router.push('/login')
      } else {
        fetchInitialData()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogin, isLoading, router])

  return (
    <>
      <main className="w-full container py-8">
        <div className="w-full space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">
            Daftar Pertanyaan Masuk
          </h2>
          <p className="text-muted-foreground">
            Lihat semua daftar pertanyaan anonim yang tersedia
          </p>
        </div>

        <Separator className="my-6" />

        <div className="w-full flex flex-col gap-4">
          {isLoadingData ? (
            <>
              <StatisticPanel owner={owner} />

              <h3 className="text-2xl font-bold tracking-tight flex gp-2 items-center">
                Memuat data pertanyaan...
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {[1, 2, 3].map((item) => (
                  <QuestionLoader key={item} index={item} />
                ))}
              </div>
            </>
          ) : (
            <>
              <StatisticPanel owner={owner} />
              {questions && questions.length > 0 ? (
                <>
                  <h3 className="text-2xl font-bold tracking-tight flex gp-2 items-center">
                    {questions.length} pertanyaan belum dijawab
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {questions.map((q: Question, index) => (
                      <QuestionPanel
                        key={q.uuid}
                        owner={owner}
                        question={q}
                        onClick={handleClickQuestion}
                        index={index + 1}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <EmptyState
                  title="Tidak ada satupun pertanyaan"
                  description="Maaf, tapi sepertinya tidak ada satupun pertanyaan yang belum kamu baca. Mulai bagikan halaman publikmu dan dapatkan pertanyaan dari siapapun."
                />
              )}
            </>
          )}
        </div>
      </main>

      <QuestionDialog
        isOpen={isOpenDialog}
        onOpenChange={setIsOpenDialog}
        user={user}
        owner={owner}
        onRefetch={fetchQuestionsFromDb}
        question={selectedQuestion}
      />
    </>
  )
}
