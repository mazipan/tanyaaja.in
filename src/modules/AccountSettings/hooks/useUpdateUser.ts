import { useMutation, useQueryClient } from '@tanstack/react-query'
import { User } from 'firebase/auth'

import { toast } from '@/components/ui/use-toast'
import { checkTheSlugOwner, patchUpdateUser } from '@/lib/api'
import { ErrorResponse, isErrorResponse } from '@/lib/error'

type UpdateUserBody = {
  name: string
  slug: string
  image: string
  public: boolean
  x_username?: string
}

type MutationFnBody = {
  user: User
  slug: string
  bodyToUpdate: UpdateUserBody
}

const updateUser = async (user: User, body: UpdateUserBody) => {
  try {
    const res = await patchUpdateUser(user, body)

    return res
  } catch {
    const errorResponse: ErrorResponse = {
      type: 'toast',
      message: 'Gagal menyimpan perubahan setelan, coba sesaat lagi!',
    }

    throw errorResponse
  }
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ user, slug, bodyToUpdate }: MutationFnBody) => {
      try {
        const res = await checkTheSlugOwner(user, slug)

        if (res.data === 'NOT_EXIST') {
          return updateUser(user, bodyToUpdate)
        }

        if (res.data === 'EXIST') {
          const errorResponse: ErrorResponse = {
            type: 'form-field',
            message:
              'Slug ini sepertinya sudah digunakan oleh orang lain. Ganti slug lain dan coba lagi',
          }

          throw errorResponse
        }

        const errorResponse: ErrorResponse = {
          type: 'toast',
          message:
            'Gagal saat mencoba mengecek ketersediaan slug, silahkan coba beberapa saat lagi!',
        }
        throw errorResponse
      } catch (error) {
        if (error instanceof Response) {
          const err = await error.json()

          if (err?.data === 'NOT_EXIST') {
            return updateUser(user, bodyToUpdate)
          }
        }

        if (isErrorResponse(error)) {
          throw error
        }

        const errorResponse: ErrorResponse = {
          type: 'form-field',
          message:
            'Gagal mengecek ketersediaan slug, coba logout dan login kembali, kemudian coba ulangi melakukan perubahan ini.',
        }

        throw errorResponse
      }
    },
    onSuccess: () => {
      toast({
        title: 'Perubahan berhasil disimpan',
        description: `Berhasil menyimpan perubahan setelan!`,
      })
    },
    onError: (error) => {
      if (isErrorResponse(error) && error.type === 'toast') {
        toast({
          title: 'Gagal menyimpan',
          description: error.message,
        })
      }
    },
    onSettled: (_data, _error, { user }) => {
      // invalidate user query to ensure the user data displayed is the latest data
      queryClient.invalidateQueries({ queryKey: ['/owner', user.uid] })
    },
  })
}
