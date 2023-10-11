import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

import { getUserByUid } from '@/lib/notion'
import { getUpdates } from '@/lib/telegram'

export async function GET(
  request: Request,
  { params }: { params: { uid: string } },
) {
  const url = new URL(request.url)
  const searchParams = url.searchParams
  const username = (searchParams.get('u') as string) || ''

  const uid = params.uid || ''
  const headersInstance = headers()
  const token = headersInstance.get('Authorization')
  try {
    if (token) {
      const userInNotion = await getUserByUid(uid)

      if (userInNotion.results.length === 0) {
        return NextResponse.json(
          {
            message: `Can not found user ${uid}`,
            data: null,
          },
          { status: 400 },
        )
      }

      const result = await getUpdates(username)

      return NextResponse.json({
        message: `Found chat id for user ${uid}`,
        data: result,
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
