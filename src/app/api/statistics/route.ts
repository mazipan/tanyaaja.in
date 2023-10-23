import { NextResponse } from 'next/server'

import { countDatabaseRows } from '@/lib/notion'

const DB_USER = process.env.NOTION_DB_USERS_ID ?? ''
const DB_QUESTION = process.env.NOTION_DB_QUESTIONS_ID ?? ''

export async function GET(request: Request) {
  try {
    const [usersCount, questionsCount] = await Promise.all([
      countDatabaseRows({ databaseId: DB_USER }),
      countDatabaseRows({ databaseId: DB_QUESTION }),
    ])

    return NextResponse.json({
      message: `Public statistics`,
      data: {
        usersCount,
        questionsCount,
      },
    })
  } catch (error) {
    console.error(request.url, error)
    return NextResponse.json(
      { message: 'Error while get public statistics' },
      { status: 500 },
    )
  }
}
