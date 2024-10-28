import type { User } from 'firebase/auth'

import type { UpdateItem } from './telegram'
import type {
  CreateCustomOgArgs,
  CreateNotifChannelArgs,
  CustomOg,
  IRequestPublicUserList,
  IResponseGetPublicUserList,
  IResponseGetQuestionPagination,
  NotifChannel,
  Question,
  UpdateUserArgs,
  UserProfile,
} from './types'
import { DEFAULT_AVATAR, httpClient } from './utils'

export const BASEURL = `${process.env.NEXT_PUBLIC_BASE_URL}`

export const getExistingUser = async (
  user: User,
): Promise<{ data: UserProfile }> => {
  const token = await user.getIdToken()

  const rawRes = await fetch(
    `${BASEURL}/api/private/user/by-uuid/${user.uid}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
        cache: 'no-store',
      },
      next: {
        tags: [`user-by-uid-${user.uid}`],
      },
    },
  )
  /**
   * fetch needs to be rejected manually to trigger react-query error
   * @see https://tanstack.com/query/v4/docs/react/guides/query-functions#usage-with-fetch-and-other-clients-that-do-not-throw-by-default
   */
  if (!rawRes.ok) {
    const error = await rawRes.json()
    throw new Error(error.message)
  }

  return rawRes.json()
}

export const getPublicOwnerUser = async (
  slug: string,
): Promise<{ data: UserProfile }> => {
  const rawRes = await fetch(`${BASEURL}/api/user/by-slug/${slug}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    next: {
      tags: ['user-by-slug', slug],
    },
  })

  return rawRes.json()
}

export const checkTheSlugOwner = async (
  user: User,
  slug: string,
): Promise<{ data: 'NOT_EXIST' | 'EXIST' | null }> => {
  const token = await user.getIdToken()

  const rawRes = await httpClient(
    `${BASEURL}/api/private/user/slug-checker/${slug}`,
    {
      method: 'POST',
      body: JSON.stringify({
        uid: user.uid,
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
        cache: 'no-store',
      },
    },
  )

  return rawRes.json()
}

export const postAddUser = async (
  user: User,
): Promise<{ message: string; isNewUser?: boolean }> => {
  const token = await user.getIdToken()

  const rawRes = await fetch(`${BASEURL}/api/private/user/add`, {
    method: 'POST',
    body: JSON.stringify({
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      image: user?.photoURL || DEFAULT_AVATAR,
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
      cache: 'no-store',
    },
  })

  return rawRes.json()
}

export const patchUpdateUser = async (
  user: User,
  param: Omit<UpdateUserArgs, 'uid' | 'pageId'>,
): Promise<{ message: string }> => {
  const token = await user.getIdToken()

  const rawRes = await httpClient(`${BASEURL}/api/private/user/update`, {
    method: 'PATCH',
    body: JSON.stringify({
      uid: user.uid,
      name: param.name,
      slug: param.slug,
      image: param.image,
      public: param.public ?? false,
      x_username: param.x_username,
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
      cache: 'no-store',
    },
  })

  return rawRes.json()
}

export const deleteUser = async (user: User): Promise<{ message: string }> => {
  const token = await user.getIdToken()

  const rawRes = await httpClient(`${BASEURL}/api/private/user/delete`, {
    method: 'DELETE',
    body: JSON.stringify({
      uid: user.uid,
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
      cache: 'no-store',
    },
  })

  return rawRes.json()
}

export const deleteAllQuestions = async (
  user: User,
): Promise<{ message: string }> => {
  const token = await user.getIdToken()

  const rawRes = await httpClient(
    `${BASEURL}/api/private/question/delete-all`,
    {
      method: 'DELETE',
      body: JSON.stringify({
        uid: user.uid,
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
        cache: 'no-store',
      },
    },
  )

  return rawRes.json()
}

export const patchHit = async (slug: string): Promise<{ message: string }> => {
  const rawRes = await fetch(`${BASEURL}/api/tracker/hit/${slug}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return rawRes.json()
}

export const postSendQuestion = async (
  slug: string,
  question: string,
  fp: string,
  token: string,
): Promise<{ message: string; data: 'CONTAINS_BAD_WORD' | number | null }> => {
  const rawRes = await httpClient(`${BASEURL}/api/question/submit`, {
    method: 'POST',
    body: JSON.stringify({
      slug,
      question,
      fp,
      token,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return rawRes.json()
}

export const getAllQuestions = async (
  user: User,
): Promise<{ data: Question[] }> => {
  const token = await user.getIdToken()

  const rawRes = await fetch(
    `${BASEURL}/api/private/question/by-uid/${user.uid}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
        cache: 'no-store',
      },
      next: {
        tags: ['q-by-uid', user.uid],
      },
    },
  )

  return rawRes.json()
}

export const getAllAnsweredQuestions = async (
  user: User,
): Promise<{ data: Question[] }> => {
  const token = await user.getIdToken()

  const rawRes = await fetch(
    `${BASEURL}/api/private/question/by-uid/${user.uid}/answered`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
        cache: 'no-store',
      },
      next: {
        tags: ['q-by-uid', user.uid],
      },
    },
  )

  return rawRes.json()
}

export const patchQuestionAsDone = async (
  uuid: string,
  user: User,
): Promise<{ message: string }> => {
  const token = await user.getIdToken()

  const rawRes = await httpClient(
    `${BASEURL}/api/private/question/mark-done/${uuid}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
        cache: 'no-store',
      },
    },
  )

  return rawRes.json()
}

export const archiveQuestion = async (
  uuid: string,
  user: User,
): Promise<{ message: string }> => {
  const token = await user.getIdToken()

  const rawRes = await httpClient(
    `${BASEURL}/api/private/question/archive/${uuid}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
        cache: 'no-store',
      },
    },
  )

  return rawRes.json()
}

export const patchQuestionAsPublicOrPrivate = async (
  uuid: string,
  access: 'PUBLIC' | 'PRIVATE',
  user: User,
): Promise<{ message: string }> => {
  const token = await user.getIdToken()

  const rawRes = await fetch(
    `${BASEURL}/api/private/question/toggle-access/${uuid}`,
    {
      method: 'PATCH',
      body: JSON.stringify({
        access: access,
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
        cache: 'no-store',
      },
    },
  )
  return rawRes.json()
}

export const getQuestionDetail = async (
  uuid: string,
): Promise<{ data: Question[] }> => {
  const rawRes = await fetch(`${BASEURL}/api/question/detail/${uuid}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    next: {
      tags: ['q-by-uuid', uuid],
    },
  })

  return rawRes.json()
}

export const destroyActiveSession = async (
  user: User,
): Promise<{ message: string }> => {
  const token = await user.getIdToken()

  const rawRes = await fetch(`${BASEURL}/api/private/user/session-destroy`, {
    method: 'DELETE',
    body: JSON.stringify({
      uid: user.uid,
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
      cache: 'no-store',
    },
  })

  return rawRes.json()
}

export const getAllPublicUsersForSiteMap = async (): Promise<{
  data: UserProfile[]
}> => {
  const rawRes = await httpClient(`${BASEURL}/api/user/site-map/public-list`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    next: {
      tags: ['public-users'],
    },
  })

  return rawRes.json()
}

export const getAllPublicUsers = async ({
  limit,
  name,
  offset,
}: IRequestPublicUserList): Promise<IResponseGetPublicUserList> => {
  const rawRes = await httpClient(
    `${BASEURL}/api/user/public-list?limit=${limit}&name=${name}&offset=${offset}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: {
        tags: ['public-users'],
      },
    },
  )

  return rawRes.json()
}

export const getPublicCustomOg = async (
  slug: string,
): Promise<{ data: CustomOg }> => {
  const rawRes = await fetch(`${BASEURL}/api/og/custom-og/${slug}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    next: {
      tags: [`custom-og-by-slug-${slug}`],
    },
  })

  return rawRes.json()
}

export const getExistingCustomOg = async (
  user: User,
): Promise<{ data: CustomOg[] }> => {
  const token = await user.getIdToken()

  const rawRes = await fetch(
    `${BASEURL}/api/private/custom-og/by-uid/${user.uid}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
        cache: 'no-store',
      },
      next: {
        tags: [`og-by-uid-${user.uid}`],
      },
    },
  )

  return rawRes.json()
}

export const postAddNewCustomOg = async (
  user: User,
  param: CreateCustomOgArgs,
): Promise<{ message: string }> => {
  const token = await user.getIdToken()

  const rawRes = await fetch(`${BASEURL}/api/private/custom-og/create`, {
    method: 'POST',
    body: JSON.stringify({
      uid: user.uid,
      slug: param.slug,
      mode: param.mode,
      theme: param.theme,
      simpleText: param.simpleText,
      codePublic: param.codePublic,
      codeQuestion: param.codeQuestion,
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
      cache: 'no-store',
    },
  })

  return rawRes.json()
}

export const patchUpdateCustomOg = async (
  user: User,
  param: CreateCustomOgArgs,
): Promise<{ message: string }> => {
  const token = await user.getIdToken()

  const rawRes = await fetch(`${BASEURL}/api/private/custom-og/update`, {
    method: 'PATCH',
    body: JSON.stringify({
      uid: user.uid,
      slug: param.slug,
      mode: param.mode,
      theme: param.theme,
      simpleText: param.simpleText,
      codePublic: param.codePublic,
      codeQuestion: param.codeQuestion,
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
      cache: 'no-store',
    },
  })

  return rawRes.json()
}

export const getExistingChannelNotif = async (
  user: User,
): Promise<{ data: NotifChannel[] }> => {
  const token = await user.getIdToken()

  const rawRes = await fetch(
    `${BASEURL}/api/private/notification/by-uid/${user.uid}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
        cache: 'no-store',
      },
      next: {
        tags: [`notif-by-uid-${user.uid}`],
      },
    },
  )

  return rawRes.json()
}

export const postAddNewChannelNotif = async (
  user: User,
  param: CreateNotifChannelArgs,
): Promise<{ message: string }> => {
  const token = await user.getIdToken()

  const rawRes = await fetch(`${BASEURL}/api/private/notification/create`, {
    method: 'POST',
    body: JSON.stringify({
      uid: user.uid,
      slug: param.slug,
      telegram_chat_id: param.telegram_chat_id,
      telegram_username: param.telegram_username,
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
      cache: 'no-store',
    },
  })

  return rawRes.json()
}

export const patchUpdateChannelNotif = async (
  user: User,
  param: CreateNotifChannelArgs,
): Promise<{ message: string }> => {
  const token = await user.getIdToken()

  const rawRes = await fetch(`${BASEURL}/api/private/notification/update`, {
    method: 'PATCH',
    body: JSON.stringify({
      uid: user.uid,
      slug: param.slug,
      telegram_chat_id: param.telegram_chat_id,
      telegram_username: param.telegram_username,
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
      cache: 'no-store',
    },
  })

  return rawRes.json()
}

export const getCheckChatId = async (
  user: User,
  username: string,
): Promise<{ data: UpdateItem | null }> => {
  const token = await user.getIdToken()

  const rawRes = await fetch(
    `${BASEURL}/api/private/notification/get-chatid/${user.uid}?u=${username}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
        cache: 'no-store',
      },
      next: {
        tags: [`chatid-uid-${user.uid}`],
      },
    },
  )

  return rawRes.json()
}

export const getAllQuestionsWithPagination = async ({
  user,
  limit,
  cursor,
  status = 'pending',
}: {
  user: User
  limit: number
  cursor?: string
  status?: 'pending' | 'done'
}): Promise<IResponseGetQuestionPagination> => {
  const token = await user.getIdToken()

  const rawRes = await httpClient(
    `${BASEURL}/api/private/question/by-uid/pagination/${user.uid}?status=${status}&limit=${limit}&cursor=${cursor}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
        cache: 'no-store',
      },
      next: {
        tags: ['q-by-uid', user.uid],
      },
    },
  )

  return rawRes.json()
}

export const getPublicStatistics = async (): Promise<{
  data: { usersCount: number; questionsCount: number }
}> => {
  const rawRes = await httpClient(`${BASEURL}/api/statistics`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      cache: 'force-cache',
    },
    next: {
      revalidate: 60 * 60 * 24, // 24 hours
      tags: ['home-statistics'],
    },
  })

  return rawRes.json()
}

export const postReportUser = async (
  reason: string,
  user: string,
): Promise<{ message: string }> => {
  const rawRes = await httpClient(`${BASEURL}/api/user/report`, {
    method: 'POST',
    body: JSON.stringify({
      reason,
      user,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return rawRes.json()
}

export const postReportQuestion = async ({
  user,
  questionUuid,
  reason,
}: {
  user: User
  questionUuid: string
  reason: string
}): Promise<{ message: string }> => {
  const token = await user.getIdToken()

  const rawRes = await httpClient(
    `${BASEURL}/api/private/question/report/${questionUuid}`,
    {
      method: 'POST',
      body: JSON.stringify({
        reason,
        uuid: questionUuid,
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
        cache: 'no-store',
      },
    },
  )
  return rawRes.json()
}
