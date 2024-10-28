import { verifyIdToken } from '@/lib/firebase-admin'
import { archivePage, getQuestionsByUuid, getUserByUid } from '@/lib/notion'
import type { UpdatePageResponse } from '@notionhq/client/build/src/api-endpoints'
import { revalidateTag } from 'next/cache'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function DELETE(
  request: Request,
  { params }: { params: { uuid: string } },
) {
  try {
    const paramUuid = params.uuid || ''
    const headersInstance = headers()
    const token = headersInstance.get('Authorization')

    if (token) {
      const decodedToken = await verifyIdToken(token)
      const userInNotion = await getUserByUid(decodedToken.uid)
      if (userInNotion.results.length === 0) {
        return NextResponse.json(
          { message: 'User is not exist' },
          { status: 400 },
        )
      }

      // Support multi uuid using comma separator
      const uuids = paramUuid.split(',').filter(Boolean)

      const promises: Array<Promise<UpdatePageResponse>> = []
      for (const id of uuids) {
        const existingQuestion = await getQuestionsByUuid(id)
        const foundPage = existingQuestion.results[0]
        promises.push(archivePage(foundPage.id))
        revalidateTag(id)
      }
      await Promise.allSettled(promises)
      return NextResponse.json({ message: 'All questions archived' })
    }

    return NextResponse.json(
      { message: 'Can not found the session', data: null },
      { status: 403 },
    )
  } catch (error) {
    console.error(request.url, error)
    return NextResponse.json(
      { message: 'Error while deleting all questions' },
      { status: 500 },
    )
  }
}
