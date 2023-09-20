import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

import {
  getQuestionsByUid,
  getUserByUid,
  simplifyResponseObject,
} from '@/lib/notion'
import { Question } from '@/lib/types'

export async function GET(
  request: Request,
  { params }: { params: { uid: string } },
) {
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

      const questionsInNotion = await getQuestionsByUid(uid)
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
