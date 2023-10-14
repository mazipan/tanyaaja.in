import React from 'react'

import { Lock, Unlock } from 'lucide-react'

import { Toggle } from '@/components/ui/toggle'
import { trackEvent } from '@/lib/firebase'
import { Question } from '@/lib/types'
import { usePatchQuestionAsPublicOrPrivate } from '@/modules/AccountSettings/hooks/usePatchQuestionAsPublicOrPrivate'

import { useToast } from './ui/use-toast'

interface PublicAccessTogglerProps {
  question: Question
  disabled?: boolean // allow parent to override
  onMutateSuccess?: (question: Question) => void
}

const PublicAccessToggler = ({
  question,
  disabled,
  onMutateSuccess,
}: PublicAccessTogglerProps) => {
  const { toast } = useToast()

  const patchQuestionAsPublicOrPrivateMutation =
    usePatchQuestionAsPublicOrPrivate()

  const handleTogglePrivacy = () => {
    trackEvent('click toggle public access')

    patchQuestionAsPublicOrPrivateMutation.mutate(question, {
      onSuccess: () => {
        onMutateSuccess?.(question)
      },
      onError: () => {
        toast({
          title: 'Gagal menyimpan perubahan',
          description: `Gagal saat mencoba mengubah hak akses publik ke laman pertanyaan, coba sesaat lagi!`,
        })
      },
    })
  }

  return (
    <Toggle
      variant="outline"
      aria-label="Toggle Question Privacy"
      className="data-[state=on]:bg-success"
      defaultPressed={question?.public}
      pressed={question?.public}
      disabled={disabled ?? patchQuestionAsPublicOrPrivateMutation.isLoading}
      onPressedChange={handleTogglePrivacy}
    >
      {question?.public ? (
        <Unlock className="w-4 h-4" />
      ) : (
        <Lock className="w-4 h-4" />
      )}
    </Toggle>
  )
}

export default PublicAccessToggler
