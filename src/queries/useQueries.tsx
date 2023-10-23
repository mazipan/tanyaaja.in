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
  getAllPublicUsers,
  getAllQuestions,
  getAllQuestionsWithPagination,
  getExistingChannelNotif,
  getExistingCustomOg,
  getExistingUser,
} from '@/lib/api'
import {
  CustomOg,
  IResponseGetPublicUserList,
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
  limit: number,
  config?: UseInfiniteQueryOptions<IResponseGetQuestionPagination, Error>,
): UseInfiniteQueryResult<IResponseGetQuestionPagination, Error> => {
  return useInfiniteQuery<IResponseGetQuestionPagination, Error>(
    ['/questions', user?.uid],
    async ({ pageParam }): Promise<IResponseGetQuestionPagination> =>
      getAllQuestionsWithPagination({
        user: user,
        limit: limit,
        cursor: pageParam ?? '',
      }),
    {
      ...config,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
      getNextPageParam: (firstPage) => {
        return firstPage.next ?? undefined
      },
    },
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

export const useGetPublicUser = (
  param: { limit: number; name: string },
  config?: UseInfiniteQueryOptions<IResponseGetPublicUserList, Error>,
): UseInfiniteQueryResult<IResponseGetPublicUserList, Error> => {
  return useInfiniteQuery<IResponseGetPublicUserList, Error>(
    ['/public-user', param.name === '' ? 'empty-search' : param.name],
    async ({ pageParam }): Promise<IResponseGetPublicUserList> =>
      getAllPublicUsers({
        limit: param.limit,
        name: param.name,
        offset: pageParam ?? '',
      }),
    {
      ...config,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
      getNextPageParam: (firstPage) => {
        return firstPage.next ?? undefined
      },
    },
  )
}
