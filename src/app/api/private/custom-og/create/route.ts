import { revalidatePath, revalidateTag } from 'next/cache'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

import { verifyIdToken } from '@/lib/firebase-admin'
import { createCustomOgByUid } from '@/lib/notion'

export async function POST(request: Request) {
  const res = await request.json()
  const headersInstance = headers()
  const token = headersInstance.get('Authorization')

  try {
    if (token) {
      const decodedToken = await verifyIdToken(token)

      if (decodedToken?.uid) {
        await createCustomOgByUid(res)

        revalidatePath(`/p/${res.slug}`)
        revalidateTag(res.slug)
        revalidateTag(`og-by-uid-${res.uid}`)

        return NextResponse.json({ message: 'Custom og created' })
      }
    }

    return NextResponse.json(
      { message: `Can not found the session`, data: null },
      { status: 403 },
    )
  } catch (error) {
    console.error(request.url, error)
    return NextResponse.json(
      { message: 'Error while creating custom og' },
      { status: 500 },
    )
  }
}
