import { NextRequest, NextResponse } from 'next/server'

import { getPublicUserList, simplifyResponseObject } from '@/lib/notion'
import { UserProfile } from '@/lib/types'

export async function GET(request: NextRequest) {
  try {
    const limit = Number(request.nextUrl.searchParams.get('limit'))
    const offset = request.nextUrl.searchParams.get('offset') ?? ''
    const name = request.nextUrl.searchParams.get('name') ?? ''

    const publicUsers = await getPublicUserList({
      limit: limit < 1 ? 1 : limit,
      name: name,
      offset: offset === '' ? undefined : offset,
    })

    if (publicUsers.results.length === 0) {
      return NextResponse.json(
        { message: `Can not found public users`, data: null },
        { status: 400 },
      )
    }

    const results = publicUsers?.results || []

    const simpleResults: UserProfile[] = []

    results.forEach((result) => {
      // @ts-ignore
      const properties = result.properties

      const simpleDataResponse = simplifyResponseObject<UserProfile>(properties)

      // Need to strip the uid data
      simpleResults.push({
        uid: '<REDACTED>',
        image: simpleDataResponse?.image,
        name: simpleDataResponse?.name,
        count: simpleDataResponse?.count,
        slug: simpleDataResponse?.slug,
        public: simpleDataResponse?.public ?? false,
      })
    })

    return NextResponse.json({
      message: `Found public users`,
      data: simpleResults,
      next: publicUsers.next_cursor,
      hasMore: publicUsers.has_more,
    })
  } catch (error) {
    console.error(request.url, error)
    return NextResponse.json(
      { message: 'Error while get public users' },
      { status: 500 },
    )
  }
}
