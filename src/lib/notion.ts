import { Client } from '@notionhq/client';
import slugify from '@sindresorhus/slugify';
import { v4 as uuidv4 } from 'uuid';

import { AddUserArgs, SubmitQuestionArgs, UpdateUserArgs } from './types';

const notion = new Client({
  auth: process.env.NOTION_SECRET,
})

const DB_USER =  process.env.NOTION_DB_USERS_ID || ''
const DB_QUESTION =  process.env.NOTION_DB_QUESTIONS_ID || ''

export const getUserByUid = async (uid: string) => {
  const response = await notion.databases.query({
    database_id: DB_USER,
    filter: {
      property: "uid",
      rich_text: {
        contains: uid,
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
        contains: slug,
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
      name: {
        type: 'rich_text',
        rich_text: [
          {
            type: 'text',
            text: { content: param.name },
          },
        ],
      },
      email: {
        type: 'rich_text',
        rich_text: [
          {
            type: 'text',
            text: { content: param.email },
          },
        ],
      },
      slug: {
        type: 'rich_text',
        rich_text: [
          {
            type: 'text',
            text: { content: slugify(param.email.split('@')[0] || '') },
          },
        ],
      },
      count: {
        type: 'rich_text',
        rich_text: [
          {
            type: 'text',
            text: { content: '0' },
          },
        ],
      },
    }
  })
}

export const updateUser = async (param: UpdateUserArgs) => {
  const existing = await getUserByUid(param.uid);

  if (existing) {}
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
      slug: {
        type: 'rich_text',
        rich_text: [
          {
            type: 'text',
            text: { content: param.slug },
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
      uid: {
        type: 'rich_text',
        rich_text: [
          {
            type: 'text',
            text: { content: param.uid },
          },
        ],
      },
      question: {
        type: 'rich_text',
        rich_text: [
          {
            type: 'text',
            text: { content: param.question },
          },
        ],
      },
    }
  })
}