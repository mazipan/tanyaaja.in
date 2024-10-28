import {
  type InfiniteData,
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import type { User } from 'firebase/auth'

import { toast } from '@/components/ui/use-toast'
import { archiveQuestion } from '@/lib/api'
import type { IResponseGetQuestionPagination } from '@/lib/types'

export const useArchiveQuestion = <
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
      archiveQuestion(body.uuid, body.user),
    onMutate: async (variables) => {
      const { uuid, user } = variables

      await queryClient.cancelQueries({
        queryKey: ['/questions', user.uid, 'done'],
      })

      const prevQuestions = queryClient.getQueryData<
        InfiniteData<IResponseGetQuestionPagination> | undefined
      >(['/questions', user.uid, 'done'])

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
        >(['/questions', user.uid, 'done'], {
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
        ['/questions', user.uid, 'done'],
        context?.prevQuestions,
      )

      toast({
        title: 'Gagal mengarsipkan pertanyaan',
        description:
          'Gagal saat mencoba mengarsipkan pertanyaan, coba sesaat lagi!',
      })
    },
    onSettled: (_data, _err, { user }) => {
      queryClient.invalidateQueries({
        queryKey: ['/questions', user.uid, 'done'],
      })
    },
  })
}
