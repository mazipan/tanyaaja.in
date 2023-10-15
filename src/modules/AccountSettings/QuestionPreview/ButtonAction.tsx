'use client'

import { useState } from 'react'
import { DialogClose } from '@radix-ui/react-dialog'

import { useMutation } from '@tanstack/react-query'
import { User } from 'firebase/auth'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { patchQuestionAsDone } from '@/lib/api'
import { trackEvent } from '@/lib/firebase'

import { QuestionPreviewProps } from './helpers'

export const ButtonAction = ({
  question,
  user,
  onOpenChange,
  onRefetch,
}: Omit<QuestionPreviewProps, 'isOpen' | 'owner'>) => {
  const [isOpenDialog, setIsOpenDialog] = useState(false)

  const { toast } = useToast()
  const { status, mutate } = useMutation({
    mutationFn: (body: { uuid: string; user: User }) =>
      patchQuestionAsDone(body.uuid, body.user),
    onSuccess: async () => {
      // we close the dialogs and shows the success toast
      // after questions list has been refetched

      await Promise.resolve(onRefetch())

      setIsOpenDialog(false)
      onOpenChange(false)
      toast({
        title: 'Berhasil menandai pertanyaan',
        description: 'Berhasil menandai pertanyaan sebagai sudah dijawab!',
      })
    },
    onError: () => {
      toast({
        title: 'Gagal menyimpan perubahan',
        description:
          'Gagal saat mencoba menandai pertanyaan sebagai sudah dijawab, coba sesaat lagi!',
      })
    },
  })

  const markAsDone = () => {
    if (question && user) {
      trackEvent('click mark as done')
      mutate({ uuid: question.uuid, user })
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-2">
      <Dialog
        open={isOpenDialog}
        onOpenChange={(state) => {
          // to ensure dialog only opens when a question exists
          // and cannot be closed when mutation is loading
          if (question && status !== 'loading') {
            setIsOpenDialog(state)
          }
        }}
      >
        <DialogTrigger asChild>
          <Button type="button">Tandai sudah dijawab</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tandai pertanyaan sudah dijawab?</DialogTitle>
            <DialogDescription>
              Pertanyaan yang sudah dijawab tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Batal
              </Button>
            </DialogClose>
            <Button type="button" onClick={markAsDone}>
              {status === 'loading' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin shrink-0" />
                  <span>Menandai...</span>
                </>
              ) : (
                'Tandai sudah dijawab'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
