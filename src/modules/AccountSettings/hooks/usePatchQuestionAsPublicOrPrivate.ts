import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'

import { useAuth } from '@/components/FirebaseAuth'
import { patchQuestionAsPublicOrPrivate } from '@/lib/api'
import { getFirebaseAuth } from '@/lib/firebase'
import { Question } from '@/lib/types'

const payloadSchema = z.object({
  uuid: z.string(),
  public: z.boolean(),
})

const auth = getFirebaseAuth()

export const usePatchQuestionAsPublicOrPrivate = () => {
  const { user } = useAuth(auth)

  const mutation = useMutation({
    mutationFn: (variable?: Question | null) => {
      // Validate
      const validatedVariable = payloadSchema.parse(variable)

      if (!user) throw new Error('User is not logged in')

      // Request
      return patchQuestionAsPublicOrPrivate(
        validatedVariable.uuid,
        validatedVariable.public ? 'PRIVATE' : 'PUBLIC',
        user,
      )
    },
  })

  return mutation
}
