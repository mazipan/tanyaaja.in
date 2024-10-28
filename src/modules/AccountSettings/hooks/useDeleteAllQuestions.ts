import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { User } from 'firebase/auth'

import { toast } from '@/components/ui/use-toast'
import { deleteAllQuestions } from '@/lib/api'
import { type ErrorResponse, isErrorResponse } from '@/lib/error'

type MutationFnBody = {
  user: User
}

const deleteAllQuestionsByUser = async (user: User) => {
  try {
    const res = await deleteAllQuestions(user)

    return res
  } catch {
    const errorResponse: ErrorResponse = {
      type: 'toast',
      message: 'Gagal menghapus pertanyaan, coba sesaat lagi!',
    }

    throw errorResponse
  }
}

export const useDeleteAllQuestions = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ user }: MutationFnBody) => {
      return deleteAllQuestionsByUser(user)
    },
    onSuccess: () => {
      toast({
        title: 'Berhasil menghapus!',
        description: `Berhasil menghapus semua pertanyaan yang tersedia!`,
      })
    },
    onError: (error) => {
      if (isErrorResponse(error) && error.type === 'toast') {
        toast({
          title: 'Gagal menghapus!',
          description: error.message,
        })
      }
    },
    onSettled: (_data, _error, { user }) => {
      // invalidate user query to ensure the user data displayed is the latest data
      queryClient.invalidateQueries({ queryKey: ['/owner', user.uid] })
      queryClient.invalidateQueries({
        queryKey: ['/questions', user.uid, 'pending'],
      })
      queryClient.invalidateQueries({
        queryKey: ['/questions', user.uid, 'done'],
      })
    },
  })
}
