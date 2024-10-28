'use client'

import React, { useEffect } from 'react'

import EmptyState from '@/components/EmptyState'
import { useAuth } from '@/components/FirebaseAuth'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { getFirebaseAuth, trackEvent } from '@/lib/firebase'
import { AccountVisibilityReminder } from '@/modules/AccountSettings/AccountVisibilityReminder'
import { useArchiveQuestion } from '@/modules/AccountSettings/hooks/useArchiveQuestion'
import { useOwner, useQuestionListPagination } from '@/queries/useQueries'
import { Archive, Loader2 } from 'lucide-react'
import { Form, useForm } from 'react-hook-form'

const auth = getFirebaseAuth()
const LIMIT = 15

import { Skeleton } from '@/components/ui/skeleton'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { type InferOutput, array, object, string } from 'valibot'

const schema = object({
  items: array(string()),
})

type FormValues = InferOutput<typeof schema>

export default function Account() {
  const { isLogin, isLoading, user } = useAuth(auth)

  const { data: dataOwner, isLoading: isLoadingOwner } = useOwner(user!, {
    enabled: !isLoading && isLogin && !!user,
  })

  const form = useForm<FormValues>({
    resolver: valibotResolver(schema),
    defaultValues: {
      items: [],
    },
  })

  const {
    data: dataPagination,
    isLoading: isLoadingQuestions,
    fetchNextPage,
    isFetching,
  } = useQuestionListPagination(user!, LIMIT, 'done', {
    enabled: !isLoading && isLogin && !!user,
  })

  const { mutate, isPending: isPendingMutation } = useArchiveQuestion({
    onMutate: () => {
      // Do nothing
    },
  })

  function onSubmit(data: FormValues) {
    console.log(' submit ===> ', data.items)
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
            <div className="grid gap-2">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="relative rounded-lg border flex gap-2 p-2 justify-between"
                >
                  <div className="flex gap-2 items-start">
                    <Checkbox checked={false} className="mt-1" />
                    <div className="grid gap-2">
                      <small className="text-muted-foreground text-xs">
                        <Skeleton className="h-2 w-[100px]" />
                      </small>
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    type="button"
                    disabled={true}
                  >
                    <Archive className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : dataPagination?.pages &&
          dataPagination.pages &&
          dataPagination?.pages[0].data.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                type="button"
                onClick={() => {
                  const allItems = dataPagination.pages.flatMap((x) =>
                    x.data.map((y) => y.uuid),
                  )

                  if (form.watch('items')?.length === allItems.length) {
                    form.setValue('items', [])
                    return
                  }

                  form.setValue('items', allItems)
                }}
                variant="outline"
              >
                Pilih semua
              </Button>

              {form.watch('items')?.length > 0 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      type="button"
                      disabled={isPendingMutation}
                    >
                      Arsipkan {form.watch('items')?.length} pertanyaan
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Yakin ingin mengarsipkan semuanya?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Aksi ini tidak dapat dibatalkan. Ini akan menghapus
                        pertanyaan kamu secara permanen dari sistem kami.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          mutate({
                            uuid: form.watch('items').join(','),
                            user: user!,
                          })
                        }}
                      >
                        Lanjutkan
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div className="grid gap-2">
                  {dataPagination.pages.map((questionParent, indexParent) => {
                    return (
                      <React.Fragment key={indexParent}>
                        {questionParent?.data?.map((q) => {
                          return (
                            <div
                              key={q.uuid}
                              className="relative rounded-lg border flex gap-2 p-2 justify-between"
                            >
                              <div className="flex gap-2 items-start">
                                <Checkbox
                                  checked={form
                                    .watch('items')
                                    ?.includes(q.uuid)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      form.setValue('items', [
                                        ...form.watch('items'),
                                        q.uuid,
                                      ])
                                    } else {
                                      form.setValue(
                                        'items',
                                        form
                                          .watch('items')
                                          .filter((x) => x !== q.uuid),
                                      )
                                    }
                                  }}
                                  className="mt-1"
                                />
                                <div className="grid">
                                  <small className="text-muted-foreground text-xs">
                                    {new Date(
                                      q.submitted_date,
                                    ).toLocaleDateString('id-ID', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: '2-digit',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </small>
                                  <span className="text-sm">{q.question}</span>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="icon"
                                type="button"
                                disabled={isPendingMutation}
                                onClick={() => {
                                  mutate({
                                    uuid: q.uuid,
                                    user: user!,
                                  })
                                }}
                              >
                                <Archive className="h-4 w-4" />
                              </Button>
                            </div>
                          )
                        })}
                      </React.Fragment>
                    )
                  })}
                </div>
              </form>
            </Form>
            <div className="flex  justify-center">
              {dataPagination?.pages[dataPagination?.pages.length - 1]
                .hasMore ? (
                <Button
                  disabled={isFetching}
                  onClick={() => fetchNextPage()}
                  className="w-[400px]"
                >
                  {!isFetching ? (
                    'Muat Laman Berikutnya'
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
                Tidak menemukan pertanyaan kamu?
                <br /> Pertanyaan yang telah dijawab akan secara otomatis
                dihapus dari sistem setelah beberapa pekan. <br />
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
    </>
  )
}
