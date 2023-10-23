import { useMutation } from '@tanstack/react-query'

import { postSendQuestion } from '@/lib/api'

type SendQuestionInput = {
  slug: string
  q: string
  token: string
}

const useSendQuestion = () => {
  return useMutation({
    mutationFn: ({ slug, q, token }: SendQuestionInput) => {
      return postSendQuestion(slug, q, token)
    },
  })
}

export default useSendQuestion
