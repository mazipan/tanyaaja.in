import { Client } from '@notionhq/client'
import {
  PageObjectResponse,
  type PartialDatabaseObjectResponse,
} from '@notionhq/client/build/src/api-endpoints'
import slugify from '@sindresorhus/slugify'
import { nanoid } from 'nanoid'

import {
  AddUserArgs,
  CreateCustomOgArgs,
  CreateNotifChannelArgs,
  CreateSessionArgs,
  IRequestPublicUserList,
  SubmitQuestionArgs,
  UpdateUserArgs,
  UpdateUserCounterArgs,
} from './types'
import { addDays, DEFAULT_AVATAR, generateNanoId } from './utils'

const notion = new Client({
  auth: process.env.NOTION_SECRET,
})

const DB_USER = process.env.NOTION_DB_USERS_ID || ''
const DB_QUESTION = process.env.NOTION_DB_QUESTIONS_ID || ''
const DB_SESSION = process.env.NOTION_DB_SESSION_ID || ''
const DB_CUSTOM_OG = process.env.NOTION_DB_CUSTOM_OG || ''
const DB_NOTIF_CHANNEL = process.env.NOTION_DB_NOTIF_CHANNEL || ''

const submitRichTextProp = (fieldName: string, value: string) => {
  return {
    [fieldName]: {
      type: 'rich_text',
      rich_text: [
        {
          type: 'text',
          text: { content: value },
        },
      ],
    },
  }
}

const submitNumberProp = (fieldName: string, value: number) => {
  return {
    [fieldName]: {
      type: 'number',
      number: value || 0,
    },
  }
}

export type ResponseProperties =
  | PartialDatabaseObjectResponse['properties']
  | PageObjectResponse['properties']

export const simplifyResponseObject = <T>(
  properties: ResponseProperties,
): T => {
  // @ts-ignore
  const simpleDataResponse: T = {}
  for (const [key, value] of Object.entries(properties)) {
    const type = value.type
    if (type === 'rich_text' || type === 'title') {
      // @ts-ignore
      simpleDataResponse[key] = value[type][0]?.text?.content || ''
    } else if (type === 'last_edited_time' || type === 'created_time') {
      // @ts-ignore
      simpleDataResponse[type] = value[type]
    } else if (type === 'number') {
      // @ts-ignore
      simpleDataResponse[key] = value[type]
      // @ts-ignore
    } else if (value[type].name) {
      // @ts-ignore
      simpleDataResponse[key] = value[type].name
      // @ts-ignore
    } else if (value[type].start) {
      // @ts-ignore
      simpleDataResponse[key] = value[type].start
      // @ts-ignore
    } else {
      // @ts-ignore
      simpleDataResponse[key] = value[type]
    }
  }

  return simpleDataResponse as T
}

export const getSession = async (token: string) => {
  const response = await notion.databases.query({
    database_id: DB_SESSION,
    filter: {
      property: 'token',
      title: {
        equals: token,
      },
    },
  })

  return response
}

export const getSessionByUid = async (uid: string) => {
  const response = await notion.databases.query({
    database_id: DB_SESSION,
    filter: {
      property: 'uid',
      title: {
        equals: uid,
      },
    },
  })

  return response
}

export const createSession = async (param: CreateSessionArgs) => {
  const response = await notion.pages.create({
    parent: {
      database_id: DB_SESSION,
    },
    properties: {
      uuid: {
        type: 'title',
        title: [
          {
            type: 'text',
            text: { content: nanoid() },
          },
        ],
      },
      ...submitRichTextProp('uid', param.uid),
      ...submitRichTextProp('token', param.token),
      expired: {
        type: 'date',
        date: {
          start: addDays(new Date().toISOString(), 30).toISOString(),
          time_zone: 'Asia/Jakarta',
        },
      },
    },
  })

  return response
}

export const updateSessionToken = async (pageId: string, token: string) => {
  const response = await notion.pages.update({
    page_id: pageId,
    properties: {
      token: {
        type: 'rich_text',
        rich_text: [
          {
            type: 'text',
            text: { content: token },
          },
        ],
      },
      expired: {
        type: 'date',
        date: {
          start: addDays(new Date().toISOString(), 30).toISOString(),
          time_zone: 'Asia/Jakarta',
        },
      },
    },
  })

  return response
}

export const destroySession = async (pageId: string) => {
  const response = await notion.pages.update({
    page_id: pageId,
    archived: true,
  })

  return response
}

export const getUserByUid = async (uid: string) => {
  const response = await notion.databases.query({
    database_id: DB_USER,
    filter: {
      property: 'uid',
      title: {
        equals: uid,
      },
    },
  })

  return response
}

export const getUserBySlug = async (slug: string) => {
  const response = await notion.databases.query({
    database_id: DB_USER,
    filter: {
      property: 'slug',
      rich_text: {
        equals: slug,
      },
    },
  })

  return response
}

export const getPublicUserList = async ({
  limit = 10,
  name = '',
  offset = undefined,
}: IRequestPublicUserList) => {
  const response = await notion.databases.query({
    database_id: DB_USER,
    filter: {
      and: [
        {
          property: 'name',
          rich_text: {
            contains: name,
          },
        },
        {
          property: 'public',
          checkbox: {
            equals: true,
          },
        },
      ],
    },
    page_size: limit,
    start_cursor: offset,
  })

  return response
}
export const getPublicUserListForSiteMap = async () => {
  const response = await notion.databases.query({
    database_id: DB_USER,
    filter: {
      property: 'public',
      checkbox: {
        equals: true,
      },
    },
  })

  return response
}

export const addUser = async (param: AddUserArgs) => {
  await notion.pages.create({
    parent: {
      database_id: DB_USER,
    },
    properties: {
      uid: {
        type: 'title',
        title: [
          {
            type: 'text',
            text: { content: param.uid },
          },
        ],
      },
      ...submitRichTextProp('name', param.name),
      ...submitRichTextProp('email', param.email),
      ...submitRichTextProp('slug', slugify(param.email.split('@')[0] || '')),
      ...submitRichTextProp('image', param?.image || DEFAULT_AVATAR),
      ...submitNumberProp('count', 0),
    },
  })
}

export const updateUser = async (param: UpdateUserArgs) => {
  const withImage = param.image
    ? submitRichTextProp('image', param?.image || DEFAULT_AVATAR)
    : {}
  await notion.pages.update({
    page_id: param.pageId,
    properties: {
      name: {
        type: 'rich_text',
        rich_text: [
          {
            type: 'text',
            text: { content: param.name },
          },
        ],
      },
      public: {
        type: 'checkbox',
        checkbox: param.public,
      },
      ...submitRichTextProp('slug', param.slug),
      ...submitRichTextProp('x_username', param.x_username ?? ''),
      ...withImage,
    },
  })
}

export const updateUserCounter = async (param: UpdateUserCounterArgs) => {
  await notion.pages.update({
    page_id: param.pageId,
    properties: {
      count: {
        type: 'number',
        number: param.count,
      },
    },
  })
}

export const submitQuestion = async (param: SubmitQuestionArgs) => {
  await notion.pages.create({
    parent: {
      database_id: DB_QUESTION,
    },
    properties: {
      uuid: {
        type: 'title',
        title: [
          {
            type: 'text',
            text: { content: generateNanoId() },
          },
        ],
      },
      ...submitRichTextProp('uid', param.uid),
      ...submitRichTextProp('question', param.question),
      submitted_date: {
        type: 'date',
        date: {
          start: new Date().toISOString(),
        },
      },
    },
  })
}

export const getQuestionsByUid = async (uid: string) => {
  const response = await notion.databases.query({
    database_id: DB_QUESTION,
    filter: {
      and: [
        {
          property: 'uid',
          rich_text: {
            equals: uid,
          },
        },
        {
          property: 'status',
          status: {
            equals: 'Not started',
          },
        },
      ],
    },
  })

  return response
}

export const getQuestionsByUuid = async (uuid: string) => {
  const response = await notion.databases.query({
    database_id: DB_QUESTION,
    filter: {
      property: 'uuid',
      title: {
        equals: uuid,
      },
    },
  })

  return response
}

export const markStatusQuestionAsRead = async (pageId: string) => {
  await notion.pages.update({
    page_id: pageId,
    properties: {
      status: {
        type: 'status',
        status: {
          name: 'Done',
        },
      },
    },
  })
}

export const togglePublicAccessQuestion = async (
  pageId: string,
  status: boolean,
) => {
  await notion.pages.update({
    page_id: pageId,
    properties: {
      public: {
        type: 'checkbox',
        checkbox: status,
      },
    },
  })
}

export const getCustomOgByUid = async (uid: string) => {
  const response = await notion.databases.query({
    database_id: DB_CUSTOM_OG,
    filter: {
      property: 'uid',
      title: {
        equals: uid,
      },
    },
  })

  return response
}

export const createCustomOgByUid = async (param: CreateCustomOgArgs) => {
  const response = await notion.pages.create({
    parent: {
      database_id: DB_CUSTOM_OG,
    },
    properties: {
      uid: {
        type: 'title',
        title: [
          {
            type: 'text',
            text: {
              content: param.uid,
            },
          },
        ],
      },
      mode: {
        type: 'status',
        status: {
          name: param.mode,
        },
      },
      theme: {
        type: 'select',
        select: {
          name: param.theme,
        },
      },
      ...submitRichTextProp('slug', param.slug),
      ...submitRichTextProp('simple_text', param.simpleText),
      ...submitRichTextProp('code_public', param.codePublic),
      ...submitRichTextProp('code_question', param.codeQuestion),
    },
  })

  return response
}

export const updateCustomOgByUuid = async (
  pageId: string,
  param: Omit<CreateCustomOgArgs, 'uid'>,
) => {
  const response = await notion.pages.update({
    page_id: pageId,
    properties: {
      mode: {
        type: 'status',
        status: {
          name: param.mode,
        },
      },
      theme: {
        type: 'select',
        select: {
          name: param.theme,
        },
      },
      ...submitRichTextProp('slug', param.slug),
      ...submitRichTextProp('simple_text', param.simpleText),
      ...submitRichTextProp('code_public', param.codePublic),
      ...submitRichTextProp('code_question', param.codeQuestion),
    },
  })

  return response
}

export const getNotifChannelByUid = async (uid: string) => {
  const response = await notion.databases.query({
    database_id: DB_NOTIF_CHANNEL,
    filter: {
      property: 'uid',
      title: {
        equals: uid,
      },
    },
  })

  return response
}

export const createNotifChannelByUid = async (
  param: CreateNotifChannelArgs,
) => {
  const response = await notion.pages.create({
    parent: {
      database_id: DB_NOTIF_CHANNEL,
    },
    properties: {
      uid: {
        type: 'title',
        title: [
          {
            type: 'text',
            text: {
              content: param.uid,
            },
          },
        ],
      },
      ...submitRichTextProp('slug', param.slug),
      ...submitRichTextProp('telegram_chat_id', param.telegram_chat_id),
      ...submitRichTextProp('telegram_username', param.telegram_username),
    },
  })

  return response
}

export const updateNotifChannelByUuid = async (
  pageId: string,
  param: Omit<CreateNotifChannelArgs, 'uid'>,
) => {
  const response = await notion.pages.update({
    page_id: pageId,
    properties: {
      slug: {
        type: 'rich_text',
        rich_text: [
          {
            type: 'text',
            text: { content: param.slug },
          },
        ],
      },
      ...submitRichTextProp('telegram_chat_id', param.telegram_chat_id),
      ...submitRichTextProp('telegram_username', param.telegram_username),
    },
  })

  return response
}

export const getQuestionsByUuidWithPagination = async ({
  uid,
  limit = 10,
  cursor,
}: {
  uid: string
  limit: number
  cursor: string | undefined
}) => {
  const response = await notion.databases.query({
    database_id: DB_QUESTION,
    filter: {
      and: [
        {
          property: 'uid',
          rich_text: {
            equals: uid,
          },
        },
        {
          property: 'status',
          status: {
            equals: 'Not started',
          },
        },
      ],
    },
    page_size: limit,
    start_cursor: cursor,
  })

  return response
}

export const countDatabaseRows = async ({
  databaseId,
}: {
  databaseId: string
}) => {
  let hasMore: boolean = true
  let rowsCount: number = 0
  let nextCursor: string | undefined = undefined

  while (hasMore) {
    const response = await notion.databases.query({
      database_id: databaseId,
      start_cursor: nextCursor,
    })

    hasMore = response.has_more
    nextCursor = response.next_cursor as string
    rowsCount += response.results.length
  }

  return rowsCount
}
