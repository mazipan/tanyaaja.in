import { useMutation } from '@tanstack/react-query'

import { useAuth } from '@/components/FirebaseAuth'
import { patchQuestionAsPublicOrPrivate } from '@/lib/api'
import { getFirebaseAuth } from '@/lib/firebase'
import { Question } from '@/lib/types'

const payloadSchema = {
  uuid: string,
  public: boolean,
  fromQuestion(question: Question) : object {
    if (this.uuid === undefined)
      throw new Error('uuid is required');
    if (this.public === undefined)
      throw new Error('public is required');

    return { 
      uuid: question.uuid,
      public: question.public
    }
  }
};

const auth = getFirebaseAuth()

export const usePatchQuestionAsPublicOrPrivate = () => {
  const { user } = useAuth(auth)

  const mutation = useMutation({
    mutationFn: (variable?: Question | null) => {
      // Validate
      const validatedVariable = payloadSchema.fromQuestion(variable)

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
