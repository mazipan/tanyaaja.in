'use client'

import React, { useEffect, useState } from 'react'

import { Loader2 } from 'lucide-react'

import EmptyState from '@/components/EmptyState'
import { useAuth } from '@/components/FirebaseAuth'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { getFirebaseAuth, trackEvent } from '@/lib/firebase'
import { Question } from '@/lib/types'
import { calculatePageItemCount } from '@/lib/utils'
import { AccountVisibilityReminder } from '@/modules/AccountSettings/AccountVisibilityReminder'
import { QuestionPanel } from '@/modules/AccountSettings/QuestionCard'
import { QuestionLoader } from '@/modules/AccountSettings/QuestionLoader'
import { QuestionResponsive } from '@/modules/AccountSettings/QuestionPreview/QuestionResponsive'
import { StatisticPanel } from '@/modules/AccountSettings/StatisticPanel'
import { useOwner, useQuestionListPagination } from '@/queries/useQueries'

const auth = getFirebaseAuth()
const LIMIT = 10

export default function Account() {
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false)
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null,
  )
  const { isLogin, isLoading, user } = useAuth(auth)

  const { data: dataOwner, isLoading: isLoadingOwner } = useOwner(user!, {
    enabled: !isLoading && isLogin && !!user,
  })

  const {
    data: dataPagination,
    isLoading: isLoadingQuestions,
    fetchNextPage,
    isFetching,
  } = useQuestionListPagination(user!, LIMIT, {
    enabled: !isLoading && isLogin && !!user,
  })

  const handleClickQuestion = (question: Question) => {
    setSelectedQuestion(question)
    setIsOpenDialog(true)
  }

  useEffect(() => {
    trackEvent('view account page')
  }, [])

  return (
    <>
      <div className="w-full space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">
          Daftar Pertanyaan Masuk
        </h2>
        <p className="text-muted-foreground">
          Lihat semua daftar pertanyaan anonim yang tersedia
        </p>
      </div>

      <Separator className="my-6" />

      <div className="w-full flex flex-col gap-6">
        <StatisticPanel owner={dataOwner?.data} />
        {isLoadingOwner || isLoadingQuestions ? (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold tracking-tight">
              Memuat data pertanyaan...
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {[1, 2, 3].map((item) => (
                <QuestionLoader key={item} index={item} />
              ))}
            </div>
          </div>
        ) : dataPagination?.pages &&
          dataPagination.pages &&
          dataPagination?.pages[0].data.length > 0 ? (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold tracking-tight">
              {calculatePageItemCount(dataPagination.pages)} pertanyaan belum
              dijawab
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {dataPagination.pages.map((questionParent, indexParent) => {
                return (
                  <React.Fragment key={indexParent}>
                    {questionParent?.data?.map((q, indexQuestion) => {
                      return (
                        <QuestionPanel
                          key={q.uid}
                          owner={dataOwner?.data}
                          question={q}
                          onClick={handleClickQuestion}
                          index={indexParent * LIMIT + indexQuestion + 1}
                        />
                      )
                    })}
                  </React.Fragment>
                )
              })}
            </div>
            <div className="flex  justify-center">
              {dataPagination?.pages[dataPagination?.pages.length - 1]
                .hasMore ? (
                <Button
                  disabled={isFetching}
                  onClick={() => fetchNextPage()}
                  className="w-[400px]"
                >
                  {!isFetching ? (
                    'Load More'
                  ) : (
                    <>
                      <Loader2 className="animate-spin" size={20} /> Loading
                    </>
                  )}
                </Button>
              ) : null}
            </div>
          </div>
        ) : (
          <EmptyState
            title="Tidak ada satupun pertanyaan"
            description="Maaf, tapi sepertinya tidak ada satupun pertanyaan yang belum kamu baca. Mulai bagikan halaman publikmu dan dapatkan pertanyaan dari siapapun."
          />
        )}
      </div>

      {!isLoadingOwner && (
        <AccountVisibilityReminder
          show={dataOwner ? !dataOwner.data.public : false}
        />
      )}

      <QuestionResponsive
        isOpen={isOpenDialog}
        onOpenChange={setIsOpenDialog}
        user={user}
        owner={dataOwner?.data}
        question={selectedQuestion}
      />
    </>
  )
}
