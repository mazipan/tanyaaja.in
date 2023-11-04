import React from 'react'

import { Loader2 } from 'lucide-react'

import { trackEvent } from '@/lib/firebase'
import { Question } from '@/lib/types'
import { usePatchQuestionAsPublicOrPrivate } from '@/modules/AccountSettings/hooks/usePatchQuestionAsPublicOrPrivate'

import { useDialog } from './dialog/DialogStore'
import { Button } from './ui/button'
import { useToast } from './ui/use-toast'

interface PublicAccessTogglerProps {
  question: Question
  disabled?: boolean // allow parent to override
  onSuccess?: (question: Question) => void
}

const PublicAccessToggler = ({
  question,
  disabled,
  onSuccess,
}: PublicAccessTogglerProps) => {
  const { toast } = useToast()
  const dialog = useDialog()

  const { mutate, isPending } = usePatchQuestionAsPublicOrPrivate()

  const hitMutation = async () => {
    trackEvent('click toggle public access')

    mutate(question, {
      onSuccess: () => {
        onSuccess?.(question)
      },
      onError: () => {
        toast({
          title: 'Gagal menyimpan perubahan',
          description: `Gagal saat mencoba mengubah hak akses publik ke laman pertanyaan, coba sesaat lagi!`,
        })
      },
    })
  }

  const handleTogglePrivacy = () => {
    if (!question?.public) {
      dialog({
        title: 'Apakah Anda yakin ingin membuka akses ke publik?',
        description:
          'Membuka pertanyaan ke publik berarti memberikan akses ke siapapun untuk bisa melihat pertanyaan Anda.',
        submitButton: {
          label: 'Ya, Buka Akses',
          variant: 'destructive',
        },
        onConfirm: hitMutation,
      })
    } else {
      hitMutation()
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className={question?.public ? '' : 'border-red-500'}
      disabled={disabled ?? isPending}
      onClick={handleTogglePrivacy}
    >
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        </>
      ) : null}
      {question?.public ? <>Larang akses publik</> : <>Buka ke publik</>}
    </Button>
  )
}

export default PublicAccessToggler
