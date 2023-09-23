import { Client } from '@notionhq/client'
import slugify from '@sindresorhus/slugify'
import { nanoid } from 'nanoid'

import {
  AddUserArgs,
  CreateSessionArgs,
  SubmitQuestionArgs,
  UpdateUserArgs,
  UpdateUserCounterArgs,
} from './types'
import { addDays } from './utils'

const notion = new Client({
  auth: process.env.NOTION_SECRET,
})

const DB_USER = process.env.NOTION_DB_USERS_ID || ''
const DB_QUESTION = process.env.NOTION_DB_QUESTIONS_ID || ''
const DB_SESSION = process.env.NOTION_DB_SESSION_ID || ''

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

export const getPublicUserList = async () => {
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
      ...submitRichTextProp('image', param.image),
      ...submitNumberProp('count', 0),
    },
  })
}

export const updateUser = async (param: UpdateUserArgs) => {
  const withImage = param.image ? submitRichTextProp('image', param.image) : {}
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
            text: { content: nanoid() },
          },
        ],
      },
      ...submitRichTextProp('uid', param.uid),
      ...submitRichTextProp('question', param.question),
      submitted_date: {
        type: 'date',
        date: {
          start: new Date().toISOString(),
          time_zone: 'Asia/Jakarta',
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

// @ts-ignore
export const simplifyResponseObject = <T>(properties): T => {
  const simpleDataResponse = {}
  for (const [key, value] of Object.entries(properties)) {
    // @ts-ignore
    const type = value.type
    // @ts-ignore
    if (type === 'rich_text' || type === 'title') {
      // @ts-ignore
      simpleDataResponse[key] = value[type][0]?.text?.content || ''
      // @ts-ignore
    } else if (type === 'last_edited_time' || type === 'created_time') {
      // @ts-ignore
      simpleDataResponse[type] = value[type]
      // @ts-ignore
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
