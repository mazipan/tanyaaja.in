import { revalidatePath, revalidateTag } from 'next/cache'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

import { verifyIdToken } from '@/lib/firebase-admin'
import { getCustomOgByUid, updateCustomOgByUuid } from '@/lib/notion'

export async function PATCH(request: Request) {
  const res = await request.json()
  try {
    const headersInstance = headers()
    const token = headersInstance.get('Authorization')

    if (token) {
      const decodedToken = await verifyIdToken(token)

      if (decodedToken?.uid) {
        const existingOg = await getCustomOgByUid(decodedToken.uid)

        if (existingOg.results.length === 0) {
          return NextResponse.json(
            { message: 'Og is not exist' },
            { status: 400 },
          )
        } else {
          const foundPage = existingOg.results[0]
          await updateCustomOgByUuid(foundPage?.id, res)

          revalidatePath(`/p/${res.slug}`)
          revalidateTag(res.slug)
          revalidateTag(`og-by-uid-${res.uid}`)

          return NextResponse.json({ message: 'Custom og updated' })
        }
      }
    }

    return NextResponse.json(
      { message: `Can not found the session`, data: null },
      { status: 403 },
    )
  } catch (error) {
    console.error(request.url, error)
    return NextResponse.json(
      { message: 'Error while updating the user' },
      { status: 500 },
    )
  }
}
