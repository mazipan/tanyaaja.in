import {
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query'
import { User } from 'firebase/auth'

import {
  getAllQuestions,
  getAllQuestionsWithPagination,
  getExistingChannelNotif,
  getExistingUser,
} from '@/lib/api'
import {
  IResponseGetQuestionPagination,
  NotifChannel,
  Question,
  UserProfile,
} from '@/lib/types'

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
export const useQuestionListPagination = (
  user: User,

  config?: UseInfiniteQueryOptions<IResponseGetQuestionPagination, Error>,
): UseInfiniteQueryResult<IResponseGetQuestionPagination, Error> => {
  return useInfiniteQuery<IResponseGetQuestionPagination, Error>(
    ['/questionsPagination', user?.uid],
    async ({ pageParam }): Promise<IResponseGetQuestionPagination> =>
      getAllQuestionsWithPagination({
        user: user,
        limit: 10,
        cursor: pageParam ?? '',
      }),
    {
      ...config,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
      getPreviousPageParam: (firstPage) => firstPage.next ?? undefined,
      getNextPageParam: (firstPage) => {
        return firstPage.next ?? undefined
      },
    },
  )
}

export const useNotifChannelByUser = (
  user: User,
  config?: UseQueryOptions<{ data: NotifChannel[] }, Error>,
): UseQueryResult<{ data: NotifChannel[] }, Error> => {
  return useQuery<{ data: NotifChannel[] }, Error>(
    ['/user-notif-channel', user?.uid],
    async (): Promise<{ data: NotifChannel[] }> =>
      getExistingChannelNotif(user),
    config,
  )
}
