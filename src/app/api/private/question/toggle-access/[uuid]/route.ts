import { revalidateTag } from 'next/cache'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

import { verifyIdToken } from '@/lib/firebase-admin'
import { getQuestionsByUuid, togglePublicAccessQuestion } from '@/lib/notion'

export async function PATCH(
  request: Request,
  { params }: { params: { uuid: string } },
) {
  const uuid = params.uuid || ''
  const res = await request.json()
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

      await togglePublicAccessQuestion(foundPage.id, res.access === 'PUBLIC')

      revalidateTag(uuid)

      return NextResponse.json({ message: 'Question access changed' })
    }

    return NextResponse.json(
      { message: `Can not found the session`, data: null },
      { status: 403 },
    )
  } catch (error) {
    console.error(request.url, error)
    return NextResponse.json(
      { message: 'Error while toggling the question access' },
      { status: 500 },
    )
  }
}
