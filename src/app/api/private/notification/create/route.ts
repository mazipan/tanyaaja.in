import { revalidateTag } from 'next/cache'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

import { verifyIdToken } from '@/lib/firebase-admin'
import { createNotifChannelByUid } from '@/lib/notion'

export async function POST(request: Request) {
  const res = await request.json()
  const headersInstance = headers()
  const token = headersInstance.get('Authorization')

  try {
    if (token) {
      const decodedToken = await verifyIdToken(token)

      if (decodedToken?.uid) {
        await createNotifChannelByUid(res)

        revalidateTag(`notif-by-uid-${res.uid}`)

        return NextResponse.json({ message: 'Notif channel created' })
      }
    }

    return NextResponse.json(
      { message: `Can not found the session`, data: null },
      { status: 403 },
    )
  } catch (error) {
    console.error(request.url, error)
    return NextResponse.json(
      { message: 'Error while creating notif channel' },
      { status: 500 },
    )
  }
}
