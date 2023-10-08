import { NextResponse } from 'next/server'

import {
  getCustomOgByUid,
  getUserBySlug,
  simplifyResponseObject,
} from '@/lib/notion'
import { CustomOg, UserProfile } from '@/lib/types'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } },
) {
  const slug = params.slug || ''
  try {
    const userInNotion = await getUserBySlug(slug)

    if (userInNotion.results.length === 0) {
      // send response 200
      return NextResponse.json({
        message: `Can not found any custom og for user ${slug}`,
        data: null,
      })
    }

    const userResult = userInNotion.results[0]
    // @ts-ignore
    const userProperties = userResult.properties
    const simpleDataResponse =
      simplifyResponseObject<UserProfile>(userProperties)

    const dataInNotion = await getCustomOgByUid(simpleDataResponse?.uid)
    if (dataInNotion.results.length > 0) {
      const ogResult = dataInNotion?.results?.[0]
      // @ts-ignore
      const properties = ogResult.properties
      const ogResponse = simplifyResponseObject<CustomOg>(properties)
      return NextResponse.json({
        message: `Found custom og for user ${slug}`,
        data: ogResponse,
      })
    }

    // send status 200
    return NextResponse.json({
      message: `Can not found custom og for user ${slug}`,
      data: null,
    })
  } catch (error) {
    console.error(request.url, error)
    return NextResponse.json(
      { message: 'Error while get custom og by slug' },
      { status: 500 },
    )
  }
}
