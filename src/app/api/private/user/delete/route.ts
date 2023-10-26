import { revalidatePath, revalidateTag } from 'next/cache'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

import { verifyIdToken } from '@/lib/firebase-admin'
import { deleteUser } from '@/lib/firebase-auth-edge';
import { archivePage, deleteQuestionsByUid, getUserByUid } from '@/lib/notion'

export const dynamic = 'force-dynamic'

export async function DELETE(request: Request) {
  const res = await request.json()
  try {
    const headersInstance = headers()
    const token = headersInstance.get('Authorization')

    if (token) {
      const decodedToken = await verifyIdToken(token)

      const userInNotion = await getUserByUid(decodedToken.uid)
      if (userInNotion.results.length === 0) {
        return NextResponse.json(
          { message: 'User does not exist' },
          { status: 400 },
        )
      }
      const foundPage = userInNotion.results[0]

      await Promise.allSettled([
        deleteQuestionsByUid(decodedToken.uid),
        archivePage(foundPage.id),
        deleteUser(decodedToken.uid),
      ]);

      revalidatePath(`/p/${res.slug}`)
      revalidateTag(res.slug)

      revalidatePath('/eksplor')
      revalidateTag('public-users')

      return NextResponse.json({ message: 'User deleted' })
    }

    return NextResponse.json(
      { message: 'Can not found the session', data: null },
      { status: 403 },
    )
  } catch (error) {
    console.error(request.url, error)
    return NextResponse.json(
      { message: 'Error while deleting the user' },
      { status: 500 },
    )
  }
}
