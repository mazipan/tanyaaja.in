import { Client } from '@notionhq/client';
import slugify from '@sindresorhus/slugify';
import { v4 as uuidv4 } from 'uuid';

import { AddUserArgs, SubmitQuestionArgs, UpdateUserArgs, UpdateUserCounterArgs } from './types';

const notion = new Client({
  auth: process.env.NOTION_SECRET,
})

const DB_USER = process.env.NOTION_DB_USERS_ID || ''
const DB_QUESTION = process.env.NOTION_DB_QUESTIONS_ID || ''

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
    }
  }
}

export const getUserByUid = async (uid: string) => {
  const response = await notion.databases.query({
    database_id: DB_USER,
    filter: {
      property: "uid",
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
      property: "slug",
      rich_text: {
        equals: slug,
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
      ...submitRichTextProp('count', '0'),
      ...submitRichTextProp('image', param.image),
    }
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
      ...submitRichTextProp('slug', param.slug),
      ...withImage,
    }
  })
}

export const updateUserCounter = async (param: UpdateUserCounterArgs) => {
  await notion.pages.update({
    page_id: param.pageId,
    properties: {
      count: {
        type: 'rich_text',
        rich_text: [
          {
            type: 'text',
            text: { content: param.count },
          },
        ],
      },
    }
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
            text: { content: uuidv4() },
          },
        ],
      },
      ...submitRichTextProp('uid', param.uid),
      ...submitRichTextProp('question', param.question),
      submitted_date: {
        type: 'date',
        date: {
          start: new Date().toISOString()
        },
      },
    }
  })
}

export const getQuestionsByUid = async (uid: string) => {
  const response = await notion.databases.query({
    database_id: DB_QUESTION,
    filter: {
      "and": [
        {
          property: "uid",
          rich_text: {
            equals: uid,
          },
        },
        {
          property: "status",
          status: {
            equals: 'Not started',
          },
        },
      ]
    },
  })

  return response
}

export const getQuestionsByUuid = async (uuid: string) => {
  const response = await notion.databases.query({
    database_id: DB_QUESTION,
    filter: {
      property: "uuid",
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
          name: 'Done'
        },
      },
    }
  })
}

// @ts-ignore
export const simplifyResponseObject = (properties) => {
  const simpleDataResponse = {}
  for (const [key, value] of Object.entries(properties)) {
    // @ts-ignore
    const type = value.type
    // @ts-ignore
    if (value[type][0]) {
      // @ts-ignore
      simpleDataResponse[key] = value[type][0].text.content
      // @ts-ignore
    } else if (value[type].name){
      // @ts-ignore
      simpleDataResponse[key] = value[type].name
      // @ts-ignore
    } else if (value[type].start){
      // @ts-ignore
      simpleDataResponse[key] = value[type].start
    } else {
      // @ts-ignore
      simpleDataResponse[key] = value[type]
    }
  }

  return simpleDataResponse
}