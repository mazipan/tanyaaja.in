'use client'

import React, { useEffect, useState } from 'react'

import { CalendarDays, Loader2 } from 'lucide-react'

import EmptyState from '@/components/EmptyState'
import { useAuth } from '@/components/FirebaseAuth'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { getFirebaseAuth, trackEvent } from '@/lib/firebase'
import type { Question } from '@/lib/types'
import { calculatePageItemCount } from '@/lib/utils'
import { AccountVisibilityReminder } from '@/modules/AccountSettings/AccountVisibilityReminder'
import { QuestionLoader } from '@/modules/AccountSettings/QuestionLoader'
import { QuestionResponsive } from '@/modules/AccountSettings/QuestionPreview/QuestionResponsive'
import { useOwner, useQuestionListPagination } from '@/queries/useQueries'

const auth = getFirebaseAuth()
const LIMIT = 15

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
  } = useQuestionListPagination(user!, LIMIT, 'done', {
    enabled: !isLoading && isLogin && !!user,
  })

  const _handleClickQuestion = (question: Question) => {
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
          Pertanyaan Telah Dijawab
        </h2>
        <p className="text-muted-foreground">
          Daftar semua pertanyaan yang telah telah kamu jawab dan ditandai
          sebagai selesai.
        </p>
      </div>

      <Separator className="my-6" />

      <div className="w-full flex flex-col gap-6">
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
              {calculatePageItemCount(dataPagination.pages)} pertanyaan telah
              dijawab
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {dataPagination.pages.map((questionParent, indexParent) => {
                return (
                  <React.Fragment key={indexParent}>
                    {questionParent?.data?.map((q) => {
                      return (
                        <Card
                          className="relative min-h-[200px] flex flex-col"
                          key={q.uid}
                        >
                          <CardHeader>
                            <CardDescription className="flex gap-1 items-center">
                              <CalendarDays className="w-4 h-4" />
                              {new Date(q.submitted_date).toLocaleDateString(
                                'id-ID',
                                {
                                  year: 'numeric',
                                  month: 'short',
                                  day: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                },
                              )}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="flex-1">
                            <p className="">{q.question}</p>
                          </CardContent>
                        </Card>
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
            description={
              <span>
                Kamu belum pernah menjawab pertanyaan. <br />
                Mulai bagikan jawabanmu melalui sosial media dan tandai
                pertanyaan sebagai sudah dijawab.
              </span>
            }
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
