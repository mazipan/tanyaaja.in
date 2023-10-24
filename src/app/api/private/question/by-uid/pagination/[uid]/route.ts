import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { verifyIdToken } from '@/lib/firebase-admin'
import {
  getQuestionsByUuidWithPagination,
  simplifyResponseObject,
} from '@/lib/notion'
import { Question } from '@/lib/types'

export async function GET(request: NextRequest) {
  const limit = Number(request.nextUrl.searchParams.get('limit')) ?? 1
  const cursor = request.nextUrl.searchParams.get('cursor') ?? ''

  const headersInstance = headers()
  const token = headersInstance.get('Authorization')
  try {
    if (token) {
      const decodedToken = await verifyIdToken(token)

      const questionsInNotion = await getQuestionsByUuidWithPagination({
        uid: decodedToken.uid,
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
        message: `Found questions for user ${decodedToken.uid}`,
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
