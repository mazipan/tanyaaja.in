import { useMutation } from '@tanstack/react-query'

import { postSendQuestion } from '@/lib/api'
import { ErrorResponse } from '@/modules/AccountSettings/hooks/useUpdateUser'

type SendQuestionInput = {
  slug: string
  q: string
  token: string
}

const useSendQuestion = () => {
  return useMutation({
    mutationFn: async ({ slug, q, token }: SendQuestionInput) => {
      try {
        return await postSendQuestion(slug, q, token)
      } catch (error) {
        if (error instanceof Response) {
          const err = await error.json()
          if (err.data === 'CONTAINS_BAD_WORD') {
            const errorResponse: ErrorResponse = {
              type: 'toast',
              message:
                'Pertanyaan mengandung perkataan buruk. Harap gunakan perkataan yang baik',
            }

            throw errorResponse
          }
        }
      }
    },
  })
}

export default useSendQuestion
