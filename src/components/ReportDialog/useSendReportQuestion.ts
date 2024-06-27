import { useMutation } from '@tanstack/react-query'
import type { User } from 'firebase/auth'

import { postReportQuestion } from '@/lib/api'
import type { ErrorResponse } from '@/lib/error'

type Props = {
  user: User
  uuid: string
  reason: string
}

const useSendReportQuestion = () => {
  return useMutation({
    mutationFn: async ({ user, reason, uuid }: Props) => {
      try {
        return await postReportQuestion({ user, reason, questionUuid: uuid })
      } catch (error) {
        if (error instanceof Response) {
          const err = await error.json()
          const errorResponse: ErrorResponse = {
            type: 'toast',
            message: err.message || 'Error while report question',
          }

          throw errorResponse
        }
      }
    },
  })
}

export default useSendReportQuestion
