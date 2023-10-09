import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query'
import { User } from 'firebase/auth'

import {
  getAllQuestions,
  getExistingCustomOg,
  getExistingUser,
} from '@/lib/api'
import { CustomOg, Question, UserProfile } from '@/lib/types'

export const useOwner = (
  user: User,
  config?: UseQueryOptions<{ data: UserProfile }, Error>,
): UseQueryResult<{ data: UserProfile }, Error> => {
  return useQuery<{ data: UserProfile }, Error>(
    ['/owner', user?.uid],
    async (): Promise<{ data: UserProfile }> => getExistingUser(user),
    config,
  )
}

export const useQuestionList = (
  user: User,
  config?: UseQueryOptions<{ data: Question[] }, Error>,
): UseQueryResult<{ data: Question[] }, Error> => {
  return useQuery<{ data: Question[] }, Error>(
    ['/questions', user?.uid],
    async (): Promise<{ data: Question[] }> => getAllQuestions(user),
    config,
  )
}

export const useCustomOgByUser = (
  user: User,
  config?: UseQueryOptions<{ data: CustomOg[] }, Error>,
): UseQueryResult<{ data: CustomOg[] }, Error> => {
  return useQuery<{ data: CustomOg[] }, Error>(
    ['/user-custom-og', user?.uid],
    async (): Promise<{ data: CustomOg[] }> => getExistingCustomOg(user),
    config,
  )
}
