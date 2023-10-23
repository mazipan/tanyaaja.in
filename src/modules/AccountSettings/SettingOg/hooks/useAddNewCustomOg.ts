import { useMutation } from '@tanstack/react-query'
import type { User } from 'firebase/auth'

import { postAddNewCustomOg } from '@/lib/api'
import type { CreateCustomOgArgs } from '@/lib/types'

const useAddNewCustomOg = () => {
  return useMutation({
    mutationFn: (body: { user: User; params: CreateCustomOgArgs }) => {
      return postAddNewCustomOg(body.user, body.params)
    },
  })
}

export default useAddNewCustomOg
