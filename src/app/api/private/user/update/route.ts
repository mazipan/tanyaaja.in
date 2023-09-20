import { revalidatePath, revalidateTag } from 'next/cache'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

import { getUserByUid, updateUser } from '@/lib/notion'

export async function PATCH(request: Request) {
  const res = await request.json()
  try {
    const headersInstance = headers()
    const token = headersInstance.get('Authorization')

    if (token) {
      const userInNotion = await getUserByUid(res.uid)
      if (userInNotion.results.length === 0) {
        return NextResponse.json(
          { message: 'User is not exist' },
          { status: 400 },
        )
      } else {
        const foundPage = userInNotion.results[0]
        await updateUser({
          name: res.name,
          slug: res.slug,
          uid: res.uid,
          pageId: foundPage.id,
          image: res.image,
          public: res.public ?? false,
        })

        revalidatePath(`/p/${res.slug}`)
        revalidateTag(res.slug)

        revalidatePath(`/eksplor`)
        revalidateTag('public-users')

        return NextResponse.json({ message: 'User updated' })
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
