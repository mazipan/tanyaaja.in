import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Auth, signOut, User } from 'firebase/auth'

import { toast } from '@/components/ui/use-toast'
import { deleteUser, destroyActiveSession } from '@/lib/api'
import { ErrorResponse, isErrorResponse } from '@/lib/error'

type MutationFnBody = {
  user: User
  auth: Auth
}

const callDeleteUser = async (user: User) => {
  try {
    const res = await deleteUser(user)

    return res
  } catch {
    const errorResponse: ErrorResponse = {
      type: 'toast',
      message: 'Gagal menghapus pengguna, coba sesaat lagi!',
    }

    throw errorResponse
  }
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ user }: MutationFnBody) => {
      return callDeleteUser(user)
    },
    onSuccess: () => {
      toast({
        title: 'Berhasil menghapus!',
        description: `Berhasil menghapus pengguna besera semua pertanyaan yang terkait!`,
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
    onSettled: (_data, _error, { user, auth }) => {
      // invalidate user query to ensure the user data displayed is the latest data
      queryClient.invalidateQueries({ queryKey: ['/owner', user.uid] })
      queryClient.invalidateQueries({ queryKey: ['/questions', user.uid] })
      destroyActiveSession(user)
      signOut(auth)
    },
  })
}
