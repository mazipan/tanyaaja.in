import { getUserByUid, submitQuestion } from '@/lib/notion'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const res = await request.json()

  try {
    const userInNotion = await getUserByUid(res.uid)

    if (userInNotion.results.length === 0) {
      return NextResponse.json({ message: 'Owner of this page can not be found' }, { status: 400 })
    }

    await submitQuestion(res)

    return NextResponse.json({ message: 'Question submitted' })
  } catch (error) {
    return NextResponse.json({ message: 'Error while submitting new question' }, { status: 500 })
  }
}