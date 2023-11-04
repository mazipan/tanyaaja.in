import {
  InfiniteData,
  QueryKey,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
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
  config?: Omit<
    UseQueryOptions<{ data: UserProfile }, Error>,
    'queryKey' | 'queryFn'
  >,
): UseQueryResult<{ data: UserProfile }, Error> => {
  return useQuery<{ data: UserProfile }, Error>({
    ...config,
    queryKey: ['/owner', user?.uid],
    queryFn: async (): Promise<{ data: UserProfile }> => getExistingUser(user),
  })
}

export const useQuestionList = (
  user: User,
  config?: Omit<
    UseQueryOptions<{ data: Question[] }, Error>,
    'queryKey' | 'queryFn'
  >,
): UseQueryResult<{ data: Question[] }, Error> => {
  return useQuery<{ data: Question[] }, Error>({
    ...config,
    queryKey: ['/questions', user?.uid],
    queryFn: async (): Promise<{ data: Question[] }> => getAllQuestions(user),
  })
}

export const useQuestionListPagination = (
  user: User,
  limit: number,
  config?: Omit<
    UseInfiniteQueryOptions<
      IResponseGetQuestionPagination,
      Error,
      InfiniteData<IResponseGetQuestionPagination>,
      IResponseGetQuestionPagination,
      QueryKey,
      string
    >,
    'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
  >,
) => {
  return useInfiniteQuery({
    ...config,
    queryKey: ['/questions', user?.uid],
    queryFn: async ({ pageParam }) =>
      getAllQuestionsWithPagination({
        user: user,
        limit: limit,
        cursor: pageParam,
      }),
    initialPageParam: '',
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
    getNextPageParam: (firstPage) => {
      return firstPage.next ?? undefined
    },
  })
}

export const useCustomOgByUser = (
  user: User,
  config?: Omit<
    UseQueryOptions<{ data: CustomOg[] }, Error>,
    'queryKey' | 'queryFn'
  >,
): UseQueryResult<{ data: CustomOg[] }, Error> => {
  return useQuery<{ data: CustomOg[] }, Error>({
    ...config,
    queryKey: ['/user-custom-og', user?.uid],
    queryFn: async (): Promise<{ data: CustomOg[] }> =>
      getExistingCustomOg(user),
  })
}

export const useNotifChannelByUser = (
  user: User,
  config?: Omit<
    UseQueryOptions<{ data: NotifChannel[] }, Error>,
    'queryKey' | 'queryFn'
  >,
): UseQueryResult<{ data: NotifChannel[] }, Error> => {
  return useQuery<{ data: NotifChannel[] }, Error>({
    ...config,
    queryKey: ['/user-notif-channel', user?.uid],
    queryFn: async (): Promise<{ data: NotifChannel[] }> =>
      getExistingChannelNotif(user),
  })
}

export const useGetPublicUser = (
  param: { limit: number; name: string },
  config?: Omit<
    UseInfiniteQueryOptions<
      IResponseGetPublicUserList,
      Error,
      InfiniteData<IResponseGetPublicUserList>,
      IResponseGetPublicUserList,
      QueryKey,
      string
    >,
    'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
  >,
) => {
  return useInfiniteQuery({
    ...config,
    queryKey: ['/public-user', param.name === '' ? 'empty-search' : param.name],
    queryFn: async ({ pageParam }): Promise<IResponseGetPublicUserList> =>
      getAllPublicUsers({
        limit: param.limit,
        name: param.name,
        offset: pageParam,
      }),
    initialPageParam: '',
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
    getNextPageParam: (firstPage) => {
      return firstPage.next ?? undefined
    },
  })
}
