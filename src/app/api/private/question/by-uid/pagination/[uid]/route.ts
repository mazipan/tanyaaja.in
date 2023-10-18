import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import {
  getQuestionsByUuidWithPagination,
  getUserByUid,
  simplifyResponseObject,
} from '@/lib/notion'
import { Question } from '@/lib/types'

export async function GET(
  request: NextRequest,
  { params }: { params: { uid: string } },
) {
  const limit = Number(request.nextUrl.searchParams.get('limit')) ?? 1
  const cursor = request.nextUrl.searchParams.get('cursor') ?? ''
  const uid = params.uid || ''

  const headersInstance = headers()
  const token = headersInstance.get('Authorization')
  try {
    if (token) {
      const userInNotion = await getUserByUid(uid)

      if (userInNotion.results.length === 0) {
        return NextResponse.json(
          {
            message: `Can not found any questions for user ${uid}`,
            data: null,
          },
          { status: 400 },
        )
      }

      const questionsInNotion = await getQuestionsByUuidWithPagination({
        uid,
        limit,
        cursor: cursor === '' ? undefined : cursor,
      })

      const results = questionsInNotion?.results || []
      // @ts-ignore

      const simpleResults: Question[] = []

      results.forEach((result) => {
        // @ts-ignore
        const properties = result.properties

        const simpleDataResponse = simplifyResponseObject<Question>(properties)

        simpleResults.push(simpleDataResponse)
      })

      return NextResponse.json({
        message: `Found questions for user ${uid}`,
        data: simpleResults,
        next: questionsInNotion.next_cursor,
        hasMore: questionsInNotion.has_more,
      })
    }

    return NextResponse.json(
      { message: `Can not found the session`, data: null },
      { status: 403 },
    )
  } catch (error) {
    console.error(request.url, error)
    return NextResponse.json(
      { message: 'Error while get question by uid' },
      { status: 500 },
    )
  }
}
