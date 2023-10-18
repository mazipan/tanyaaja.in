import { NextResponse } from 'next/server'

import { UserProfile } from 'firebase/auth'

import { getUserBySlug, simplifyResponseObject } from '@/lib/notion'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } },
) {
  const slug = params.slug || ''
  try {
    const userInNotion = await getUserBySlug(slug)

    if (userInNotion.results.length === 0) {
      return NextResponse.json(
        { message: `Slug ${slug} is not exist`, data: null },
        { status: 400 },
      )
    }

    const result = userInNotion.results[0]
    // @ts-ignore
    const properties = result.properties

    const simpleDataResponse = simplifyResponseObject<UserProfile>(properties)

    // Need to strip the uid data
    return NextResponse.json({
      message: `Found the owner of the slug ${slug}`,
      data: {
        uid: '<REDACTED>',
        image: simpleDataResponse?.image,
        name: simpleDataResponse?.name,
        count: simpleDataResponse?.count,
        slug: simpleDataResponse?.slug,
        public: simpleDataResponse?.public ?? false,
        x_username: simpleDataResponse?.x_username,
      },
    })
  } catch (error) {
    console.error(request.url, error)
    return NextResponse.json(
      { message: 'Error while get user by slug' },
      { status: 500 },
    )
  }
}
