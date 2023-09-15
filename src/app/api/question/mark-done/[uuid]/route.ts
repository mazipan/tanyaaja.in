import { getQuestionsByUuid, getUserByUid, markStatusQuestionAsRead, submitQuestion } from '@/lib/notion'
import { NextResponse } from 'next/server'

export async function PATCH(request: Request,
  { params }: { params: { uuid: string } }) {
  const uuid = params.uuid || ''
  const res = await request.json()

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

    return NextResponse.json({ message: 'Question submitted' })
  } catch (error) {
    return NextResponse.json({ message: 'Error while mark question as Done' }, { status: 500 })
  }
}