import { useMutation } from '@tanstack/react-query'
import { boolean, object, parse, string } from 'valibot'

import { useAuth } from '@/components/FirebaseAuth'
import { patchQuestionAsPublicOrPrivate } from '@/lib/api'
import { getFirebaseAuth } from '@/lib/firebase'
import { Question } from '@/lib/types'

const payloadSchema = object({
  uuid: string(),
  public: boolean(),
})

const auth = getFirebaseAuth()

export const usePatchQuestionAsPublicOrPrivate = () => {
  const { user } = useAuth(auth)

  const mutation = useMutation({
    mutationFn: (variable?: Question | null) => {
      // Validate
      const validatedVariable = parse(payloadSchema, variable)

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
