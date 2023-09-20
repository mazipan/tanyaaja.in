import { NextResponse } from 'next/server'

import {
  getUserBySlug,
  simplifyResponseObject,
  submitQuestion,
} from '@/lib/notion'

export async function POST(request: Request) {
  const res = await request.json()

  try {
    const userInNotion = await getUserBySlug(res.slug)

    if (userInNotion.results.length === 0) {
      return NextResponse.json(
        { message: 'Owner of this page can not be found' },
        { status: 400 },
      )
    }

    const result = userInNotion.results[0]
    // @ts-ignore
    const properties = result.properties

    const simpleDataResponse = simplifyResponseObject(properties)

    await submitQuestion({
      // @ts-ignore
      uid: simpleDataResponse?.uid,
      question: res.question,
    })

    return NextResponse.json({ message: 'New question submitted' })
  } catch (error) {
    console.error(request.url, error)
    return NextResponse.json(
      { message: 'Error while submitting new question' },
      { status: 500 },
    )
  }
}
