import { getQuestionsByUuid, markStatusQuestionAsRead, togglePublicAccessQuestion } from '@/lib/notion'
import { revalidateTag } from 'next/cache'
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

    await togglePublicAccessQuestion(foundPage.id, res.access === "PUBLIC")

    revalidateTag(uuid)

    return NextResponse.json({ message: 'Question access changed' })
  } catch (error) {
    return NextResponse.json({ message: 'Error while toggling the question access' }, { status: 500 })
  }
}