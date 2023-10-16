import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

import { getUserByUid, simplifyResponseObject } from '@/lib/notion'
import { getNotifChannelByUid } from '@/lib/notion'
import { NotifChannel } from '@/lib/types'

export async function GET(
  request: Request,
  { params }: { params: { uid: string } },
) {
  const uid = params.uid || ''
  const headersInstance = headers()
  const token = headersInstance.get('Authorization')
  try {
    if (token) {
      const userInNotion = await getUserByUid(uid)

      if (userInNotion.results.length === 0) {
        return NextResponse.json(
          {
            message: `Can not found any custom og for user ${uid}`,
            data: null,
          },
          { status: 400 },
        )
      }

      const dataInNotion = await getNotifChannelByUid(uid)
      const results = dataInNotion?.results || []
      // @ts-ignore
      const simpleResults: NotifChannel[] = []

      results.forEach((result) => {
        // @ts-ignore
        const properties = result.properties

        const simpleDataResponse =
          simplifyResponseObject<NotifChannel>(properties)

        simpleResults.push(simpleDataResponse)
      })

      return NextResponse.json({
        message: `Found notif channel for user ${uid}`,
        data: simpleResults,
      })
    }

    return NextResponse.json(
      { message: `Can not found the session`, data: null },
      { status: 403 },
    )
  } catch (error) {
    console.error(request.url, error)
    return NextResponse.json(
      { message: 'Error while get notif channel by uid' },
      { status: 500 },
    )
  }
}
