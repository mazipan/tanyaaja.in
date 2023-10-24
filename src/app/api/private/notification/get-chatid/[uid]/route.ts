import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

import { verifyIdToken } from '@/lib/firebase-admin'
import { getUpdates } from '@/lib/telegram'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const searchParams = url.searchParams
  const username = (searchParams.get('u') as string) || ''

  const headersInstance = headers()
  const token = headersInstance.get('Authorization')
  try {
    if (token) {
      const decodedToken = await verifyIdToken(token)

      const result = await getUpdates(username)

      return NextResponse.json({
        message: `Found chat id for user ${decodedToken.uid}`,
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
