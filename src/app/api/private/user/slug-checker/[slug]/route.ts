import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

import { verifyIdToken } from '@/lib/firebase-admin'
import { getUserBySlug, simplifyResponseObject } from '@/lib/notion'
import { UserProfile } from '@/lib/types'

export async function POST(
  request: Request,
  { params }: { params: { slug: string } },
) {
  const res = await request.json()
  const slug = params.slug || ''
  const headersInstance = headers()
  const token = headersInstance.get('Authorization')

  try {
    if (token) {
      const decodedToken = await verifyIdToken(token)

      if (decodedToken?.uid) {
        const userInNotion = await getUserBySlug(slug)

        if (userInNotion.results.length === 0) {
          return NextResponse.json(
            { message: `Slug ${slug} is not exist`, data: 'NOT_EXIST' },
            { status: 400 },
          )
        }

        const result = userInNotion.results[0]
        // @ts-ignore
        const properties = result.properties

        const simpleDataResponse =
          simplifyResponseObject<UserProfile>(properties)

        if (res?.uid === simpleDataResponse.uid) {
          return NextResponse.json({
            message: `Slug ${slug} is exist but it's own by your self`,
            data: 'NOT_EXIST',
          })
        }

        return NextResponse.json({
          message: `Slug ${slug} is exist and own by other user`,
          data: 'EXIST',
        })
      }
    }

    return NextResponse.json(
      { message: `Can not found the session`, data: null },
      { status: 403 },
    )
  } catch (error) {
    console.error(request.url, error)
    return NextResponse.json(
      { message: 'Error while get user by slug', data: null },
      { status: 500 },
    )
  }
}
