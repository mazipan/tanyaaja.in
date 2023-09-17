import { getUserBySlug, simplifyResponseObject } from '@/lib/notion'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug || ''
  try {
    const userInNotion = await getUserBySlug(slug)

    if (userInNotion.results.length === 0) {
      return NextResponse.json({ message: `Slug ${slug} is not exist`, data: null }, { status: 400 })
    }

    const result = userInNotion.results[0]
    // @ts-ignore
    const properties = result.properties

    const simpleDataResponse = simplifyResponseObject(properties)

    // Need to strip the uid data

    return NextResponse.json({ message: `Found the owner of the slug ${slug}`, data: {
      // @ts-ignore
      image: simpleDataResponse?.image,
      // @ts-ignore
      name: simpleDataResponse?.name,
      // @ts-ignore
      email: simpleDataResponse?.email,
      // @ts-ignore
      count: simpleDataResponse?.count,
      // @ts-ignore
      slug: simpleDataResponse?.slug,
    }, },)
  } catch (error) {
    return NextResponse.json({ message: 'Error while get user by slug' }, { status: 500 })
  }
}