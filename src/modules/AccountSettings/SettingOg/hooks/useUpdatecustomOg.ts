import { useMutation } from '@tanstack/react-query'
import type { User } from 'firebase/auth'

import { patchUpdateCustomOg } from '@/lib/api'
import type { CreateCustomOgArgs } from '@/lib/types'

const useUpdateCustomOg = () => {
  return useMutation({
    mutationFn: (body: { user: User; params: CreateCustomOgArgs }) => {
      return patchUpdateCustomOg(body.user, body.params)
    },
  })
}

export default useUpdateCustomOg
