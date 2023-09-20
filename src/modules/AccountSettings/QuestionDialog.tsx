import { useState } from 'react'
import {
  CalendarIcon,
  LockClosedIcon,
  LockOpen2Icon,
} from '@radix-ui/react-icons'

import { User } from 'firebase/auth'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { patchQuestionAsDone, patchQuestionAsPublicOrPrivate } from '@/lib/api'
import { Question, UserProfile } from '@/lib/types'

interface QuestionDialogProps {
  question: Question | null
  user: User | null
  owner: UserProfile | null
  onOpenChange: (open: boolean) => void
  isOpen: boolean
  onRefetch: () => void
}

export const QuestionDialog = ({
  question,
  user,
  isOpen,
  onOpenChange,
  onRefetch,
}: QuestionDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const { toast } = useToast()

  const markAsDone = async (question: Question) => {
    if (user) {
      try {
        setIsSubmitting(true)
        await patchQuestionAsDone(question.uuid, user)

        toast({
          title: 'Berhasil menandai pertanyaan',
          description: `Berhasil menandai pertanyaan sebagai sudah dijawab!`,
        })

        setIsSubmitting(false)
        onRefetch?.()
        setTimeout(() => {
          onOpenChange(false)
        }, 500)
      } catch (error) {
        setIsSubmitting(false)
        toast({
          title: 'Gagal menyimpan perubahan',
          description: `Gagal saat mencoba menandai pertanyaan sebagai sudah dijawab, coba sesaat lagi!`,
        })
      }
    }
  }

  const togglePublicPrivate = async (question: Question) => {
    if (user) {
      try {
        setIsSubmitting(true)
        await patchQuestionAsPublicOrPrivate(
          question.uuid,
          question.public ? 'PRIVATE' : 'PUBLIC',
          user,
        )

        toast({
          title: 'Berhasil mengubah akses ke pertanyaan',
          description: `Berhasil mengubah akses publik ke laman detail pertanyaan!`,
        })

        setIsSubmitting(false)
        onRefetch?.()
        setTimeout(() => {
          onOpenChange(false)
        }, 500)
      } catch (error) {
        setIsSubmitting(false)
        toast({
          title: 'Gagal menyimpan perubahan',
          description: `Gagal saat mencoba mengubah hak akses publik ke laman pertanyaan, coba sesaat lagi!`,
        })
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mari jawab pertanyaan ini</DialogTitle>
          <DialogDescription>
            {question ? (
              <div className="mb-4 mt-2">
                <div className="flex justify-between items-center">
                  <div className="flex gap-1 items-center">
                    <CalendarIcon />
                    <small>
                      {new Date(question?.submitted_date).toLocaleDateString(
                        'id-ID',
                        {
                          year: 'numeric',
                          month: 'short',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        },
                      )}
                    </small>
                  </div>

                  <div className="flex gap-1 items-center">
                    {question.public ? <LockOpen2Icon /> : <LockClosedIcon />}
                    <small>
                      {question.public
                        ? 'Bisa diakses publik'
                        : 'Tidak bisa diakses public'}
                    </small>
                  </div>
                </div>

                <p className="mt-4">{question?.question}</p>
              </div>
            ) : null}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col gap-2">
          <Button
            type="button"
            disabled={isSubmitting}
            variant={question?.public ? 'ghost' : 'destructive'}
            onClick={() => {
              if (question) {
                togglePublicPrivate(question)
              }
            }}
          >
            {question?.public ? 'Larang akses publik' : 'Beri akses publik'}
          </Button>
          <Button
            type="button"
            disabled={isSubmitting}
            onClick={() => {
              if (question) {
                markAsDone(question)
              }
            }}
          >
            Tandai sudah dijawab
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
