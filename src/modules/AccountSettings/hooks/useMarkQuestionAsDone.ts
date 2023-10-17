import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query'
import { User } from 'firebase/auth'

import { toast } from '@/components/ui/use-toast'
import { patchQuestionAsDone } from '@/lib/api'
import { Question } from '@/lib/types'

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

      await queryClient.cancelQueries({ queryKey: ['/questions', user.uid] })

      const prevQuestions = queryClient.getQueryData<{ data: Question[] }>([
        '/questions',
        user.uid,
      ])

      if (prevQuestions) {
        const filteredQuestions = prevQuestions.data.filter(
          (question) => question.uuid !== uuid,
        )

        // optimistically update questions list
        queryClient.setQueryData<{ data: Question[] }>(
          ['/questions', user.uid],
          { ...prevQuestions, data: filteredQuestions },
        )
      }

      if (typeof onMutate === 'function') {
        onMutate(variables)
      }

      return { prevQuestions }
    },
    onError: (_err, { user }, context) => {
      queryClient.setQueryData(['/questions', user.uid], context?.prevQuestions)

      toast({
        title: 'Gagal menyimpan perubahan',
        description:
          'Gagal saat mencoba menandai pertanyaan sebagai sudah dijawab, coba sesaat lagi!',
      })
    },
    onSettled: (_data, _err, { user }) => {
      queryClient.invalidateQueries({ queryKey: ['/questions', user.uid] })
    },
  })
}
