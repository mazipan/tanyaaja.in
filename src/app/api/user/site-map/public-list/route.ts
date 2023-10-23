import { NextResponse } from 'next/server'

import {
  getPublicUserListForSiteMap,
  simplifyResponseObject,
} from '@/lib/notion'
import { UserProfile } from '@/lib/types'

export async function GET(request: Request) {
  try {
    const publicUsers = await getPublicUserListForSiteMap()

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
    })
  } catch (error) {
    console.error(request.url, error)
    return NextResponse.json(
      { message: 'Error while get public users' },
      { status: 500 },
    )
  }
}
