import { revalidateTag } from 'next/cache'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

import { verifyIdToken } from '@/lib/firebase-admin'
import { getQuestionsByUuid, markStatusQuestionAsRead } from '@/lib/notion'

export async function PATCH(
  request: Request,
  { params }: { params: { uuid: string } },
) {
  const uuid = params.uuid || ''
  try {
    const headersInstance = headers()
    const token = headersInstance.get('Authorization')
    if (token) {
      await verifyIdToken(token)

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

      await markStatusQuestionAsRead(foundPage.id)

      revalidateTag(uuid)

      return NextResponse.json({ message: 'Question marked as Done' })
    }

    return NextResponse.json(
      { message: `Can not found the session`, data: null },
      { status: 403 },
    )
  } catch (error) {
    console.error(request.url, error)
    return NextResponse.json(
      { message: 'Error while mark question as Done' },
      { status: 500 },
    )
  }
}
