import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

import { verifyIdToken } from '@/lib/firebase-admin'
import { getUserByUid, simplifyResponseObject } from '@/lib/notion'
import { UserProfile } from '@/lib/types'

export async function GET(
  request: Request,
  { params }: { params: { uuid: string } },
) {
  const uid = params.uuid || ''
  try {
    const headersInstance = headers()
    const token = headersInstance.get('Authorization')

    if (token) {
      await verifyIdToken(token)

      const userInNotion = await getUserByUid(uid)

      if (userInNotion.results.length === 0) {
        return NextResponse.json(
          { message: `User ${uid} is not exist`, data: null },
          { status: 400 },
        )
      }

      const result = userInNotion.results[0]
      // @ts-ignore
      const properties = result.properties

      const simpleDataResponse = simplifyResponseObject<UserProfile>(properties)

      return NextResponse.json({
        message: `Found user ${uid}`,
        data: simpleDataResponse,
      })
    }

    return NextResponse.json(
      { message: `Can not found the session`, data: null },
      { status: 403 },
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: 'Error while get user by uuid' },
      { status: 500 },
    )
  }
}
