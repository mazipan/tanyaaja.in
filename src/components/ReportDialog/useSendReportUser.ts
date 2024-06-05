import { useMutation } from '@tanstack/react-query'

import { postReportUser } from '@/lib/api'
import { ErrorResponse } from '@/lib/error'

type Props = {
  user: string
  reason: string
}

const useSendReportUser = () => {
  return useMutation({
    mutationFn: async ({ user, reason }: Props) => {
      try {
        return await postReportUser(reason, user)
      } catch (error) {
        if (error instanceof Response) {
          const err = await error.json()
          const errorResponse: ErrorResponse = {
            type: 'toast',
            message: err.data || 'Error while report user',
          }

          throw errorResponse
        }
      }
    },
  })
}

export default useSendReportUser
