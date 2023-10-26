import { useMutation } from '@tanstack/react-query'

import { postSendQuestion } from '@/lib/api'
import { ErrorResponse } from '@/lib/error'

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
                'Pertanyaan sepertinya mengandung kata-kata yang kami block, silahkan periksa ulang pertanyaan Anda.',
            }

            throw errorResponse
          }
        }
      }
    },
  })
}

export default useSendQuestion
