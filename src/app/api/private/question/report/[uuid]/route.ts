import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

import { verifyIdToken } from '@/lib/firebase-admin'
import { sendEmailReportQuestion } from '@/lib/mailer'
import {
  createBlockedFingerprint,
  getQuestionsByUuid,
  simplifyResponseObject,
} from '@/lib/notion'
import type { Question } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function POST(
  request: Request,
  { params }: { params: { uuid: string } },
) {
  const res = await request.json()
  const uuid = params.uuid || ''
  const reason = res.reason || ''
  try {
    const headersInstance = headers()
    const token = headersInstance.get('Authorization')
    if (token) {
      const decodedToken = await verifyIdToken(token)

      const existingQuestion = await getQuestionsByUuid(uuid)

      if (existingQuestion.results.length === 0) {
        return NextResponse.json(
          {
            message: `Can not found the question ${uuid}`,
          },
          { status: 400 },
        )
      }

      const foundPage = existingQuestion.results[0]
      // @ts-ignore
      const properties = foundPage.properties
      const simpleDataResponse = simplifyResponseObject<Question>(properties)

      try {
        await createBlockedFingerprint({
          fingerprint: simpleDataResponse?.fingerprint || '',
          uid: decodedToken.email || decodedToken.uid,
          reason,
        })
      } catch (error) {
        console.error('🔥 [ERROR] create blocked fingerprint', error)
      }

      await sendEmailReportQuestion({
        user: decodedToken.email || decodedToken.uid,
        question: simpleDataResponse,
        reason,
      })

      return NextResponse.json({ message: 'Question reported' })
    }

    return NextResponse.json(
      { message: `Can not found the session`, data: null },
      { status: 403 },
    )
  } catch (error) {
    console.error(request.url, error)
    return NextResponse.json(
      { message: 'Error while reporting question' },
      { status: 500 },
    )
  }
}
