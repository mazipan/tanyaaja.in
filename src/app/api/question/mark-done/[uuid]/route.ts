import { getQuestionsByUuid, markStatusQuestionAsRead } from '@/lib/notion'
import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

export async function PATCH(request: Request,
  { params }: { params: { uuid: string } }) {
  const uuid = params.uuid || ''
  try {

    const existingQuestion = await getQuestionsByUuid(uuid)

    if (existingQuestion.results.length === 0) {
      return NextResponse.json(
        {
          message: `Can not found the question ${uuid}`
        },
        { status: 400 }
      )
    }

    const foundPage = existingQuestion.results[0]

    await markStatusQuestionAsRead(foundPage.id)

    revalidateTag(uuid)

    return NextResponse.json({ message: 'Question submitted' })
  } catch (error) {
    return NextResponse.json({ message: 'Error while mark question as Done' }, { status: 500 })
  }
}