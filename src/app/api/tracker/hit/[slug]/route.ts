import { getUserBySlug, simplifyResponseObject, updateUserCounter } from '@/lib/notion'
import { NextResponse } from 'next/server'

export async function PATCH(request: Request,
  { params }: { params: { slug: string } }) {
  const slug = params.slug || ''
  try {
    const existingUser = await getUserBySlug(slug)

    if (existingUser.results.length === 0) {
      return NextResponse.json({ message: `Slug ${slug} is not exist`, data: null }, { status: 400 })
    }

    const result = existingUser.results[0]
    // @ts-ignore
    const properties = result.properties

    const simpleDataResponse = simplifyResponseObject(properties)

    // @ts-ignore
    const countString = simpleDataResponse?.count || "0"
    const countNumber = parseInt(countString, 10)
    const nextCounter = countNumber + 1

    await updateUserCounter({
      pageId: result.id,
      count: `${nextCounter}`
    })

    return NextResponse.json({ message: `Tracker for slug ${slug} trigerred`, data: nextCounter, },)
  } catch (error) {
    return NextResponse.json({ message: 'Error while hit tracker' }, { status: 500 })
  }

}