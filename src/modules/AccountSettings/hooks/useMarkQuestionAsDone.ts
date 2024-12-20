import {
  type InfiniteData,
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import type { User } from 'firebase/auth'

import { toast } from '@/components/ui/use-toast'
import { patchQuestionAsDone } from '@/lib/api'
import type { IResponseGetQuestionPagination } from '@/lib/types'

export const useMarkQuestionAsDone = <
  TData = unknown,
  TError = unknown,
  TContext = unknown,
>({
  onMutate,
}: Pick<
  UseMutationOptions<TData, TError, { uuid: string; user: User }, TContext>,
  'onMutate'
>) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: { uuid: string; user: User }) =>
      patchQuestionAsDone(body.uuid, body.user),
    onMutate: async (variables) => {
      const { uuid, user } = variables

      await queryClient.cancelQueries({
        queryKey: ['/questions', user.uid, 'pending'],
      })

      const prevQuestions = queryClient.getQueryData<
        InfiniteData<IResponseGetQuestionPagination> | undefined
      >(['/questions', user.uid, 'pending'])

      if (prevQuestions) {
        const updatedListQuestion = prevQuestions.pages.map((prevQuestion) => {
          const filteredPrevQuestion = prevQuestion.data.filter(
            (questionItem) => {
              return questionItem.uuid !== uuid
            },
          )
          return { ...prevQuestion, data: filteredPrevQuestion }
        })

        // optimistically update questions list
        queryClient.setQueryData<
          InfiniteData<IResponseGetQuestionPagination> | undefined
        >(['/questions', user.uid, 'pending'], {
          ...prevQuestions,
          pages: updatedListQuestion,
        })
      }

      if (typeof onMutate === 'function') {
        onMutate(variables)
      }

      return { prevQuestions }
    },
    onError: (_err, { user }, context) => {
      queryClient.setQueryData(
        ['/questions', user.uid, 'pending'],
        context?.prevQuestions,
      )

      toast({
        title: 'Gagal menyimpan perubahan',
        description:
          'Gagal saat mencoba menandai pertanyaan sebagai sudah dijawab, coba sesaat lagi!',
      })
    },
    onSettled: (_data, _err, { user }) => {
      queryClient.invalidateQueries({
        queryKey: ['/questions', user.uid, 'pending'],
      })
    },
  })
}
