import { revalidateTag } from 'next/cache'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

import { verifyIdToken } from '@/lib/firebase-admin'
import { getQuestionsByUuid, markStatusQuestionAsRead } from '@/lib/notion'

export const dynamic = 'force-dynamic'

export async function PATCH(
  request: Request,
  { params }: { params: { uuid: string } },
) {
  const paramUuid = params.uuid || ''
  try {
    const headersInstance = headers()
    const token = headersInstance.get('Authorization')
    if (token) {
      await verifyIdToken(token)

      // Support multi uuid using comma separator
      const uuids = paramUuid.split(',').filter(Boolean)

      for (const id of uuids) {
        const existingQuestion = await getQuestionsByUuid(id)
        const foundPage = existingQuestion.results[0]
        await markStatusQuestionAsRead(foundPage.id)
        revalidateTag(id)
      }

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
