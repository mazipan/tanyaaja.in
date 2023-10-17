'use client'

import { User } from 'firebase/auth'

import { useDialog } from '@/components/dialog/DialogStore'
import { Button } from '@/components/ui/button'
import { trackEvent } from '@/lib/firebase'
import { Question } from '@/lib/types'

import { useMarkQuestionAsDone } from '../hooks/useMarkQuestionAsDone'
import { QuestionPreviewProps } from './helpers'

export const ButtonAction = ({
  question,
  user,
  onOpenChange,
}: Omit<QuestionPreviewProps, 'isOpen' | 'owner'>) => {
  const dialog = useDialog()
  const { mutate } = useMarkQuestionAsDone({
    onMutate: () => {
      onOpenChange(false)
    },
  })

  const markAsDone = async (question: Question, user: User) => {
    trackEvent('click mark as done')
    mutate({ uuid: question.uuid, user })
  }

  const handleMarkAsDone = () => {
    if (question && user) {
      dialog({
        title: 'Tandai pertanyaan sudah dijawab?',
        description:
          'Pertanyaan yang sudah dijawab akan menghilang dari daftar pertanyaan Anda dan tidak dapat dikembalikan. Apakah Anda yakin ingin melanjutkan aksi ini?',
        submitButton: {
          label: 'Ya, Tandai Sudah Dijawab',
          variant: 'destructive',
        },
        onConfirm: () => markAsDone(question, user),
      })
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-2">
      <Button type="button" onClick={handleMarkAsDone}>
        Tandai sudah dijawab
      </Button>
    </div>
  )
}
